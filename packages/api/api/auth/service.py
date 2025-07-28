"""Authentication utilities."""

from datetime import datetime, timedelta
from typing import Optional
from uuid import uuid4

import bcrypt
import jwt
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.user import Account, User
from ..models.user import Session as SessionModel


class AuthService:
    """Authentication service for handling user auth operations."""

    def __init__(self, db: Session, secret_key: str):
        """Initialize auth service."""
        self.db = db
        self.secret_key = secret_key
        self.algorithm = "HS256"
        # Default session durations
        self.default_session_duration = timedelta(days=7)  # 7 days default
        self.remember_me_duration = timedelta(days=30)  # 30 days for remember me

    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt."""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

    def create_session_token(
        self,
        account_id: str,
        session_id: str,
        expires_delta: Optional[timedelta] = None,
        remember_me: bool = False,
    ) -> str:
        """Create a session token with enhanced security."""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        elif remember_me:
            expire = datetime.utcnow() + self.remember_me_duration
        else:
            expire = datetime.utcnow() + self.default_session_duration

        payload = {
            "account_id": account_id,
            "session_id": session_id,  # Include session ID for revocation
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "session",
            "remember_me": remember_me,
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def verify_session_token(self, token: str) -> dict:
        """Verify and decode a session token with session validation."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            if payload.get("type") != "session":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type",
                )

            # Verify session still exists in database
            session_id = payload.get("session_id")
            if session_id and not self.get_session(session_id):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session has been revoked",
                )

            return payload
        except jwt.exceptions.JWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session token"
            ) from exc

    def create_user(self, username: str, email: str, password: str) -> User:
        """Create a new user with account."""
        # Check if user already exists
        existing_user = (
            self.db.query(User)
            .filter((User.username == username) | (User.email == email))
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists",
            )

        # Create user
        user = User(id=str(uuid4()), username=username, email=email)
        self.db.add(user)
        self.db.flush()

        # Create account
        account = Account(
            id=str(uuid4()), password=self.hash_password(password), user_id=user.id
        )
        self.db.add(account)
        self.db.commit()
        self.db.refresh(user)

        return user

    def authenticate_user(self, username: str, password: str) -> Optional[Account]:
        """Authenticate a user by username and password."""
        user = self.db.query(User).filter(User.username == username).first()
        if not user:
            return None

        account = self.db.query(Account).filter(Account.user_id == user.id).first()
        if not account:
            return None

        if not self.verify_password(password, account.password):
            return None

        return account

    def create_session_with_token(
        self,
        account_id: str,
        expires_delta: Optional[timedelta] = None,
        remember_me: bool = False,
    ) -> tuple[SessionModel, str]:
        """Create a session and return both session model and JWT token."""
        # Create session in database
        session = self.create_session(account_id, expires_delta)

        # Create JWT token with session ID
        token = self.create_session_token(
            account_id=account_id,
            session_id=session.id,
            expires_delta=expires_delta,
            remember_me=remember_me,
        )

        return session, token

    def create_session(
        self, account_id: str, expires_delta: Optional[timedelta] = None
    ) -> SessionModel:
        """Create a new session for an account."""
        if expires_delta:
            expires_at = datetime.utcnow() + expires_delta
        else:
            expires_at = datetime.utcnow() + self.default_session_duration

        session = SessionModel(
            id=str(uuid4()), account_id=account_id, expires_at=expires_at
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        return session

    def get_session(self, session_id: str) -> Optional[SessionModel]:
        """Get a session by ID."""
        return (
            self.db.query(SessionModel)
            .filter(
                SessionModel.id == session_id,
                SessionModel.expires_at > datetime.utcnow(),
            )
            .first()
        )

    def delete_session(self, session_id: str) -> bool:
        """Delete a session."""
        session = (
            self.db.query(SessionModel).filter(SessionModel.id == session_id).first()
        )
        if session:
            self.db.delete(session)
            self.db.commit()
            return True
        return False

    def revoke_session_by_token(self, token: str) -> bool:
        """Revoke a session using its JWT token."""
        try:
            payload = self.verify_session_token(token)
            session_id = payload.get("session_id")
            if session_id:
                return self.delete_session(session_id)
        except HTTPException:
            pass
        return False

    def revoke_all_user_sessions(self, account_id: str) -> int:
        """Revoke all sessions for a specific account."""
        deleted_count = (
            self.db.query(SessionModel)
            .filter(SessionModel.account_id == account_id)
            .delete()
        )
        self.db.commit()
        return deleted_count

    def get_account_by_id(self, account_id: str) -> Optional[Account]:
        """Get account by ID."""
        return self.db.query(Account).filter(Account.id == account_id).first()

    def cleanup_expired_sessions(self) -> int:
        """Clean up expired sessions. Returns number of deleted sessions."""
        deleted_count = (
            self.db.query(SessionModel)
            .filter(SessionModel.expires_at <= datetime.utcnow())
            .delete()
        )
        self.db.commit()
        return deleted_count

    def refresh_session(
        self, token: str, extend_duration: bool = False
    ) -> Optional[str]:
        """Refresh a session token with optional duration extension."""
        try:
            payload = self.verify_session_token(token)
            account_id = payload.get("account_id")
            session_id = payload.get("session_id")
            remember_me = payload.get("remember_me", False)

            if not account_id or not session_id:
                return None

            # Check if session exists
            session = self.get_session(session_id)
            if not session:
                return None

            # Optionally extend session duration
            if extend_duration:
                new_expires_delta = (
                    self.remember_me_duration
                    if remember_me
                    else self.default_session_duration
                )
                session.expires_at = datetime.utcnow() + new_expires_delta
                self.db.commit()

            # Create new token
            return self.create_session_token(
                account_id=account_id, session_id=session_id, remember_me=remember_me
            )

        except HTTPException:
            return None

    def get_session_info(self, token: str) -> Optional[dict]:
        """Get session information from token."""
        try:
            payload = self.verify_session_token(token)
            session_id = payload.get("session_id")

            if session_id:
                session = self.get_session(session_id)
                if session:
                    return {
                        "session_id": session.id,
                        "account_id": session.account_id,
                        "expires_at": session.expires_at,
                        "remember_me": payload.get("remember_me", False),
                        "issued_at": datetime.fromtimestamp(payload.get("iat", 0)),
                    }
        except HTTPException:
            pass
        return None
