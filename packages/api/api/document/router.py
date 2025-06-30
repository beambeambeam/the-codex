"""Document API routes."""

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session, joinedload

from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models.document import DocumentRelation
from ..models.user import User
from ..storage import storage_service
from .dependencies import (
    get_document_chat_or_404,
    get_document_chat_with_modify_permission,
    get_document_or_404,
    get_document_relation_or_404,
    get_document_relation_with_modify_permission,
    get_document_service,
    get_document_with_modify_permission,
)
from .schemas import (
    ChunkCreate,
    ChunkResponse,
    DocumentChatCreate,
    DocumentChatHistoryCreate,
    DocumentChatHistoryResponse,
    DocumentChatResponse,
    DocumentChatUpdate,
    DocumentChatWithHistory,
    DocumentCreate,
    DocumentDetailResponse,
    DocumentEdgeCreate,
    DocumentEdgeResponse,
    DocumentNodeCreate,
    DocumentNodeResponse,
    DocumentRelationCreate,
    DocumentRelationResponse,
    DocumentRelationWithNodes,
    DocumentResponse,
    DocumentUpdate,
)
from .service import DocumentService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def create_document(
    document_data: DocumentCreate,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new document."""
    return document_service.create_document(document_data, current_user)


@router.post(
    "/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED
)
async def upload_document(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
    *,
    file: UploadFile,
):
    """Upload a document file and create a document record."""
    try:
        from uuid import uuid4

        # Get file extension from original filename
        file_extension = ""
        if file.filename and "." in file.filename:
            file_extension = "." + file.filename.split(".")[-1].lower()

        # Generate UUID-based filename for storage
        uuid_filename = str(uuid4()) + file_extension
        object_name = (
            f"users/{current_user.id}/collections/{collection_id}/{uuid_filename}"
        )

        # Upload file to MinIO with UUID filename
        stored_path = await storage_service.upload_file_to_storage(file, object_name)

        # Determine file type from original filename
        file_type = (
            file.filename.split(".")[-1].lower()
            if file.filename and "." in file.filename
            else "unknown"
        )

        # Create document record with original filename for display
        from .schemas import DocumentCreate

        document_data = DocumentCreate(
            file_name=file.filename or "uploaded_file",
            source_file_path=stored_path,
            file_type=file_type,
            collection_id=collection_id,
        )

        return document_service.create_document(document_data, current_user)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload document: {str(e)}",
        ) from e


@router.get("/", response_model=list[DocumentResponse])
def list_user_documents(
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """List all documents for the current user."""
    return document_service.get_user_documents(current_user.id)


@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(
    document=Depends(get_document_or_404),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get a document with all details."""
    return document_service.get_document_with_details(document.id)


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    update_data: DocumentUpdate,
    document=Depends(get_document_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Update a document."""
    return document_service.update_document(document.id, update_data, current_user)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document=Depends(get_document_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Delete a document."""
    document_service.delete_document(document.id, current_user)


# Chunk routes
@router.post(
    "/{document_id}/chunks",
    response_model=ChunkResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_chunk(
    chunk_data: ChunkCreate,
    document=Depends(get_document_or_404),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new chunk for a document."""
    # Ensure the document_id in the data matches the URL parameter
    chunk_data.document_id = document.id
    return document_service.create_chunk(chunk_data, current_user)


@router.get("/{document_id}/chunks", response_model=list[ChunkResponse])
def list_document_chunks(
    document=Depends(get_document_or_404),
    document_service: DocumentService = Depends(get_document_service),
):
    """List all chunks for a document."""
    return document_service.get_document_chunks(document.id)


# Document Chat routes
@router.post(
    "/chats", response_model=DocumentChatResponse, status_code=status.HTTP_201_CREATED
)
def create_document_chat(
    chat_data: DocumentChatCreate,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new document chat."""
    return document_service.create_document_chat(chat_data, current_user)


@router.get("/{document_id}/chats", response_model=list[DocumentChatResponse])
def list_document_chats(
    document=Depends(get_document_or_404),
    document_service: DocumentService = Depends(get_document_service),
):
    """List all chats for a document."""
    return document_service.get_document_chats(document.id)


@router.get("/chats/{chat_id}", response_model=DocumentChatWithHistory)
def get_document_chat(
    chat=Depends(get_document_chat_or_404),
    document_service: DocumentService = Depends(get_document_service),
    limit: int = Query(
        100, ge=1, le=1000, description="Number of history items to return"
    ),
    offset: int = Query(0, ge=0, description="Number of history items to skip"),
):
    """Get a document chat with history."""
    history = document_service.get_chat_history(chat.id, limit, offset)

    # Convert to response model
    chat_response = DocumentChatWithHistory.model_validate(chat)
    chat_response.history = [
        DocumentChatHistoryResponse.model_validate(h) for h in history
    ]

    return chat_response


@router.put("/chats/{chat_id}", response_model=DocumentChatResponse)
def update_document_chat(
    update_data: DocumentChatUpdate,
    chat=Depends(get_document_chat_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Update a document chat."""
    return document_service.update_document_chat(chat.id, update_data, current_user)


@router.delete("/chats/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document_chat(
    chat=Depends(get_document_chat_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Delete a document chat."""
    document_service.delete_document_chat(chat.id, current_user)


# Chat History routes
@router.post(
    "/chats/{chat_id}/history",
    response_model=DocumentChatHistoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_chat_history(
    history_data: DocumentChatHistoryCreate,
    chat=Depends(get_document_chat_or_404),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Add a message to chat history."""
    # Ensure the chat_id in the data matches the URL parameter
    history_data.document_chat_id = chat.id
    return document_service.add_chat_history(history_data, current_user)


@router.get(
    "/chats/{chat_id}/history", response_model=list[DocumentChatHistoryResponse]
)
def get_chat_history(
    chat=Depends(get_document_chat_or_404),
    document_service: DocumentService = Depends(get_document_service),
    limit: int = Query(100, ge=1, le=1000, description="Number of messages"),
    offset: int = Query(0, ge=0, description="Number of messages to skip"),
):
    """Get chat history for a document chat."""
    return document_service.get_chat_history(chat.id, limit, offset)


# Document Relation routes
@router.post(
    "/relations",
    response_model=DocumentRelationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_document_relation(
    relation_data: DocumentRelationCreate,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new document relation."""
    return document_service.create_document_relation(relation_data, current_user)


@router.get("/{document_id}/relations", response_model=list[DocumentRelationWithNodes])
def list_document_relations(
    document=Depends(get_document_or_404),
    db: Session = Depends(get_db),
):
    """List all relations for a document with nodes and edges."""
    relations = (
        db.query(DocumentRelation)
        .options(
            joinedload(DocumentRelation.nodes),
            joinedload(DocumentRelation.edges),
        )
        .filter(DocumentRelation.document_id == document.id)
        .all()
    )

    return [
        DocumentRelationWithNodes(
            **DocumentRelationResponse.model_validate(relation).model_dump(),
            nodes=[
                DocumentNodeResponse.model_validate(node) for node in relation.nodes
            ],
            edges=[
                DocumentEdgeResponse.model_validate(edge) for edge in relation.edges
            ],
        )
        for relation in relations
    ]


@router.get("/relations/{relation_id}", response_model=DocumentRelationWithNodes)
def get_document_relation(
    relation=Depends(get_document_relation_or_404),
):
    """Get a document relation with nodes and edges."""
    return DocumentRelationWithNodes(
        **DocumentRelationResponse.model_validate(relation).model_dump(),
        nodes=[DocumentNodeResponse.model_validate(node) for node in relation.nodes],
        edges=[DocumentEdgeResponse.model_validate(edge) for edge in relation.edges],
    )


# Document Node routes
@router.post(
    "/relations/{relation_id}/nodes",
    response_model=DocumentNodeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_document_node(
    node_data: DocumentNodeCreate,
    relation=Depends(get_document_relation_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new document node."""
    # Ensure the relation_id in the data matches the URL parameter
    node_data.document_relation_id = relation.id
    return document_service.create_document_node(node_data, current_user)


# Document Edge routes
@router.post(
    "/relations/{relation_id}/edges",
    response_model=DocumentEdgeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_document_edge(
    edge_data: DocumentEdgeCreate,
    relation=Depends(get_document_relation_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new document edge."""
    # Ensure the relation_id in the data matches the URL parameter
    edge_data.document_relation_id = relation.id
    return document_service.create_document_edge(edge_data, current_user)
