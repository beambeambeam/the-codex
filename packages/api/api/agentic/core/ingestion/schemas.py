from typing import Optional, Union

from pydantic import BaseModel, Field


class FileInput(BaseModel):
    """Normalized file input structure using Pydantic."""

    content: Union[str, bytes] = Field(
        ..., description="File content as string or bytes"
    )
    file_name: str = Field(..., description="Name of the file")
    name: str = Field(..., description="File name without path")
    type: str = Field(..., description="File type (e.g., pdf, txt, docx)")
    is_path: bool = Field(False, description="Indicates if the content is a file path")


class ChunkMetadata(BaseModel):
    """Metadata for a document chunk."""

    start_index: Optional[int] = Field(
        None, description="Start index of the chunk in the document"
    )
    end_index: Optional[int] = Field(
        None, description="End index of the chunk in the document"
    )
    token_count: Optional[int] = Field(
        None, description="Number of tokens in the chunk"
    )
    level: Optional[int] = Field(None, description="Chunking level or type")
    # Optional field for page number if applicable
    page_number: Optional[int] = Field(
        None, description="Page number of the chunk in the original document"
    )


class DocumentChunk(BaseModel):
    """Base schema for a document chunk."""

    file_name: str = Field(..., description="Name of the file containing the chunk")
    file_type: str = Field(..., description="Type of the file (e.g., pdf, txt, docx)")
    chunk_text: str = Field(..., description="Text content of the chunk")
    chunk_metadata: ChunkMetadata = Field(
        default_factory=ChunkMetadata, description="Metadata associated with the chunk"
    )
