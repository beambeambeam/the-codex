from typing import Literal, Union

from ....document.schemas import (
    ChunkCreate,
    DocumentEdgeCreate,
    DocumentNodeCreate,
    DocumentRelationCreate,
    DocumentUpdate,
)
from ....document.service import DocumentService
from ....models import Document, User, enum
from ..embedding.embedding import TextEmbedder
from ..graph.graph_extract import ExtractedGraph, KnowledgeGraphExtractor
from .ingest_methods import (
    extract_chunks_from_pdf,
    extract_chunks_from_text_file,
)
from .schemas import FileInput
from .summary import SummaryGenerator


class DocumentIngestor:
    """
    A class for handling document ingestion including text extraction,
    chunking, embedding generation, and knowledge graph extraction.
    """

    def __init__(
        self,
        document_service: DocumentService,
        text_embedder: TextEmbedder,
        kg_extractor: KnowledgeGraphExtractor,
        summary_generator: SummaryGenerator,
        chunk_size: int = 512,
        min_characters_per_chunk: int = 24,
    ):
        """
        initialize the DocumentIngestor with necessary services and parameters.
        """
        self.chunk_size: int = chunk_size
        self.min_characters_per_chunk: int = min_characters_per_chunk

        # services
        self.document_service: DocumentService = document_service
        self.text_embedder: TextEmbedder = text_embedder
        self.kg_extractor: KnowledgeGraphExtractor = kg_extractor
        self.summary_generator: SummaryGenerator = summary_generator

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
                    # Validate that content is not empty before opening
                    if not file_input.content:
                        raise ValueError("PDF content is empty")
                    doc = fitz.open(stream=file_input.content, filetype="pdf")

                full_text = ""
                try:
                    for page in doc:
                        full_text += page.get_text("text") + "\n"
                finally:
                    doc.close()

                return full_text.strip()

            elif file_input.type in text_extensions:
                if file_input.is_path:
                    with open(
                        file_input.content, encoding="utf-8", errors="ignore"
                    ) as f:
                        raw_text = f.read().strip()
                else:
                    # Validate that content is not empty
                    if not file_input.content:
                        raise ValueError("Text file content is empty")
                    raw_text = file_input.content.decode(
                        "utf-8", errors="ignore"
                    ).strip()
                # Sanitize text file content
                return raw_text

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
                    # Validate that content is not empty
                    if not file_input.content:
                        raise ValueError("Fallback text content is empty")
                    raw_text = file_input.content.decode(
                        "utf-8", errors="ignore"
                    ).strip()
                # Sanitize fallback text
                return raw_text

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
                file_input.content,
                file_name=file_input.name,
                # embedding_model=self.text_embedder.model,
            )
        else:
            chunks = extract_chunks_from_text_file(
                file_input.content,
                file_name=file_input.name,
                file_type=file_input.type,
                # embedding_model=self.text_embedder.model,
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
                        start_char=chunk.chunk_metadata.start_index,
                        end_char=chunk.chunk_metadata.end_index,
                        token_count=chunk.chunk_metadata.token_count,
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

    async def extract_knowledge_graph(self, file_input: FileInput) -> ExtractedGraph:
        """Extract knowledge graph from file content."""
        full_text = self.extract_full_text(file_input)
        if not full_text:
            print(
                f"No text content for knowledge graph extraction from {file_input.name}"
            )
            return None

        kg = await self.kg_extractor.extract(full_text=full_text)
        if kg and (kg.nodes or kg.edges):
            node_count = len(kg.nodes)
            edge_count = len(kg.edges)
            print(
                f"Knowledge graph extracted from {file_input.name}: {node_count} nodes, {edge_count} edges"
            )
            return kg

        print(f"No knowledge graph extracted from {file_input.name}")
        return None

    async def get_document_summary(
        self, file_input: FileInput, language: Literal["en", "th"] = "en"
    ) -> str:
        """Generate a summary of the document."""
        full_text = self.extract_full_text(file_input)
        if not full_text:
            print(f"No text content for summary generation from {file_input.name}")
            return ""

        try:
            summary = await self.summary_generator.async_generate_summary(
                full_text, language=language
            )
            print(f"Summary generated for {file_input.name}")
            return summary
        except Exception as e:
            print(f"Error generating summary for {file_input.name}: {e}")
            return ""


class DocumentIngestorService(DocumentIngestor):
    """Service class to handle document ingestion operations."""

    def __init__(
        self,
        document_service,
        text_embedder,
        kg_extractor,
        summary_generator,
        chunk_size=512,
        min_characters_per_chunk=24,
    ):
        super().__init__(
            document_service,
            text_embedder,
            kg_extractor,
            summary_generator,
            chunk_size,
            min_characters_per_chunk,
        )

    async def extract_and_store_knowledge_graph(
        self,
        file_input: FileInput,
        document_id: str,
        user: User,
    ) -> Document:
        """Extract and store knowledge graph from file input into the document system."""
        # Extract knowledge graph from file input
        kg = await self.extract_knowledge_graph(file_input)
        if not kg:
            print(f"No knowledge graph extracted from {file_input.name}")
            return None

        # Store the knowledge graph in the document system
        document = await self.store_knowledge_graph(
            file_input=file_input,
            kg=kg,
            document_id=document_id,
            user=user,
        )

        if not document:
            print(f"Failed to store knowledge graph for {file_input.name}")

        return document

    async def store_knowledge_graph(
        self,
        file_input: FileInput,
        kg: ExtractedGraph,
        document_id: str,
        user: User,
    ) -> Document:
        """Store the knowledge graph extracted from a file into the document system."""

        # update_document_with_graph(db_session, document.id, kg)
        relation = self.document_service.create_document_relation(
            relation_data=DocumentRelationCreate(
                title=file_input.name,
                description="Knowledge graph extracted from file",
                document_id=document_id,
            ),
            user=user,
        )

        if relation:
            # Create nodes and edges from the knowledge graph
            for node in kg.nodes:
                node_data = DocumentNodeCreate(
                    title=node.title,
                    description=node.description,
                    type=node.type,
                    label=node.label,
                    document_relation_id=relation.id,
                )
                self.document_service.create_document_node(
                    node_data=node_data, user=user
                )
            for edge in kg.edges:
                edge_data = DocumentEdgeCreate(
                    label=edge.label,
                    source=edge.source,
                    target=edge.target,
                    document_relation_id=relation.id,
                )
                self.document_service.create_document_edge(
                    edge_data=edge_data, user=user
                )

            document = self.document_service.update_document(
                document_id=document_id,
                update_data=DocumentUpdate(is_graph_extracted=True),
                user=user,
            )

        return document

    async def ingest_file(
        self,
        input_file: Union[str, FileInput],
        document: Document,
        graph_extract: bool,
        user: User,
    ) -> None:
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
        # update document status to processing
        self.document_service.update_document(
            document_id=document.id,
            update_data=DocumentUpdate(status=enum.IngestionStatus.processing),
            user=user,
        )

        # extract document summary
        document_summary = await self.get_document_summary(
            file_input=input_file, language="en"
        )
        self.document_service.update_document(
            document_id=document.id,
            update_data=DocumentUpdate(summary=document_summary),
            user=user,
        )
        print(
            f"Document summary extracted for {input_file.name}: {document_summary[:100]}..."
        )

        # Extract and store vector chunks if not already done
        if not document.is_vectorized:
            embedded_chunks = self.chunk_and_embed(
                file_input=input_file, document_id=document.id
            )
            if embedded_chunks:
                for chunk in embedded_chunks:
                    self.document_service.create_chunk(
                        chunk_data=chunk,
                        user=user,
                    )

                document = self.document_service.update_document(
                    document_id=document.id,
                    update_data=DocumentUpdate(is_vectorized=True),
                    user=user,
                )

        # Extract knowledge graph if not already done (Optional)
        if not document.is_graph_extracted and graph_extract:
            document = await self.extract_and_store_knowledge_graph(
                file_input=input_file,
                document_id=document.id,
                user=user,
            )
            if not document:
                print(f"Failed to extract knowledge graph for {input_file.name}")

        print(f"Finished processing {input_file.name}")

        # update status to completed
        self.document_service.update_document(
            document_id=document.id,
            update_data=DocumentUpdate(status=enum.IngestionStatus.ready),
            user=user,
        )
