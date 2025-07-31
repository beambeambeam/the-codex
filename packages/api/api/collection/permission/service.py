"""Collection permission service."""

from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ...models.collection import (
    Collection,
    CollectionPermission,
    CollectionPermissionAction,
    CollectionPermissionLevel,
    CollectionPermissionLog,
)
from ...models.user import User


class CollectionPermissionService:
    """Service for managing collection permissions."""

    def __init__(self, db: Session):
        """Initialize permission service."""
        self.db = db

    def grant_permission(
        self,
        collection_id: str,
        user_id: str,
        permission_level: CollectionPermissionLevel,
        granted_by: User,
    ) -> CollectionPermission:
        """Grant permission to a user for a collection."""
        # Check if collection exists
        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
            )

        # Check if user exists
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        # Check if permission already exists
        existing_permission = (
            self.db.query(CollectionPermission)
            .filter(
                CollectionPermission.collection_id == collection_id,
                CollectionPermission.user_id == user_id,
            )
            .first()
        )

        if existing_permission:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Permission already exists for this user",
            )

        # Create permission
        permission = CollectionPermission(
            id=str(uuid4()),
            collection_id=collection_id,
            user_id=user_id,
            permission_level=permission_level,
            granted_by=granted_by.id,
        )

        self.db.add(permission)

        # Create audit log
        log_entry = CollectionPermissionLog(
            id=str(uuid4()),
            collection_id=collection_id,
            user_id=user_id,
            action=CollectionPermissionAction.GRANTED,
            permission_level=permission_level,
            performed_by=granted_by.id,
        )

        self.db.add(log_entry)
        self.db.commit()
        self.db.refresh(permission)

        return permission

    def revoke_permission(
        self, collection_id: str, user_id: str, revoked_by: User
    ) -> None:
        """Revoke permission from a user for a collection."""
        # Check if permission exists
        permission = (
            self.db.query(CollectionPermission)
            .filter(
                CollectionPermission.collection_id == collection_id,
                CollectionPermission.user_id == user_id,
            )
            .first()
        )

        if not permission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found"
            )

        # Create audit log before deleting
        log_entry = CollectionPermissionLog(
            id=str(uuid4()),
            collection_id=collection_id,
            user_id=user_id,
            action=CollectionPermissionAction.REVOKED,
            permission_level=permission.permission_level,
            performed_by=revoked_by.id,
        )

        self.db.add(log_entry)
        self.db.delete(permission)
        self.db.commit()

    def get_user_permissions(self, collection_id: str) -> List[CollectionPermission]:
        """Get all permissions for a collection."""
        return (
            self.db.query(CollectionPermission)
            .filter(CollectionPermission.collection_id == collection_id)
            .all()
        )

    def get_user_permission(
        self, collection_id: str, user_id: str
    ) -> Optional[CollectionPermission]:
        """Get a specific user's permission for a collection."""
        return (
            self.db.query(CollectionPermission)
            .filter(
                CollectionPermission.collection_id == collection_id,
                CollectionPermission.user_id == user_id,
            )
            .first()
        )

    def check_user_permission(
        self,
        collection_id: str,
        user_id: str,
        required_level: CollectionPermissionLevel,
    ) -> bool:
        """Check if a user has the required permission level for a collection."""
        # First check if user is the creator (has full access)
        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if collection and collection.created_by == user_id:
            return True

        # Check explicit permissions
        permission = self.get_user_permission(collection_id, user_id)
        if not permission:
            return False

        return permission.permission_level == required_level

    def can_edit_collection(self, collection_id: str, user_id: str) -> bool:
        """Check if user can edit a collection."""
        return self.check_user_permission(
            collection_id, user_id, CollectionPermissionLevel.EDIT
        )

    def get_permission_logs(self, collection_id: str) -> List[CollectionPermissionLog]:
        """Get all permission logs for a collection."""
        return (
            self.db.query(CollectionPermissionLog)
            .filter(CollectionPermissionLog.collection_id == collection_id)
            .order_by(CollectionPermissionLog.created_at.desc())
            .all()
        )

    def get_user_permission_logs(self, user_id: str) -> List[CollectionPermissionLog]:
        """Get all permission logs for a user."""
        return (
            self.db.query(CollectionPermissionLog)
            .filter(CollectionPermissionLog.user_id == user_id)
            .order_by(CollectionPermissionLog.created_at.desc())
            .all()
        )
