"""Collection dependencies for FastAPI."""

from typing import Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models.collection import (
    Collection,
    CollectionChat,
    CollectionChatHistory,
    CollectionRelation,
)
from ..models.user import User
from .service import CollectionService


def get_collection_service(db: Session = Depends(get_db)) -> CollectionService:
    """Get collection service instance."""
    return CollectionService(db)


def get_collection_or_404(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> Collection:
    """Get collection by ID or raise 404."""
    collection = collection_service.get_collection(collection_id)
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )

    # Check access permission
    if not collection_service._can_access_collection(collection, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this collection",
        )

    return collection


def get_collection_with_modify_permission(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> Collection:
    """Get collection with modify permission or raise error."""
    collection = collection_service.get_collection(collection_id)
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )

    # Check modify permission
    if not collection_service._can_modify_collection(collection, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this collection",
        )

    return collection


def get_collection_chat_or_404(
    collection_chat_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionChat:
    """Get collection chat by ID or raise 404."""
    chat = collection_service.get_collection_chat(collection_chat_id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )

    # Check access permission through collection
    if not collection_service._can_access_chat(chat, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this chat",
        )

    return chat


def get_collection_chat_with_modify_permission(
    collection_chat_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionChat:
    """Get collection chat with modify permission or raise error."""
    chat = collection_service.get_collection_chat(collection_chat_id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )

    # Check modify permission
    if not collection_service._can_modify_chat(chat, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this chat",
        )

    return chat


def get_collection_chat_history_or_404(
    history_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionChatHistory:
    """Get collection chat history by ID or raise 404."""
    history = collection_service.get_chat_history(history_id)

    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="History not found"
        )

    # Check access permission through collection
    if not collection_service._can_access_chat(history.chat, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this chat",
        )

    return history


def get_collection_chat_history_with_modify_permission(
    history_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionChatHistory:
    """Get collection chat history with modify permission or raise error."""
    history = collection_service.get_chat_history(history_id)

    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="History not found"
        )

    # Check modify permission
    if not collection_service._can_modify_chat(history.chat, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this chat",
        )

    return history


def get_collection_relation_or_404(
    relation_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionRelation:
    """Get collection relation by ID or raise 404."""
    relation = (
        collection_service.db.query(CollectionRelation)
        .filter(CollectionRelation.id == relation_id)
        .first()
    )

    if not relation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Relation not found"
        )

    # Check access permission through collection
    if not collection_service._can_access_collection(relation.collection, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this relation",
        )

    return relation


def get_collection_relation_with_modify_permission(
    relation_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionRelation:
    """Get collection relation with modify permission or raise error."""
    relation = (
        collection_service.db.query(CollectionRelation)
        .filter(CollectionRelation.id == relation_id)
        .first()
    )

    if not relation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Relation not found"
        )

    # Check modify permission
    if not collection_service._can_modify_relation(relation, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this relation",
        )

    return relation


# Optional dependencies for cases where resource might not exist
def get_collection_optional(
    collection_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> Optional[Collection]:
    """Get collection by ID (optional)."""
    if not collection_id:
        return None

    collection = collection_service.get_collection(collection_id)
    if not collection:
        return None

    # Check access permission
    if not collection_service._can_access_collection(collection, current_user):
        return None

    return collection
