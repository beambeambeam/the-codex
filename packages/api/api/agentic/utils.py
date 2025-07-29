import os
from typing import Union

from .core.ingestion.schemas import FileInput

MIME_TYPE_MAPPING = {
    # Common file types and their extensions
    "application/pdf": ".pdf",
    # Text and document formats
    "text/plain": ".txt",
    "text/markdown": ".md",
    "application/json": ".json",
    "text/html": ".html",
    "text/css": ".css",
    "application/javascript": ".js",
    "text/javascript": ".js",
    "text/csv": ".csv",
    "application/xml": ".xml",
    "text/xml": ".xml",
    "application/x-python": ".py",
    "text/x-python": ".py",
    "application/x-yaml": ".yml",
    "text/yaml": ".yml",
    "text/x-log": ".log",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    # Image formats
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/bmp": ".bmp",
    "image/webp": ".webp",
}


def detect_file_type(type_hint: str, filename: str = "") -> str:
    """
    Detect file type from extension or MIME type.

    Args:
        type_hint: File extension (e.g., '.pdf') or MIME type (e.g., 'application/pdf')
        filename: Optional filename to extract extension from as fallback

    Returns:
        Normalized file extension (e.g., '.pdf')
    """
    # If it's already a file extension
    if type_hint.startswith("."):
        return type_hint.lower()

    # If it's a MIME type
    elif "/" in type_hint:
        mapped_extension = MIME_TYPE_MAPPING.get(type_hint.lower())
        if mapped_extension:
            return mapped_extension
        else:
            print(f"Unknown MIME type '{type_hint}', falling back to text extraction")
            return ".txt"

    # Try to infer from filename as fallback
    elif filename:
        extension = os.path.splitext(filename)[1].lower()
        return extension if extension else ".txt"

    # Default fallback
    else:
        return ".txt"


def normalize_file_input(input_file: Union[str, FileInput]) -> FileInput:
    """Convert various input formats to a normalized FileInput structure."""
    if isinstance(input_file, FileInput):
        # Ensure the type is properly normalized (handles MIME types)
        normalized_type = detect_file_type(input_file.type, input_file.name)
        input_file.type = normalized_type
        return input_file

    elif isinstance(input_file, str):
        # File path
        file_extension = os.path.splitext(input_file)[1] or ".txt"
        return FileInput(
            content=input_file,
            file_name=os.path.basename(input_file),
            name=input_file,
            type=detect_file_type(file_extension, input_file),
            is_path=True,
        )

    else:
        raise ValueError("Input must be a file path (str) or FileInput instance")
