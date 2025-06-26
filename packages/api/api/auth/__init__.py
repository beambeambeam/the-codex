"""Authentication module."""

from .dependencies import (
    get_auth_service,
    get_current_account,
    get_current_account_optional,
    get_current_user,
    get_current_user_optional,
)
from .router import router
from .schemas import (
    AuthResponse,
    SessionResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from .service import AuthService

__all__ = [
    "AuthService",
    "router",
    "get_auth_service",
    "get_current_user",
    "get_current_user_optional",
    "get_current_account",
    "get_current_account_optional",
    "UserRegisterRequest",
    "UserLoginRequest",
    "UserResponse",
    "AuthResponse",
    "SessionResponse",
]
