from pydantic import BaseModel, Field

from ..document.schemas import (
    ChunkSearchResponse,
)
from ..models.user import User
from .pocketflow_custom import ShareStoreBase

# Removed ChatMessage and ChatHistory classes


# NodeTypes = Literal["EmbedChunksNode", "StoreInPgvectorNode", "SearchPgvectorNode", "GenerateResponseNode"]


class AgentResponse(BaseModel):
    """Schema for the response from the RAG agent."""

    # answer: ChatMessage = Field(
    #     ..., description="The answer generated by the RAG agent"
    # )
    retrieved_contexts: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of retrieved document chunks based on the query embedding",
    )


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
        None, description="Embedding vector of the user's question"
    )
    retrieved_contexts: list[ChunkSearchResponse] = Field(
        default_factory=list,
        description="List of retrieved document chunks based on the query embedding",
    )
    # removed: llm_answer

    # General / Conversational
    # removed: chat_history
    system_instructions: str = Field(
        None,
        description="System instructions or context to guide the LLM's responses",
    )

    # Node Status
    current_node: str = Field(
        None, description="Name of the current node being executed in the flow"
    )

    # Session
    # removed: chat_session
    current_user: User = Field(
        None, description="ID of the current user interacting with the RAG system"
    )

    class Config:
        arbitrary_types_allowed = True
