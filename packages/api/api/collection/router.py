"""Collection API routes."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session, joinedload

from ..auth.dependencies import get_current_user
from ..database import get_db
from ..document.dependencies import get_document_service
from ..document.schemas import DocumentResponse
from ..document.service import DocumentService
from ..models.collection import CollectionRelation
from ..models.user import User
from .dependencies import (
    get_collection_chat_history_or_404,
    get_collection_chat_or_404,
    get_collection_chat_with_modify_permission,
    get_collection_or_404,
    get_collection_relation_or_404,
    get_collection_relation_with_modify_permission,
    get_collection_service,
    get_collection_with_modify_permission,
)
from .schemas import (
    CollectionChatCreate,
    CollectionChatHistoryCreate,
    CollectionChatHistoryResponse,
    CollectionChatResponse,
    CollectionChatUpdate,
    CollectionChatWithHistory,
    CollectionCreate,
    CollectionDetailResponse,
    CollectionEdgeCreate,
    CollectionEdgeResponse,
    CollectionNodeCreate,
    CollectionNodeResponse,
    CollectionRelationCreate,
    CollectionRelationResponse,
    CollectionRelationWithNodes,
    CollectionResponse,
    CollectionUpdate,
)
from .service import CollectionService

router = APIRouter(prefix="/collections", tags=["collections"])


@router.post(
    "/", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED
)
def create_collection(
    collection_data: CollectionCreate,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection."""
    return collection_service.create_collection(collection_data, current_user)


@router.get("/", response_model=list[CollectionResponse])
def list_user_collections(
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """List all collections for the current user."""
    return collection_service.get_user_collections(current_user.id)


@router.get("/{collection_id}", response_model=CollectionDetailResponse)
def get_collection(
    collection=Depends(get_collection_or_404),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Get a collection with all details."""
    return collection_service.get_collection_with_details(collection.id)


@router.put("/{collection_id}", response_model=CollectionResponse)
def update_collection(
    update_data: CollectionUpdate,
    collection=Depends(get_collection_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Update a collection."""
    return collection_service.update_collection(
        collection.id, update_data, current_user
    )


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection(
    collection=Depends(get_collection_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Delete a collection."""
    collection_service.delete_collection(collection.id, current_user)


@router.get("/{collection_id}/documents", response_model=list[DocumentResponse])
def list_collection_documents(
    collection=Depends(get_collection_or_404),
    document_service: DocumentService = Depends(get_document_service),
):
    """List all documents in a collection."""
    return document_service.get_collection_documents(collection.id)


# Collection Chat routes
@router.post(
    "/chats", response_model=CollectionChatResponse, status_code=status.HTTP_201_CREATED
)
def create_collection_chat(
    chat_data: CollectionChatCreate,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection chat."""
    return collection_service.create_collection_chat(chat_data, current_user)


@router.get("/{collection_id}/chats", response_model=list[CollectionChatResponse])
def list_collection_chats(
    collection=Depends(get_collection_or_404),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """List all chats for a collection."""
    return collection_service.get_collection_chats(collection.id)


@router.get("/chats/{collection_chat_id}", response_model=CollectionChatResponse)
def get_collection_chat(
    chat=Depends(get_collection_chat_or_404),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Get a specific collection chat."""
    return collection_service.get_collection_chat(chat.id)


@router.put("/chats/{collection_chat_id}", response_model=CollectionChatResponse)
def update_collection_chat(
    update_data: CollectionChatUpdate,
    chat=Depends(get_collection_chat_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Update a collection chat."""
    return collection_service.update_collection_chat(chat.id, update_data, current_user)


@router.delete("/chats/{collection_chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection_chat(
    chat=Depends(get_collection_chat_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Delete a collection chat."""
    collection_service.delete_collection_chat(chat.id, current_user)


@router.get(
    "/chats/{collection_chat_id}/history", response_model=CollectionChatWithHistory
)
def list_collection_chat_history(
    chat=Depends(get_collection_chat_or_404),
    collection_service: CollectionService = Depends(get_collection_service),
    limit: int = Query(
        100, ge=1, le=1000, description="Number of history items to return"
    ),
    offset: int = Query(0, ge=0, description="Number of history items to skip"),
):
    """Get a collection chat with history."""
    history = collection_service.get_chat_history_list(chat.id, limit, offset)

    # Convert to response model
    chat_response = CollectionChatWithHistory.model_validate(chat)
    chat_response.history = [
        CollectionChatHistoryResponse.model_validate(h) for h in history
    ]

    return chat_response


@router.delete(
    "/chats/{collection_chat_id}/history", status_code=status.HTTP_204_NO_CONTENT
)
def clear_chat_history(
    chat=Depends(get_collection_chat_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Clear chat history for a collection chat."""
    collection_service.clear_chat_history(chat.id, current_user)


# Chat History routes
@router.post(
    "/chats/{collection_chat_id}/history",
    response_model=CollectionChatHistoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_chat_history(
    history_data: CollectionChatHistoryCreate,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Add a message to chat history."""
    # Ensure the chat_id in the data matches the URL parameter
    return collection_service.add_chat_history(history_data, current_user)


@router.get("/history/{history_id}", response_model=CollectionChatHistoryResponse)
def get_chat_history(
    history=Depends(get_collection_chat_history_or_404),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Get a specific chat history item."""
    return collection_service.get_chat_history(history.id)


@router.post(
    "/history/{history_id}/edit",
    status_code=status.HTTP_201_CREATED,
)
def edit_chat_history(
    history_id: str,
    new_history_data: CollectionChatHistoryCreate,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Edit a chat history item."""
    if collection_service.edit_chat_history(history_id, current_user, new_history_data):
        return {"message": "Chat history edited successfully"}


# Collection Relation routes
@router.post(
    "/relations",
    response_model=CollectionRelationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collection_relation(
    relation_data: CollectionRelationCreate,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection relation."""
    return collection_service.create_collection_relation(relation_data, current_user)


@router.get(
    "/{collection_id}/relations", response_model=list[CollectionRelationWithNodes]
)
def list_collection_relations(
    collection=Depends(get_collection_or_404),
    db: Session = Depends(get_db),
):
    """List all relations for a collection with nodes and edges."""
    relations = (
        db.query(CollectionRelation)
        .options(
            joinedload(CollectionRelation.nodes),
            joinedload(CollectionRelation.edges),
        )
        .filter(CollectionRelation.collection_id == collection.id)
        .all()
    )

    return [
        CollectionRelationWithNodes(
            **CollectionRelationResponse.model_validate(relation).model_dump(),
            nodes=[
                CollectionNodeResponse.model_validate(node) for node in relation.nodes
            ],
            edges=[
                CollectionEdgeResponse.model_validate(edge) for edge in relation.edges
            ],
        )
        for relation in relations
    ]


@router.get("/relations/{relation_id}", response_model=CollectionRelationWithNodes)
def get_collection_relation(
    relation=Depends(get_collection_relation_or_404),
):
    """Get a collection relation with nodes and edges."""
    return CollectionRelationWithNodes(
        **CollectionRelationResponse.model_validate(relation).model_dump(),
        nodes=[CollectionNodeResponse.model_validate(node) for node in relation.nodes],
        edges=[CollectionEdgeResponse.model_validate(edge) for edge in relation.edges],
    )


# Collection Node routes
@router.post(
    "/relations/{relation_id}/nodes",
    response_model=CollectionNodeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collection_node(
    node_data: CollectionNodeCreate,
    relation=Depends(get_collection_relation_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection node."""
    # Ensure the relation_id in the data matches the URL parameter
    node_data.collection_relation_id = relation.id
    return collection_service.create_collection_node(node_data, current_user)


# Collection Edge routes
@router.post(
    "/relations/{relation_id}/edges",
    response_model=CollectionEdgeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collection_edge(
    edge_data: CollectionEdgeCreate,
    relation=Depends(get_collection_relation_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection edge."""
    # Ensure the relation_id in the data matches the URL parameter
    edge_data.collection_relation_id = relation.id
    return collection_service.create_collection_edge(edge_data, current_user)
