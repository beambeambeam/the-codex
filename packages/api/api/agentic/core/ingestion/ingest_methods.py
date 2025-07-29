import re
from typing import Optional, Union

import fitz  # PyMuPDF
from chonkie import (
    LateChunk,
    LateChunker,
    Model2VecEmbeddings,
    RecursiveChunk,
    RecursiveChunker,
    SemanticChunk,
    SentenceTransformerEmbeddings,
)

from .schemas import ChunkMetadata, DocumentChunk
from .typhoon_ocr.ocr_utils import ocr_image_document


def _normalize_file_type(file_type: str) -> str:
    """Normalize file extension to lowercase with leading dot."""
    if not file_type.startswith("."):
        file_type = f".{file_type}"
    return file_type.lower()


def _chunk_text(
    text: str,
    file_name: str,
    file_type: str,
    chunk_size: int = 512,
    min_characters_per_chunk: int = 24,
    page_number: Optional[int] = None,
    embedding_model: Optional[
        Union[str, SentenceTransformerEmbeddings, Model2VecEmbeddings]
    ] = None,
) -> list[DocumentChunk]:
    """Create chunks from text using consistent chunking logic."""
    if not text.strip():
        return []

    document_chunks: list[LateChunk] | list[RecursiveChunk] | list[SemanticChunk]

    if embedding_model:
        chunker = LateChunker(
            embedding_model=embedding_model,
            chunk_size=chunk_size,
            min_characters_per_chunk=min_characters_per_chunk,
        )

    else:
        chunker = RecursiveChunker(
            chunk_size=chunk_size, min_characters_per_chunk=min_characters_per_chunk
        )

    document_chunks = chunker(text=text, show_progress=False)

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

        chunk_data = DocumentChunk(
            file_name=file_name,
            file_type=file_type,
            chunk_text=chunk.text,
            chunk_metadata=metadata,
        )
        chunk_documents.append(chunk_data)

    return chunk_documents


def preprocess_content(
    content: str,
):
    """Preprocess content by removing control characters."""
    content = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", "", content)
    return content


def extract_chunks_from_pdf(
    file_input: Union[str, bytes],
    file_name: str,
    chunk_size: int = 512,
    min_characters_per_chunk: int = 24,
    embedding_model: Optional[Union[str, SentenceTransformerEmbeddings]] = None,
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
        chunk_list = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text()
            if page_text:
                page_text = preprocess_content(page_text)

                if not page_text.strip():
                    print(f"No text extracted from page {page_num + 1} of {file_name}")
                    continue

                normalized_type = _normalize_file_type(".pdf")

                chunks = _chunk_text(
                    page_text,
                    file_name,
                    normalized_type,
                    chunk_size,
                    min_characters_per_chunk,
                    page_number=page_num + 1,  # Page numbers are 1-based
                    embedding_model=embedding_model,
                )

                if chunks:
                    chunk_list.extend(chunks)

    finally:
        doc.close()

    if not chunk_list:
        print(f"No text extracted from {file_name}")
        return []
    return chunk_list


def extract_chunks_from_text_file(
    file_input: Union[str, bytes],
    file_name: str,
    file_type: str,
    chunk_size: int = 512,
    min_characters_per_chunk: int = 24,
    embedding_model: Optional[Union[str, SentenceTransformerEmbeddings]] = None,
) -> list[DocumentChunk]:
    """Extract and chunk text from a text file."""

    content = extract_text_from_text_file(file_input)
    content = preprocess_content(content)

    if not content.strip():
        print(f"No text extracted from {file_name}")
        return []

    normalized_type = _normalize_file_type(file_type)

    return _chunk_text(
        content,
        file_name,
        normalized_type,
        chunk_size,
        min_characters_per_chunk,
        embedding_model=embedding_model,
    )


def extract_text_from_pdf_file(
    file_input: Union[str, bytes],
) -> str:
    """Extract text from a PDF file."""
    if isinstance(file_input, str):
        doc = fitz.open(file_input)
    else:
        # Validate that content is not empty before opening
        if not file_input:
            raise ValueError("PDF content is empty")
        doc = fitz.open(stream=file_input, filetype="pdf")

    full_text = ""
    try:
        for page in doc:
            full_text += page.get_text("text") + "\n"
    finally:
        doc.close()

    return full_text.strip()


def extract_text_from_text_file(
    file_input: Union[str, bytes],
) -> str:
    """Extract text from a text file."""
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

    return content.strip()


async def extract_text_from_image_file(
    file_input: Union[str, bytes],
) -> str:
    """Extract and chunk text from an image file using OCR."""
    content = await ocr_image_document(file_input, task_type="default")
    return content.strip()


def extract_chunks_from_text(
    file_text: str,
    file_name: str,
    file_type: str,
    chunk_size: int = 512,
    min_characters_per_chunk: int = 24,
    embedding_model: Optional[Union[str, SentenceTransformerEmbeddings]] = None,
) -> list[DocumentChunk]:
    """Extract and chunk text from a string."""
    if not file_text.strip():
        print(f"No text provided for chunking from {file_name}")
        return []

    normalized_type = _normalize_file_type(file_type)

    return _chunk_text(
        file_text,
        file_name,
        normalized_type,
        chunk_size,
        min_characters_per_chunk,
        embedding_model=embedding_model,
    )
