import os
from typing import Any, Optional, Union

from ....document.schemas import ChunkCreate, DocumentCreate
from ....document.service import DocumentService
from ....models import Document, User
from ..embedding.embedding import TextEmbedder
from ..graph.graph_extract import KnowledgeGraphExtractor
from .ingest_methods import (
    clean_extracted_text,
    extract_chunks_from_pdf,
    extract_chunks_from_text_file,
)
from .schemas import FileInput


class DocumentIngestor:
    """
    A class for handling document ingestion including text extraction,
    chunking, embedding generation, and knowledge graph extraction.
    """

    # MIME type to file extension mapping
    MIME_TYPE_MAPPING = {
        "application/pdf": ".pdf",
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
    }

    def __init__(
        self,
        user: User,
        document_service: DocumentService,
        text_embedder: TextEmbedder,
        kg_extractor: KnowledgeGraphExtractor,
        chunk_size: int = 512,
        min_characters_per_chunk: int = 24,
    ):
        """
        initialize the DocumentIngestor with necessary services and parameters.
        """
        self.chunk_size: int = chunk_size
        self.min_characters_per_chunk: int = min_characters_per_chunk

        # user session
        self.user: User = user

        # services
        self.document_service: DocumentService = document_service
        self.text_embedder: TextEmbedder = text_embedder
        self.kg_extractor: KnowledgeGraphExtractor = kg_extractor

    def detect_file_type(self, type_hint: str, filename: str = "") -> str:
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
            mapped_extension = self.MIME_TYPE_MAPPING.get(type_hint.lower())
            if mapped_extension:
                return mapped_extension
            else:
                print(
                    f"Unknown MIME type '{type_hint}', falling back to text extraction"
                )
                return ".txt"

        # Try to infer from filename as fallback
        elif filename:
            extension = os.path.splitext(filename)[1].lower()
            return extension if extension else ".txt"

        # Default fallback
        else:
            return ".txt"

    def normalize_file_input(self, input_file: Union[str, FileInput]) -> FileInput:
        """Convert various input formats to a normalized FileInput structure."""
        if isinstance(input_file, FileInput):
            # Ensure the type is properly normalized (handles MIME types)
            normalized_type = self.detect_file_type(input_file.type, input_file.name)
            input_file.type = normalized_type
            return input_file

        elif isinstance(input_file, str):
            # File path
            file_extension = os.path.splitext(input_file)[1] or ".txt"
            return FileInput(
                content=input_file,
                name=input_file,
                type=self.detect_file_type(file_extension, input_file),
                is_path=True,
            )

        else:
            raise ValueError("Input must be a file path (str) or FileInput instance")

    def extract_full_text(self, file_input: FileInput) -> str:
        """Extract full text from file input."""
        import fitz

        text_extensions = {
            ".txt",
            ".md",
            ".py",
            ".json",
            ".html",
            ".css",
            ".js",
            ".csv",
            ".log",
            ".xml",
            ".yml",
            ".yaml",
        }

        try:
            print(
                f"Extracting full text from file: {file_input.name} (type: {file_input.type})"
            )

            if file_input.type == ".pdf":
                if file_input.is_path:
                    doc = fitz.open(file_input.content)
                else:
                    doc = fitz.open(stream=file_input.content, filetype="pdf")

                full_text = ""
                for page in doc:
                    full_text += page.get_text("text") + "\n"
                doc.close()

                return clean_extracted_text(full_text.strip())

            elif file_input.type in text_extensions:
                if file_input.is_path:
                    with open(
                        file_input.content, encoding="utf-8", errors="ignore"
                    ) as f:
                        raw_text = f.read().strip()
                else:
                    raw_text = file_input.content.decode(
                        "utf-8", errors="ignore"
                    ).strip()
                # Sanitize text file content
                return clean_extracted_text(raw_text)

            else:
                # Fallback: try to read as text
                print(
                    f"Treating file type {file_input.type} as text, attempting text extraction"
                )
                if file_input.is_path:
                    with open(
                        file_input.content, encoding="utf-8", errors="ignore"
                    ) as f:
                        raw_text = f.read().strip()
                else:
                    raw_text = file_input.content.decode(
                        "utf-8", errors="ignore"
                    ).strip()
                # Sanitize fallback text
                return clean_extracted_text(raw_text)

        except Exception as e:
            print(f"Error extracting text from {file_input.name}: {e}")
            return ""

    def chunk_and_embed(
        self, file_input: FileInput, document_id: str
    ) -> list[ChunkCreate]:
        """Parse file into chunks and generate embeddings."""
        # Parse and chunk the file
        if file_input.type == ".pdf":
            chunks = extract_chunks_from_pdf(
                file_input.content, file_name=file_input.name
            )
        else:
            chunks = extract_chunks_from_text_file(
                file_input.content, file_name=file_input.name, file_type=file_input.type
            )

        if not chunks:
            print(f"No chunks extracted from {file_input.name}")
            return []

        # Generate embeddings
        embedded_chunks: list[ChunkCreate] = []
        for chunk in chunks:
            try:
                embedding = self.text_embedder.get_embedding(text=chunk.chunk_text)
                if embedding is not None:
                    # Convert numpy array to list if needed
                    embedding_list = (
                        embedding.tolist()
                        if hasattr(embedding, "tolist")
                        else list(embedding)
                    )

                    chunk_with_embedding = ChunkCreate(
                        chunk_text=chunk.chunk_text,
                        page_number=chunk.chunk_metadata.page_number,
                        end_char=chunk.chunk_metadata.end_index,
                        embedding=embedding_list,
                        document_id=document_id,
                    )
                    embedded_chunks.append(chunk_with_embedding)
            except Exception as e:
                print(f"Error embedding chunk from {file_input.name}: {e}")

        print(
            f"Successfully embedded {len(embedded_chunks)}/{len(chunks)} chunks from {file_input.name}"
        )
        return embedded_chunks

    def extract_knowledge_graph(
        self, file_input: FileInput
    ) -> Optional[dict[str, Any]]:
        """Extract knowledge graph from file content."""
        full_text = self.extract_full_text(file_input)
        if not full_text:
            print(
                f"No text content for knowledge graph extraction from {file_input.name}"
            )
            return None

        kg = self.kg_extractor.extract(full_text=full_text)
        if kg and (kg.get("nodes") or kg.get("edges")):
            node_count = len(kg.get("nodes", []))
            edge_count = len(kg.get("edges", []))
            print(
                f"Knowledge graph extracted from {file_input.name}: {node_count} nodes, {edge_count} edges"
            )
            return kg

        print(f"No knowledge graph extracted from {file_input.name}")
        return None

    def ingest_file(
        self,
        input_file: Union[str, FileInput],
        collection_id: str,
    ) -> Document:
        """
        Ingest a single file: extract text, generate knowledge graph, chunk, embed, and store.

        Args:
            db_session: Database session
            input_file: File path (str) or FileInput model instance
            collection_id: Collection UUID string
            user: User model instance

        Returns:
            Document: The created document record
        """
        # Normalize input using Pydantic model
        file_input: FileInput = self.normalize_file_input(input_file)
        print(
            f"Processing {file_input.name} (type: {file_input.type}) for collection {collection_id}"
        )

        # Create document record
        document = self.document_service.create_document(
            document_data=DocumentCreate(
                file_name=file_input.name,
                file_type=file_input.type,
                source_file_path=file_input.content if file_input.is_path else None,
                collection_id=collection_id,
            ),
            user=self.user,
        )

        if not document:
            raise RuntimeError(
                f"Failed to create document record for {file_input.name}"
            )

        print(f"Created document record ID {document.id} for {file_input.name}")

        # Extract knowledge graph if not already done
        if not document.is_graph_extracted:
            kg = self.extract_knowledge_graph(file_input)
            if kg:
                # update_document_with_graph(db_session, document.id, kg)
                raise NotImplementedError
                print(f"Knowledge graph saved for document ID {document.id}")

        # Extract and store vector chunks if not already done
        if not document.is_vectorized:
            embedded_chunks = self.chunk_and_embed(
                file_input=file_input, document_id=document.id
            )
            if embedded_chunks:
                for chunk in embedded_chunks:
                    self.document_service.create_chunk(
                        chunk_data=chunk,
                        user=self.user,
                    )
                    print(f"Vector chunks saved for document ID {document.id}")

        print(f"Finished processing {file_input.name}")
        return document

    def ingest_multiple_files(
        self,
        db_session: Any,
        input_files: list[Union[str, tuple[str, bytes], dict[str, Any]]],
        collection_id: str,
        user_id: str,
    ) -> list[Document]:
        """
        Ingest multiple files into the database.

        Args:
            db_session: Database session
            input_files: List of files in various formats
            collection_id: Collection UUID string
            user_id: User ID string

        Returns:
            List[Document]: List of created document records
        """
        documents = []
        for input_file in input_files:
            try:
                document = self.ingest_file(
                    db_session, input_file, collection_id, user_id
                )
                documents.append(document)
            except Exception as e:
                print(f"Error ingesting file {input_file}: {e}")
                # Continue with other files rather than failing entirely

        print(f"Successfully ingested {len(documents)}/{len(input_files)} files")
        return documents
