"""Collection permission schemas."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class PermissionGrantRequest(BaseModel):
    """Request schema for granting permission."""

    user_id: str
    permission_level: Literal["edit"] = "edit"


class PermissionResponse(BaseModel):
    """Response schema for permission."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    collection_id: str
    user_id: str
    permission_level: Literal["edit"]
    granted_by: str
    created_at: datetime
    updated_at: datetime


class PermissionLogResponse(BaseModel):
    """Response schema for permission log."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    collection_id: str
    user_id: str
    action: Literal["granted", "revoked"]
    permission_level: Literal["edit"]
    performed_by: str
    created_at: datetime


class UserPermissionResponse(BaseModel):
    """Response schema for user permission with user details."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    collection_id: str
    user_id: str
    username: str
    email: str
    permission_level: Literal["edit"]
    granted_by: str
    granter_username: str
    created_at: datetime
    updated_at: datetime


class PermissionLogWithUserResponse(BaseModel):
    """Response schema for permission log with user details."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    collection_id: str
    user_id: str
    username: str
    email: str
    action: Literal["granted", "revoked"]
    permission_level: Literal["edit"]
    performed_by: str
    performer_username: str
    created_at: datetime
