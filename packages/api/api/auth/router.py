"""Authentication routes."""

from typing import Optional

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status

from ..models.user import User
from .dependencies import get_auth_service, get_current_user, get_current_user_optional
from .schemas import (
    AuthResponse,
    SessionResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from .service import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserRegisterRequest,
    response: Response,
    remember_me: bool = False,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    """Register a new user with enhanced cookie session."""
    user = auth_service.create_user(
        username=user_data.username, email=user_data.email, password=user_data.password
    )

    # Get the account to create a session
    account = user.accounts[0] if user.accounts else None
    if not account:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user account",
        )

    # Create session and token with enhanced features
    session, token = auth_service.create_session_with_token(
        account.id, remember_me=remember_me
    )

    # Set httpOnly cookie with appropriate duration
    max_age = (30 * 24 * 60 * 60) if remember_me else (7 * 24 * 60 * 60)
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=True,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=max_age,
    )

    return AuthResponse(
        message="User registered successfully", user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=AuthResponse)
def login(
    credentials: UserLoginRequest,
    response: Response,
    remember_me: bool = False,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    """Login user and create session with remember me option."""
    account = auth_service.authenticate_user(
        username=credentials.username, password=credentials.password
    )

    if not account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    # Create session and token with enhanced features
    session, token = auth_service.create_session_with_token(
        account.id, remember_me=remember_me
    )

    # Set httpOnly cookie with appropriate duration
    max_age = (30 * 24 * 60 * 60) if remember_me else (7 * 24 * 60 * 60)
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=max_age,
    )

    return AuthResponse(
        message="Login successful", user=UserResponse.model_validate(account.user)
    )


@router.post("/logout")
def logout(
    response: Response,
    session_token: Optional[str] = Cookie(None, alias="session"),
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Logout user and invalidate session."""
    # Revoke the session in database if token is available
    if session_token:
        auth_service.revoke_session_by_token(session_token)

    # Clear the session cookie
    response.delete_cookie(key="session", httponly=True, secure=True, samesite="lax")

    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Get current authenticated user information."""
    return UserResponse.model_validate(current_user)


@router.get("/session", response_model=Optional[SessionResponse])
def get_session_info(
    current_user: Optional[User] = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> Optional[SessionResponse]:
    """Get current session information."""
    if not current_user:
        return None

    # This is a simplified version - in a real app you'd track the session ID
    account = current_user.accounts[0] if current_user.accounts else None
    if not account or not account.sessions:
        return None

    session = account.sessions[0]  # Get the first session for demo
    return SessionResponse.model_validate(session)


@router.delete("/sessions")
def cleanup_expired_sessions(
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Clean up expired sessions (admin only for demo)."""
    deleted_count = auth_service.cleanup_expired_sessions()
    return {"message": f"Cleaned up {deleted_count} expired sessions"}


@router.post("/refresh")
def refresh_session(
    response: Response,
    session_token: Optional[str] = Cookie(None, alias="session"),
    extend_duration: bool = False,
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Refresh the current session token."""
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="No session token provided"
        )

    new_token = auth_service.refresh_session(session_token, extend_duration)

    if not new_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    # Set new cookie
    response.set_cookie(
        key="session",
        value=new_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 60 * 60 if extend_duration else 7 * 24 * 60 * 60,
    )

    return {"message": "Session refreshed successfully"}


@router.post("/logout-all")
def logout_all_sessions(
    response: Response,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Logout from all sessions for the current user."""
    account = current_user.accounts[0] if current_user.accounts else None
    revoked_count = auth_service.revoke_all_user_sessions(account.id) if account else 0

    # Clear the current session cookie
    response.delete_cookie(key="session", httponly=True, secure=True, samesite="lax")

    return {"message": f"Logged out from {revoked_count} sessions successfully"}


@router.get("/session-info")
def get_detailed_session_info(
    session_token: Optional[str] = Cookie(None, alias="session"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Get detailed session information from cookie."""
    if not session_token:
        return {"authenticated": False, "session": None}

    session_info = auth_service.get_session_info(session_token)

    return {
        "authenticated": current_user is not None,
        "user": UserResponse.model_validate(current_user) if current_user else None,
        "session": session_info,
    }
