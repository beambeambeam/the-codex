"""Document schemas for request/response validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from ..models.enum import Role


class DocumentBase(BaseModel):
    """Base document schema."""

    file_name: str = Field(
        ..., min_length=1, max_length=255, description="Document file name"
    )
    source_file_path: str = Field(..., description="Source file path")
    file_type: str = Field(..., description="File type (pdf, txt, doc, etc.)")


class DocumentCreate(DocumentBase):
    """Schema for creating a document."""

    collection_id: str = Field(
        ..., description="Collection ID this document belongs to"
    )


class DocumentUpdate(BaseModel):
    """Schema for updating a document."""

    file_name: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Document file name"
    )
    source_file_path: Optional[str] = Field(None, description="Source file path")
    file_type: Optional[str] = Field(None, description="File type")
    is_vectorized: Optional[bool] = Field(
        None, description="Whether document is vectorized"
    )
    is_graph_extracted: Optional[bool] = Field(
        None, description="Whether knowledge graph is extracted"
    )


class DocumentResponse(DocumentBase):
    """Schema for document response."""

    id: str
    collection_id: str
    is_vectorized: bool
    is_graph_extracted: bool
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class ChunkBase(BaseModel):
    """Base chunk schema."""

    chunk_text: str = Field(..., min_length=1, description="Chunk text content")
    page_number: Optional[int] = Field(None, description="Page number")
    start_char: Optional[int] = Field(None, description="Start character position")
    end_char: Optional[int] = Field(None, description="End character position")
    token_count: Optional[int] = Field(
        None, description="Number of tokens in the chunk"
    )


class ChunkCreate(ChunkBase):
    """Schema for creating a chunk."""

    embedding: list[float] = Field(..., description="Embedding vector for the chunk")
    document_id: str = Field(..., description="Document ID this chunk belongs to")


class ChunkUpdate(BaseModel):
    """Schema for updating a chunk."""

    chunk_text: Optional[str] = Field(
        None, min_length=1, description="Chunk text content"
    )
    page_number: Optional[int] = Field(None, description="Page number")
    end_char: Optional[int] = Field(None, description="End character position")


class ChunkResponse(ChunkBase):
    """Schema for chunk response."""

    id: str
    document_id: str
    embedding: list[float] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class ChunkSearchResponse(ChunkResponse):
    """Schema for searched chunks."""

    distance: float = Field(..., description="Distance score for similarity search")


class DocumentSearchResponse(DocumentResponse):
    """Schema for searched documents."""

    chunk: list[ChunkSearchResponse] = Field(
        default_factory=list, description="List of chunks with search results"
    )


class DocumentChatBase(BaseModel):
    """Base document chat schema."""

    title: str = Field(..., min_length=1, max_length=255, description="Chat title")
    description: Optional[str] = Field(
        None, max_length=1000, description="Chat description"
    )


class DocumentChatCreate(DocumentChatBase):
    """Schema for creating a document chat."""

    document_id: str = Field(..., description="Document ID this chat belongs to")


class DocumentChatUpdate(BaseModel):
    """Schema for updating a document chat."""

    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Chat title"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Chat description"
    )


class DocumentChatResponse(DocumentChatBase):
    """Schema for document chat response."""

    id: str
    document_id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class DocumentChatHistoryBase(BaseModel):
    """Base document chat history schema."""

    role: Role = Field(
        ..., description="Role of the message sender (user, assistant, system)"
    )
    content: Optional[str] = Field(..., description="message content")


class DocumentChatHistoryCreate(DocumentChatHistoryBase):
    """Schema for creating document chat history."""

    document_chat_id: str = Field(..., description="Chat ID this history belongs to")


class DocumentChatHistoryResponse(DocumentChatHistoryBase):
    """Schema for document chat history response."""

    id: str
    document_chat_id: str
    created_at: datetime
    created_by: Optional[str]

    class Config:
        from_attributes = True


class DocumentChatWithHistory(DocumentChatResponse):
    """Schema for document chat with history."""

    history: list[DocumentChatHistoryResponse] = []


class DocumentRelationBase(BaseModel):
    """Base document relation schema."""

    title: str = Field(..., min_length=1, max_length=255, description="Relation title")
    description: Optional[str] = Field(
        None, max_length=1000, description="Relation description"
    )


class DocumentRelationCreate(DocumentRelationBase):
    """Schema for creating a document relation."""

    document_id: str = Field(..., description="Document ID this relation belongs to")


class DocumentRelationUpdate(BaseModel):
    """Schema for updating a document relation."""

    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Relation title"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Relation description"
    )


class DocumentRelationResponse(DocumentRelationBase):
    """Schema for document relation response."""

    id: str
    document_id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class DocumentNodeBase(BaseModel):
    """Base document node schema."""

    title: str = Field(..., min_length=1, max_length=255, description="Node title")
    description: Optional[str] = Field(
        None, max_length=1000, description="Node description"
    )
    type: str = Field(..., description="Node type")
    label: str = Field(..., description="Node label")


class DocumentNodeCreate(DocumentNodeBase):
    """Schema for creating a document node."""

    document_relation_id: str = Field(
        ..., description="Relation ID this node belongs to"
    )


class DocumentNodeUpdate(BaseModel):
    """Schema for updating a document node."""

    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Node title"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Node description"
    )
    type: Optional[str] = Field(None, description="Node type")
    label: Optional[str] = Field(None, description="Node label")


class DocumentNodeResponse(DocumentNodeBase):
    """Schema for document node response."""

    id: str
    document_relation_id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class DocumentEdgeBase(BaseModel):
    """Base document edge schema."""

    label: str = Field(..., description="Edge label")
    source: str = Field(..., description="Source node ID")
    target: str = Field(..., description="Target node ID")


class DocumentEdgeCreate(DocumentEdgeBase):
    """Schema for creating a document edge."""

    document_relation_id: str = Field(
        ..., description="Relation ID this edge belongs to"
    )


class DocumentEdgeUpdate(BaseModel):
    """Schema for updating a document edge."""

    label: Optional[str] = Field(None, description="Edge label")
    source: Optional[str] = Field(None, description="Source node ID")
    target: Optional[str] = Field(None, description="Target node ID")


class DocumentEdgeResponse(DocumentEdgeBase):
    """Schema for document edge response."""

    id: str
    document_relation_id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class DocumentRelationWithNodes(DocumentRelationResponse):
    """Schema for document relation with nodes and edges."""

    nodes: list[DocumentNodeResponse] = []
    edges: list[DocumentEdgeResponse] = []


class DocumentDetailResponse(DocumentResponse):
    """Schema for document with all details."""

    chunks: list[ChunkResponse] = []
    chats: list[DocumentChatResponse] = []
    relations: list[DocumentRelationWithNodes] = []
