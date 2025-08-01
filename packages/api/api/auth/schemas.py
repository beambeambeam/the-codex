"""Authentication request/response models."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserRegisterRequest(BaseModel):
    """User registration request."""

    username: str
    email: EmailStr
    password: str


class UserLoginRequest(BaseModel):
    """User login request."""

    username: str
    password: str


class UserResponse(BaseModel):
    """User response model."""

    id: str
    username: str
    email: str
    created_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True


class AuthResponse(BaseModel):
    """Authentication response."""

    message: str
    user: UserResponse


class SessionResponse(BaseModel):
    """Session response."""

    id: str
    account_id: Optional[str]
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        """Pydantic config."""

        from_attributes = True


class UserLoginWithRememberRequest(BaseModel):
    """User login request with remember me option."""

    username: str
    password: str
    remember_me: bool = False


class UserRegisterWithRememberRequest(BaseModel):
    """User registration request with remember me option."""

    username: str
    email: EmailStr
    password: str
    remember_me: bool = False


class EnhancedSessionResponse(BaseModel):
    """Enhanced session response with more details."""

    session_id: str
    account_id: str
    expires_at: datetime
    remember_me: bool
    issued_at: datetime


class UserSearchResponse(BaseModel):
    """User search response model."""

    id: str
    username: str
    email: str

    class Config:
        """Pydantic config."""

        from_attributes = True
