"""Collection-specific exceptions."""

from fastapi import HTTPException, status


class CollectionException(HTTPException):
    """Base exception for collection-related errors."""

    pass


class CollectionNotFoundError(CollectionException):
    """Raised when a collection is not found."""

    def __init__(self, collection_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection with id '{collection_id}' not found",
        )


class CollectionAccessDeniedError(CollectionException):
    """Raised when user doesn't have permission to access a collection."""

    def __init__(self, action: str = "access"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Not authorized to {action} this collection",
        )


class CollectionChatNotFoundError(CollectionException):
    """Raised when a collection chat is not found."""

    def __init__(self, chat_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection chat with id '{chat_id}' not found",
        )


class CollectionChatAccessDeniedError(CollectionException):
    """Raised when user doesn't have permission to access a chat."""

    def __init__(self, action: str = "access"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Not authorized to {action} this chat",
        )


class CollectionRelationNotFoundError(CollectionException):
    """Raised when a collection relation is not found."""

    def __init__(self, relation_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection relation with id '{relation_id}' not found",
        )


class CollectionRelationAccessDeniedError(CollectionException):
    """Raised when user doesn't have permission to access a relation."""

    def __init__(self, action: str = "access"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Not authorized to {action} this relation",
        )


class CollectionValidationError(CollectionException):
    """Raised when collection data validation fails."""

    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {message}",
        )


class CollectionConflictError(CollectionException):
    """Raised when there's a conflict in collection data."""

    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT, detail=f"Conflict: {message}"
        )
