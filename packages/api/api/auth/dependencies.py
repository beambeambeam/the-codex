"""Authentication dependencies."""

import os
from typing import Optional

from fastapi import Cookie, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import Account, User
from .service import AuthService


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Get authentication service instance."""
    secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    return AuthService(db, secret_key)


def get_current_user_optional(
    request: Request,
    session_token: Optional[str] = Cookie(None, alias="session"),
    auth_service: AuthService = Depends(get_auth_service),
) -> Optional[User]:
    """Get current user from session cookie (optional)."""
    if not session_token:
        return None

    try:
        payload = auth_service.verify_session_token(session_token)
        account_id = payload.get("account_id")

        if not account_id:
            return None

        account = auth_service.get_account_by_id(account_id)
        if not account or not account.user:
            return None

        return account.user
    except HTTPException:
        return None


def get_current_user(
    current_user: Optional[User] = Depends(get_current_user_optional),
) -> User:
    """Get current user from session cookie (required)."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return current_user


def get_current_account_optional(
    request: Request,
    session_token: Optional[str] = Cookie(None, alias="session"),
    auth_service: AuthService = Depends(get_auth_service),
) -> Optional[Account]:
    """Get current account from session cookie (optional)."""
    if not session_token:
        return None

    try:
        payload = auth_service.verify_session_token(session_token)
        account_id = payload.get("account_id")

        if not account_id:
            return None

        return auth_service.get_account_by_id(account_id)
    except HTTPException:
        return None


def get_current_account(
    current_account: Optional[Account] = Depends(get_current_account_optional),
) -> Account:
    """Get current account from session cookie (required)."""
    if not current_account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return current_account
