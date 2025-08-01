from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from api.auth.schemas import UserResponse
from api.chat.schemas import (
    CollectionChatHistoryBase,
    CollectionChatResponse,
)
from api.collection.schemas import CollectionResponse
from api.document.schemas import (
    ChunkSearchResponse,
    DocumentResponse,
)
from api.models.user import User

from .pocketflow_custom import ShareStoreBase


class NodeStatus(str, Enum):
    DEFAULT = "default"  # Default status for nodes
    RETRY = "retry"  # Status to indicate a retry is needed
    ERROR = "error"  # Status to indicate an error occurred


class INTENT(str, Enum):
    FETCH_DOCUMENT_QA = (
        "fetch_document_qa"  # Intent for new document fetch and question answering
    )
    LAST_DOCUMENT_QA = "last_document_qa"  # Intent for last document question answering
    GENERIC_QA = "generic_qa"  # Intent for generic question answering
    SUMMARIZATION = "summarization"  # Intent for summarization tasks


class UserIntent(BaseModel):
    """Schema for user intent in the RAG system."""

    intent: INTENT = Field(
        ...,
        description="""
    The intent of the user's query. Choose one:

    1. **fetch_document_qa** – A question about a document *not* already in context; may or may not use words like “load”, “fetch” or “open.”
       - Q: "What's in the sales deck about Q2?"
         A: "fetch_document_qa"
       - Q: "Tell me the risks listed in the new audit report."
         A: "fetch_document_qa"
       - Q: "How does the user guide say to reset the password?"
         A: "fetch_document_qa"
       - Q: "Key findings from the whitepaper?"
         A: "fetch_document_qa"

    2. **last_document_qa** – A question that follows up on the *most-recently* loaded document.
       - Q: "What were the next steps in that plan?"  
         A: "last_document_qa"
       - Q: "Any action items mentioned there?"  
         A: "last_document_qa"
       - Q: "Who authored that report?"  
         A: "last_document_qa"
       - Q: "And what about the timeline?"  
         A: "last_document_qa"

    3. **generic_qa** – A standalone question not tied to any document context.
       - Q: "What's the capital of Argentina?"  
         A: "generic_qa"
       - Q: "How do airplanes fly?"  
         A: "generic_qa"
       - Q: "Who won the Best Actor Oscar in 2024?"  
         A: "generic_qa"
       - Q: "Definition of photosynthesis?"  
         A: "generic_qa"

    4. **summarization** – A direct request to summarize provided or loaded content.
       - Q: "Summarize the intro section."  
         A: "summarization"
       - Q: "Give me the TL;DR of the article."  
         A: "summarization"
       - Q: "In two sentences, what’s the gist?"  
         A: "summarization"
       - Q: "Briefly outline the main points."  
         A: "summarization"

    If the intent cannot be determined, default to **generic_qa**.
    """,
    )
    confidence: float = Field(
        1.0, description="Confidence score of the identified intent (0.0 to 1.0)"
    )


class ChatMessageResponse(CollectionChatHistoryBase):
    """Schema for chat messages in the RAG system."""

    id: str = Field(..., description="Unique identifier for the chat message")
    created_by: Optional[str] = Field(
        ..., description="Username of the user who created the chat message"
    )
    created_at: datetime = Field(
        ..., description="Timestamp when the chat message was created"
    )
    collection_chat_id: str = Field(None, description="Collection Chat ID")
    retrieved_contexts: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of context references retrieved for the chat message",
    )

    class Config:
        from_attributes = True


class ChatMessageCreate(CollectionChatHistoryBase):
    """Schema for creating a new chat message."""

    collection_chat_id: str = Field(None, description="Collection Chat ID")
    retrieved_contexts: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of context references retrieved for the chat message",
    )

    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    """Schema for a list of chat messages."""

    messages: list[ChatMessageResponse] = Field(
        default_factory=list, description="List of chat messages in the conversation"
    )


class ChatHistoryCreate(CollectionChatHistoryBase):
    """Schema for creating a new chat message."""

    messages: list[ChatMessageCreate] = Field(
        default_factory=list, description="List of chat messages in the conversation"
    )


# NodeTypes = Literal["EmbedChunksNode", "StoreInPgvectorNode", "SearchPgvectorNode", "GenerateResponseNode"]


class AgentResponse(BaseModel):
    """Schema for the response from the RAG agent."""

    # answer: ChatMessage = Field(
    #     ..., description="The answer generated by the RAG agent"
    # )
    chat_history: ChatHistoryResponse = Field(
        default_factory=ChatHistoryResponse,
        description="Conversation history including user questions and assistant responses",
    )
    retrieved_contexts: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of retrieved document chunks based on the query embedding",
    )

    # truncate the response to avoid sending large data back
    @field_validator("retrieved_contexts", mode="before")
    def truncate_retrieved_contexts(
        cls, v: list[ChunkSearchResponse]
    ) -> list[ChunkSearchResponse]:
        """Truncate the retrieved contexts to avoid sending large data back."""
        for context in v:
            if len(context.chunk_text) > 100:
                context.chunk_text = context.chunk_text[:100] + "..."
        return v


class SharedStore(ShareStoreBase):
    # Offline Indexing Flow
    input_file_paths: list[str] = Field(
        default_factory=list, description="List of file paths to be indexed"
    )
    parsed_chunks_for_embedding: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of parsed document chunks ready for embedding",
    )
    processed_chunks: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of processed document chunks with embeddings",
    )

    # Online Querying Flow
    user_question: str = Field(
        None, description="User's question or query for the RAG system"
    )
    query_embedding: list[float] = Field(
        default_factory=list, description="Embedding vector of the user's question"
    )
    retrieved_contexts: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of retrieved document chunks based on the query embedding",
    )

    # General / Conversational
    chat_history: ChatHistoryResponse = Field(
        default_factory=ChatHistoryResponse,
        description="Conversation history including user questions and assistant responses",
    )
    system_instructions: str = Field(
        None,
        description="System instructions or context to guide the LLM's responses",
    )

    # Saving Data
    new_chat_history: ChatHistoryResponse = Field(
        default_factory=ChatHistoryResponse,
        description="New chat history to be appended to the existing conversation",
    )

    # References
    document_references_id: list[str] = Field(
        default_factory=list,
        description="ID of the document being processed or queried",
    )

    # Node Status
    current_node: str = Field(
        None, description="Name of the current node being executed in the flow"
    )
    user_intent: UserIntent = Field(
        None,
        description="User's intent for the current query, e.g., 'document_qa', 'generic_qa'",
    )

    # Session
    chat_session: CollectionChatResponse = Field(
        None, description="Chat collection for storing conversation history"
    )

    # User Information
    current_collection: CollectionResponse = Field(
        None, description="Current collection being accessed"
    )
    current_documents: list[DocumentResponse] = Field(
        default_factory=list,
        description="List of documents available in the current collection",
    )
    current_user: UserResponse = Field(
        None, description="ID of the current user interacting with the RAG system"
    )

    class Config:
        arbitrary_types_allowed = True


class RAGQueryRequest(BaseModel):
    """Schema for RAG query request body."""

    user_question: str = Field(
        ..., description="The user's question or query for the RAG system"
    )
    reference: list[str] = Field(
        default_factory=list,
        description="Optional list of document references to use for the query",
    )
