"""Collection service for managing collections and related entities."""

from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..models.collection import (
    Collection,
    CollectionEdge,
    CollectionNode,
    CollectionRelation,
)
from ..models.user import User
from .permission.service import CollectionPermissionService
from .schemas import (
    CollectionCreate,
    CollectionEdgeCreate,
    CollectionNodeCreate,
    CollectionRelationCreate,
    CollectionUpdate,
)


class CollectionService:
    """Service for managing collections and related operations."""

    def __init__(self, db: Session):
        """Initialize collection service."""
        self.db = db
        self.permission_service = CollectionPermissionService(db)

    # Collection CRUD operations
    def create_collection(
        self, collection_data: CollectionCreate, user: User
    ) -> Collection:
        """Create a new collection."""
        collection = Collection(
            id=str(uuid4()),
            name=collection_data.name,
            description=collection_data.description,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(collection)
        self.db.commit()
        self.db.refresh(collection)

        # Automatically assign OWNER permission to the creator
        from ..models.collection import CollectionPermissionLevel

        self.permission_service.grant_permission(
            collection_id=collection.id,
            user_id=user.id,
            permission_level=CollectionPermissionLevel.OWNER,
            granted_by=user,
        )

        return collection

    def get_collection(self, collection_id: str) -> Optional[Collection]:
        """Get a collection by ID."""
        return self.db.query(Collection).filter(Collection.id == collection_id).first()

    def get_user_collections(self, user_id: str) -> list[Collection]:
        """Get all collections accessible by a user."""
        # Get collections where user has OWNER or EDIT permissions
        collections = (
            self._get_accessible_collections_query(user_id)
            .order_by(Collection.created_at.desc())
            .all()
        )
        self._populate_collection_usernames(collections)
        return collections

    def update_collection(
        self, collection_id: str, update_data: CollectionUpdate, user: User
    ) -> Collection:
        """Update a collection."""
        collection = self.get_collection(collection_id)
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
            )

        # Check if user has permission to update
        if not self._can_modify_collection(collection, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this collection",
            )

        # Update fields if provided
        if update_data.name is not None:
            collection.name = update_data.name
        if update_data.description is not None:
            collection.description = update_data.description

        collection.updated_by = user.id

        self.db.commit()
        self.db.refresh(collection)
        return collection

    def delete_collection(self, collection_id: str, user: User) -> bool:
        """Delete a collection."""
        collection = self.get_collection(collection_id)
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
            )

        # Check if user has permission to delete (only creator or OWNER)
        if not self._can_delete_collection(collection, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this collection",
            )

        self.db.delete(collection)
        self.db.commit()
        return True

    # Collection Relation operations
    def create_collection_relation(
        self, relation_data: CollectionRelationCreate, user: User
    ) -> CollectionRelation:
        """Create a new collection relation."""
        # Check if collection exists and user has permission
        collection = self.get_collection(relation_data.collection_id)
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
            )

        if not self._can_modify_collection(collection, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this collection",
            )

        relation = CollectionRelation(
            id=str(uuid4()),
            collection_id=relation_data.collection_id,
            title=relation_data.title,
            description=relation_data.description,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(relation)
        self.db.commit()
        self.db.refresh(relation)
        return relation

    def get_collection_relations(self, collection_id: str) -> list[CollectionRelation]:
        """Get all relations for a collection."""
        return (
            self.db.query(CollectionRelation)
            .filter(CollectionRelation.collection_id == collection_id)
            .order_by(CollectionRelation.created_at.desc())
            .all()
        )

    def get_collection_relation(self, relation_id: str) -> Optional[CollectionRelation]:
        """Get a collection relation by ID."""
        return (
            self.db.query(CollectionRelation)
            .options(
                joinedload(CollectionRelation.nodes),
                joinedload(CollectionRelation.edges),
            )
            .filter(CollectionRelation.id == relation_id)
            .first()
        )

    def delete_collection_relation(self, relation_id: str, user: User) -> bool:
        """Delete a collection relation."""
        relation = self.get_collection_relation(relation_id)
        if not relation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Relation not found"
            )

        # Check if user has permission to delete
        if not self._can_modify_relation(relation, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this relation",
            )

        self.db.delete(relation)
        self.db.commit()
        return True

    # Collection Node operations
    def create_collection_node(
        self, node_data: CollectionNodeCreate, user: User
    ) -> CollectionNode:
        """Create a new collection node."""
        relation = (
            self.db.query(CollectionRelation)
            .filter(CollectionRelation.id == node_data.collection_relation_id)
            .first()
        )

        if not relation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Relation not found"
            )

        if not self._can_modify_relation(relation, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this relation",
            )

        node = CollectionNode(
            id=str(uuid4()),
            collection_relation_id=node_data.collection_relation_id,
            title=node_data.title,
            description=node_data.description,
            type=node_data.type,
            label=node_data.label,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(node)
        self.db.commit()
        self.db.refresh(node)
        return node

    # Collection Edge operations
    def create_collection_edge(
        self, edge_data: CollectionEdgeCreate, user: User
    ) -> CollectionEdge:
        """Create a new collection edge."""
        relation = (
            self.db.query(CollectionRelation)
            .filter(CollectionRelation.id == edge_data.collection_relation_id)
            .first()
        )

        if not relation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Relation not found"
            )

        if not self._can_modify_relation(relation, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this relation",
            )

        edge = CollectionEdge(
            id=str(uuid4()),
            collection_relation_id=edge_data.collection_relation_id,
            label=edge_data.label,
            source=edge_data.source,
            target=edge_data.target,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(edge)
        self.db.commit()
        self.db.refresh(edge)
        return edge

    # Permission helper methods
    def _can_access_collection(self, collection: Collection, user: User) -> bool:
        """Check if user can access a collection."""
        # Check if user has EDIT permission (includes OWNER)
        return self.permission_service.can_edit_collection(collection.id, user.id)

    def _can_modify_collection(self, collection: Collection, user: User) -> bool:
        """Check if user can modify a collection."""
        # Check if user has EDIT permission (includes OWNER)
        return self.permission_service.can_edit_collection(collection.id, user.id)

    def _can_modify_relation(self, relation: CollectionRelation, user: User) -> bool:
        """Check if user can modify a relation."""
        return relation.created_by == user.id or self._can_modify_collection(
            relation.collection, user
        )

    def _can_delete_collection(self, collection: Collection, user: User) -> bool:
        """Check if user can delete a collection."""
        # Only OWNER can delete collections
        return self.permission_service.can_owner_collection(collection.id, user.id)

    def get_collection_with_details(self, collection_id: str) -> Optional[Collection]:
        """Get collection with all related data loaded."""
        return (
            self.db.query(Collection)
            .options(
                joinedload(Collection.relations).joinedload(CollectionRelation.nodes),
                joinedload(Collection.relations).joinedload(CollectionRelation.edges),
            )
            .filter(Collection.id == collection_id)
            .first()
        )

    def _populate_collection_usernames(self, collections: list[Collection]) -> None:
        """Helper to replace created_by and updated_by with usernames."""
        for collection in collections:
            collection.created_by = (
                collection.creator.username if collection.creator else None
            )
            collection.updated_by = (
                collection.updater.username if collection.updater else None
            )

    def search_collection_by_name(
        self,
        user: User,
        query: str,
    ) -> list[Collection]:
        """Search for collections by name or description."""
        # If query is empty, return all collections for the user
        if not query.strip():
            return self.get_user_collections(user.id)
        # Search by name or description for collections user has access to
        collections = (
            self._get_accessible_collections_query(user.id)
            .filter(
                Collection.name.ilike(f"%{query}%")
                | Collection.description.ilike(f"%{query}%")
            )
            .order_by(Collection.created_at.desc())
            .limit(10)
            .all()
        )
        self._populate_collection_usernames(collections)
        return collections

    def _get_accessible_collections_query(self, user_id: str):
        """Return base query for collections accessible by a user (OWNER or EDIT)."""
        from ..models.collection import CollectionPermission, CollectionPermissionLevel

        return (
            self.db.query(Collection)
            .options(joinedload(Collection.creator), joinedload(Collection.updater))
            .join(
                CollectionPermission,
                Collection.id == CollectionPermission.collection_id,
            )
            .filter(CollectionPermission.user_id == user_id)
            .filter(
                CollectionPermission.permission_level.in_(
                    [CollectionPermissionLevel.OWNER, CollectionPermissionLevel.EDIT]
                )
            )
        )
