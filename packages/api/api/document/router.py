"""Document API routes."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session, joinedload

from ..agentic.dependencies import TextEmbedder, get_text_embedder
from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models.document import Document, DocumentRelation
from ..models.user import User
from ..storage import storage_service
from .dependencies import (
    get_document_or_404,
    get_document_relation_or_404,
    get_document_relation_with_modify_permission,
    get_document_service,
    get_document_with_modify_permission,
)
from .schemas import (
    ChunkCreate,
    ChunkResponse,
    ChunkSearchResponse,
    DocumentDetailResponse,
    DocumentEdgeCreate,
    DocumentEdgeResponse,
    DocumentNodeCreate,
    DocumentNodeResponse,
    DocumentRelationCreate,
    DocumentRelationResponse,
    DocumentRelationWithNodes,
    DocumentResponse,
    DocumentSearchResponse,
    DocumentUpdate,
)
from .service import DocumentServiceSearch as DocumentService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/", response_model=list[DocumentResponse])
def list_user_documents(
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """List all documents for the current user."""
    return document_service.get_user_documents(current_user.id)


@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(
    document: Document = Depends(get_document_or_404),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get a document with all details."""
    doc_details = document_service.get_document_with_details(document.id)
    if not doc_details:
        return None
    return DocumentDetailResponse(**doc_details)


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    update_data: DocumentUpdate,
    document: Document = Depends(get_document_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Update a document."""
    return document_service.update_document(document.id, update_data, current_user)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document: Document = Depends(get_document_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Delete a document."""
    # Delete the document file from storage
    storage_service.delete_file_from_storage(document.source_file_path)
    document_service.delete_document(document.id, current_user)


# Chunk routes
@router.post(
    "/{document_id}/chunks",
    response_model=ChunkResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_chunk(
    chunk_data: ChunkCreate,
    document: Document = Depends(get_document_or_404),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new chunk for a document."""
    # Ensure the document_id in the data matches the URL parameter
    chunk_data.document_id = document.id
    return document_service.create_chunk(chunk_data, current_user)


@router.get("/{document_id}/chunks", response_model=list[ChunkResponse])
def list_document_chunks(
    document: Document = Depends(get_document_or_404),
    document_service: DocumentService = Depends(get_document_service),
):
    """List all chunks for a document."""
    return document_service.get_document_chunks(document.id)


# Search Documents Chunks
@router.post(
    "/{document_id}/chunks/search",
    tags=["search"],
    response_model=list[ChunkSearchResponse],
    status_code=status.HTTP_200_OK,
)
def search_document_chunks(
    document: Document = Depends(get_document_or_404),
    query: str = Query(
        ...,
        min_length=1,
        description="Search query for chunks",
    ),
    text_embedder: TextEmbedder = Depends(get_text_embedder),
    document_service: DocumentService = Depends(get_document_service),
) -> list[ChunkSearchResponse]:
    """Search for chunks in a document."""
    # Convert query to embedding
    query_embedding = text_embedder.get_embedding(query)

    # Search chunks using the embedding
    return document_service.search_collection_chunks(
        collection_id=document.collection_id, query_embedding=query_embedding, top_k=5
    )


# Search Collection Chunks
@router.post(
    "/collection/{collection_id}/chunks/search",
    tags=["search"],
    response_model=list[ChunkSearchResponse],
    status_code=status.HTTP_200_OK,
)
def search_collection_chunks(
    collection_id: str,
    query: str = Query(
        ...,
        min_length=1,
        description="Search query for chunks",
    ),
    text_embedder: TextEmbedder = Depends(get_text_embedder),
    document_service: DocumentService = Depends(get_document_service),
) -> list[ChunkSearchResponse]:
    """Search for chunks in a collection."""
    # Convert query to embedding
    query_embedding = text_embedder.get_embedding(query)

    # Search chunks using the embedding
    return document_service.search_collection_chunks(
        collection_id=collection_id, query_embedding=query_embedding, top_k=5
    )


# Search Collection Documents
@router.post(
    "/collection/{collection_id}/documents/search",
    tags=["search"],
    response_model=list[DocumentSearchResponse],
    status_code=status.HTTP_200_OK,
)
def search_collection_documents(
    collection_id: str,
    query: str = Query(
        ...,
        min_length=1,
        description="Search query for documents",
    ),
    text_embedder: TextEmbedder = Depends(get_text_embedder),
    document_service: DocumentService = Depends(get_document_service),
) -> DocumentSearchResponse:
    """Search for documents in a collection."""
    # Convert query to embedding
    query_embedding = text_embedder.get_embedding(query)

    # Search documents using the embedding
    return document_service.search_collection_documents(
        collection_id=collection_id, query_embedding=query_embedding, top_k=10
    )


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


@router.get("/graph", response_model=DocumentRelationResponse)
def create_document_graph(
    document_id: str,
    nodes: list[DocumentNodeCreate],
    edges: list[DocumentEdgeCreate],
    current_user: User = Depends(get_current_user),
) -> DocumentRelation:
    """Create a document relation with nodes and edges."""
    # Create the relation
    relation = create_document_relation(
        DocumentRelationCreate(
            document_id=document_id,
            title="Graph Relation",
            description="Automatically created relation for graph",
        ),
    )
    # Create nodes
    for node_data in nodes:
        create_document_node(node_data=node_data, user=current_user)

    # Create edges
    for edge_data in edges:
        create_document_edge(edge_data=edge_data, user=current_user)

    return relation


@router.get("/{document_id}/relations", response_model=list[DocumentRelationWithNodes])
def list_document_relations(
    document: Document = Depends(get_document_or_404),
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
    relation: DocumentRelation = Depends(get_document_relation_or_404),
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
    relation: DocumentRelation = Depends(get_document_relation_with_modify_permission),
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
    relation: DocumentRelation = Depends(get_document_relation_with_modify_permission),
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new document edge."""
    # Ensure the relation_id in the data matches the URL parameter
    edge_data.document_relation_id = relation.id
    return document_service.create_document_edge(edge_data, current_user)
