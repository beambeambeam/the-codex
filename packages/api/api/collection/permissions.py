"""Collection permissions and access control utilities."""

from enum import Enum
from typing import Union

from ..models.collection import Collection, CollectionChat, CollectionRelation
from ..models.user import User


class CollectionPermission(str, Enum):
    """Collection permission levels."""

    READ = "read"
    WRITE = "write"
    ADMIN = "admin"


class CollectionAccessControl:
    """Access control utilities for collections."""

    @staticmethod
    def can_read_collection(collection: Collection, user: User) -> bool:
        """Check if user can read a collection."""
        # For now, only creator can read
        # TODO: Implement sharing and team permissions
        return collection.created_by == user.id

    @staticmethod
    def can_write_collection(collection: Collection, user: User) -> bool:
        """Check if user can write to a collection."""
        # For now, only creator can write
        # TODO: Implement sharing and team permissions
        return collection.created_by == user.id

    @staticmethod
    def can_admin_collection(collection: Collection, user: User) -> bool:
        """Check if user has admin access to a collection."""
        # For now, only creator has admin access
        return collection.created_by == user.id

    @staticmethod
    def can_read_chat(chat: CollectionChat, user: User) -> bool:
        """Check if user can read a chat."""
        return CollectionAccessControl.can_read_collection(chat.collection, user)

    @staticmethod
    def can_write_chat(chat: CollectionChat, user: User) -> bool:
        """Check if user can write to a chat."""
        # Chat creator or collection admin can write
        return (
            chat.created_by == user.id
            or CollectionAccessControl.can_admin_collection(chat.collection, user)
        )

    @staticmethod
    def can_admin_chat(chat: CollectionChat, user: User) -> bool:
        """Check if user has admin access to a chat."""
        # Chat creator or collection admin can admin
        return (
            chat.created_by == user.id
            or CollectionAccessControl.can_admin_collection(chat.collection, user)
        )

    @staticmethod
    def can_read_relation(relation: CollectionRelation, user: User) -> bool:
        """Check if user can read a relation."""
        return CollectionAccessControl.can_read_collection(relation.collection, user)

    @staticmethod
    def can_write_relation(relation: CollectionRelation, user: User) -> bool:
        """Check if user can write to a relation."""
        # Relation creator or collection admin can write
        return (
            relation.created_by == user.id
            or CollectionAccessControl.can_admin_collection(relation.collection, user)
        )

    @staticmethod
    def can_admin_relation(relation: CollectionRelation, user: User) -> bool:
        """Check if user has admin access to a relation."""
        # Relation creator or collection admin can admin
        return (
            relation.created_by == user.id
            or CollectionAccessControl.can_admin_collection(relation.collection, user)
        )

    @staticmethod
    def get_user_permission_level(
        resource: Union[Collection, CollectionChat, CollectionRelation], user: User
    ) -> CollectionPermission:
        """Get the highest permission level a user has for a resource."""
        if isinstance(resource, Collection):
            if CollectionAccessControl.can_admin_collection(resource, user):
                return CollectionPermission.ADMIN
            elif CollectionAccessControl.can_write_collection(resource, user):
                return CollectionPermission.WRITE
            elif CollectionAccessControl.can_read_collection(resource, user):
                return CollectionPermission.READ
        elif isinstance(resource, CollectionChat):
            if CollectionAccessControl.can_admin_chat(resource, user):
                return CollectionPermission.ADMIN
            elif CollectionAccessControl.can_write_chat(resource, user):
                return CollectionPermission.WRITE
            elif CollectionAccessControl.can_read_chat(resource, user):
                return CollectionPermission.READ
        elif isinstance(resource, CollectionRelation):
            if CollectionAccessControl.can_admin_relation(resource, user):
                return CollectionPermission.ADMIN
            elif CollectionAccessControl.can_write_relation(resource, user):
                return CollectionPermission.WRITE
            elif CollectionAccessControl.can_read_relation(resource, user):
                return CollectionPermission.READ

        # No permission
        raise ValueError("No permission for resource")

    @staticmethod
    def filter_collections_by_permission(
        collections: list[Collection],
        user: User,
        permission: CollectionPermission = CollectionPermission.READ,
    ) -> list[Collection]:
        """Filter collections by user permission level."""
        filtered = []
        for collection in collections:
            try:
                user_permission = CollectionAccessControl.get_user_permission_level(
                    collection, user
                )
                # Check if user has at least the required permission
                if (
                    permission == CollectionPermission.READ
                    or (
                        permission == CollectionPermission.WRITE
                        and user_permission
                        in [CollectionPermission.WRITE, CollectionPermission.ADMIN]
                    )
                    or (
                        permission == CollectionPermission.ADMIN
                        and user_permission == CollectionPermission.ADMIN
                    )
                ):
                    filtered.append(collection)
            except ValueError:
                # User has no permission, skip
                continue

        return filtered
