from typing import Optional, Union

import fitz  # PyMuPDF
from chonkie import RecursiveChunk, RecursiveChunker

from .schemas import ChunkMetadata, DocumentChunk


def _normalize_file_type(file_type: str) -> str:
    """Normalize file extension to lowercase with leading dot."""
    if not file_type.startswith("."):
        file_type = f".{file_type}"
    return file_type.lower()


def clean_extracted_text(extracted_text: Union[str, bytes]) -> str:
    if isinstance(extracted_text, bytes):
        content = extracted_text.decode("utf-8", errors="replace").replace(
            "\x00", "\ufffd"
        )
    else:
        content = extracted_text.replace("\x00", "\ufffd")

    return content


def _chunk_text(
    text: str,
    file_name: str,
    file_type: str,
    chunk_size: int = 512,
    min_characters_per_chunk: int = 24,
    page_number: Optional[int] = None,
) -> list[DocumentChunk]:
    """Create chunks from text using consistent chunking logic."""
    if not text.strip():
        return []

    chunker = RecursiveChunker(
        chunk_size=chunk_size, min_characters_per_chunk=min_characters_per_chunk
    )
    document_chunks: list[RecursiveChunk] = chunker(text=text, show_progress=False)

    chunk_documents = []

    for chunk in document_chunks:
        metadata = ChunkMetadata(
            start_index=chunk.start_index,
            end_index=chunk.end_index,
            token_count=chunk.token_count,
            level=chunk.level,
        )
        if page_number is not None:
            metadata.page_number = page_number

        # Sanitize chunk text before creating DocumentChunk
        cleaned_chunk_text = clean_extracted_text(chunk.text)

        chunk_data = DocumentChunk(
            file_name=file_name,
            file_type=file_type,
            chunk_text=cleaned_chunk_text,
            chunk_metadata=metadata,
        )
        chunk_documents.append(chunk_data)

    return chunk_documents


def extract_chunks_from_pdf(
    file_input: Union[str, bytes],
    file_name: str,
    chunk_size: int = 512,
    min_characters_per_chunk: int = 24,
) -> list[DocumentChunk]:
    """Extract and chunk text from a PDF file."""
    try:
        if isinstance(file_input, str):
            # File path
            doc = fitz.open(file_input)
        elif isinstance(file_input, bytes):
            # Validate that bytes content is not empty
            if not file_input:
                raise ValueError("PDF bytes content is empty")
            doc = fitz.open(stream=file_input, filetype="pdf")
        else:
            raise TypeError("file_input must be a string (path) or bytes.")
    except Exception as e:
        print(f"Error opening PDF {file_name}: {e}")
        return []

    try:
        full_text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text()
            if page_text:
                full_text += page_text + "\n"
    finally:
        doc.close()

    if not full_text.strip():
        print(f"No text extracted from {file_name}")
        return []

    return _chunk_text(
        full_text, file_name, "pdf", chunk_size, min_characters_per_chunk
    )


def extract_chunks_from_text_file(
    file_input: Union[str, bytes],
    file_name: str,
    file_type: str,
    chunk_size: int = 512,
    min_characters_per_chunk: int = 24,
) -> list[DocumentChunk]:
    """Extract and chunk text from a text file."""
    try:
        if isinstance(file_input, str):
            with open(file_input, encoding="utf-8", errors="ignore") as file:
                content = file.read()
        elif isinstance(file_input, bytes):
            # Validate that bytes content is not empty
            if not file_input:
                raise ValueError("Text file bytes content is empty")
            content = file_input.decode("utf-8", errors="ignore")
        else:
            raise TypeError("file_input must be a string (path) or bytes.")
    except Exception as e:
        print(f"Error reading text file {file_name}: {e}")
        return []

    if not content.strip():
        print(f"No text extracted from {file_name}")
        return []

    normalized_type = _normalize_file_type(file_type)
    return _chunk_text(
        content, file_name, normalized_type, chunk_size, min_characters_per_chunk
    )
