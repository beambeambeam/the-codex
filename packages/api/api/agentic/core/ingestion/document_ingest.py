import traceback
from typing import Literal, Union

from api.models.document import DocumentRelation

from ....collection.schemas import (
    CollectionEdgeCreate,
    CollectionNodeCreate,
    CollectionRelationCreate,
)
from ....collection.service import CollectionService
from ....document.schemas import (
    ChunkCreate,
    DocumentEdgeBase,
    DocumentEdgeCreate,
    DocumentNodeBase,
    DocumentNodeCreate,
    DocumentRelationCreate,
    DocumentUpdate,
)
from ....document.service import DocumentService
from ....models import Document, User, enum
from ..embedding.embedding import TextEmbedder
from ..graph import ExtractedGraph, KnowledgeGraphExtractor, KnowledgeGraphMerger
from .ingest_methods import (
    extract_chunks_from_pdf,
    extract_chunks_from_text,
    extract_text_from_image_file,
    extract_text_from_pdf_file,
    extract_text_from_text_file,
)
from .schemas import FileInput, document_details
from .summary import SummaryGenerator


class DocumentIngestor:
    """
    A class for handling document ingestion including text extraction,
    chunking, embedding generation, and knowledge graph extraction.
    """

    def __init__(
        self,
        collection_service: CollectionService,
        document_service: DocumentService,
        text_embedder: TextEmbedder,
        kg_extractor: KnowledgeGraphExtractor,
        kg_merger: KnowledgeGraphMerger,
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
        self.collection_service = collection_service
        self.document_service = document_service
        self.text_embedder = text_embedder
        self.kg_extractor = kg_extractor
        self.kg_merger = kg_merger
        self.summary_generator = summary_generator

    async def extract_full_text(self, file_input: FileInput) -> str:
        """Extract full text from file input."""
        try:
            print(
                f"Extracting full text from file: {file_input.name} (type: {file_input.type})"
            )

            if file_input.type == ".pdf":
                full_text = extract_text_from_pdf_file(
                    file_input.content,
                )

            elif file_input.type in {".jpg", ".jpeg", ".png", ".gif"}:
                full_text = await extract_text_from_image_file(
                    file_input.content,
                )

            else:
                print(
                    f"Treating file type {file_input.type} as text, attempting text extraction"
                )
                full_text = extract_text_from_text_file(
                    file_input.content,
                )
            if not full_text.strip():
                print(f"No text extracted from {file_input.name}")
                return ""

            print(f"Successfully extracted text from {file_input.name}")
            return full_text.strip()

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

        elif file_input.type in {".jpg", ".jpeg", ".png", ".gif"}:
            chunks = extract_chunks_from_text(
                file_input.full_text,
                file_name=file_input.name,
                file_type=file_input.type,
            )
        else:
            chunks = extract_chunks_from_text(
                file_input.full_text,
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

    async def extract_knowledge_graph(self, full_text: str) -> ExtractedGraph:
        """Extract knowledge graph from file content."""
        if not full_text:
            print("No text content for knowledge graph extraction")
            return None

        kg = await self.kg_extractor.extract(full_text=full_text)
        if kg and (kg.nodes or kg.edges):
            node_count = len(kg.nodes)
            edge_count = len(kg.edges)
            print(f"Knowledge graph extracted: {node_count} nodes, {edge_count} edges")
            return kg

        print("No knowledge graph extracted")
        return None

    async def get_document_summary(
        self, full_text: str, language: Literal["en", "th"] = "en"
    ) -> document_details:
        """Generate a summary of the document."""
        if not full_text:
            print("No text content for summary generation")
            return document_details()

        summary = await self.summary_generator.async_generate_summary(
            full_text, language=language
        )
        return summary


class DocumentIngestorService(DocumentIngestor):
    """Service class to handle document ingestion operations."""

    def __init__(
        self,
        collection_service,
        document_service,
        text_embedder,
        kg_extractor,
        kg_merger,
        summary_generator,
        chunk_size=512,
        min_characters_per_chunk=24,
    ):
        super().__init__(
            collection_service,
            document_service,
            text_embedder,
            kg_extractor,
            kg_merger,
            summary_generator,
            chunk_size,
            min_characters_per_chunk,
        )

    def _relation_to_graph(self, relation: DocumentRelation) -> ExtractedGraph:
        """Convert a DocumentRelation to an ExtractedGraph."""
        return ExtractedGraph(
            nodes=[
                DocumentNodeBase.model_validate(node, from_attributes=True)
                for node in relation.nodes
            ],
            edges=[
                DocumentEdgeBase.model_validate(edge, from_attributes=True)
                for edge in relation.edges
            ],
        )

    def _merge_and_store_collection_knowledge_graph(
        self,
        kg: ExtractedGraph,
        collection_id: str,
        user: User,
    ) -> ExtractedGraph:
        """Merge and store knowledge graph into the collection."""
        relations = self.collection_service.get_collection_relations(
            collection_id=collection_id
        )

        # If somehow multiple relations exist, keep the first and remove extras (enforce invariant)
        if relations and len(relations) > 1:
            to_keep = relations[0]
            for r in relations[1:]:
                self.collection_service.delete_collection_relation(
                    relation_id=r.id, user=user
                )
            relations = [to_keep]

        if relations:
            # Load existing relation fully (with nodes & edges)
            old_rel = self.collection_service.get_collection_relation(
                relation_id=relations[0].id
            )
            existing_kg = self._relation_to_graph(old_rel)

            # Merge existing with incoming
            merged_kg = self.kg_merger.merge_kgs([existing_kg, kg])

            # Replace old relation (delete & create new one)
            self.collection_service.delete_collection_relation(
                relation_id=old_rel.id, user=user
            )
            new_rel = self.collection_service.create_collection_relation(
                relation_data=CollectionRelationCreate(
                    title=f"Relation for {collection_id}",
                    description="Auto-generated relation (merged)",
                    collection_id=collection_id,
                ),
                user=user,
            )

            self.collection_map_create_nodes_edges(
                relation=new_rel,
                kg=merged_kg,
                collection_id=collection_id,
                user=user,
            )

            return merged_kg
        else:
            # No relation yet → create one and store incoming KG
            new_rel = self.collection_service.create_collection_relation(
                relation_data=CollectionRelationCreate(
                    title=f"Relation for {collection_id}",
                    description="Auto-generated relation",
                    collection_id=collection_id,
                ),
                user=user,
            )

            self.collection_map_create_nodes_edges(
                relation=new_rel,
                kg=kg,
                collection_id=collection_id,
                user=user,
            )

            return kg

    async def _extract_and_store_knowledge_graph(
        self,
        full_text: str,
        title: str,
        description: str,
        document_id: str,
        user: User,
    ) -> ExtractedGraph:
        """Extract and store knowledge graph from file input into the document system."""
        # Extract knowledge graph from file input
        kg = await self.extract_knowledge_graph(full_text)
        if not kg:
            print(f"No knowledge graph extracted from {title}")
            return None

        # Store the knowledge graph in the document system
        document = self.store_document_knowledge_graph(
            title=title,
            description=description,
            kg=kg,
            document_id=document_id,
            user=user,
        )

        if not document:
            print(f"Failed to store knowledge graph for {title}")

        return kg

    def document_map_create_nodes_edges(
        self,
        relation: DocumentRelation,
        kg: ExtractedGraph,
        document_id: str,
        user: User,
    ) -> Document:
        """Store the knowledge graph extracted from a file into the document system."""
        # Mapping from old node ID to new node ID
        id_map = {}

        # Create nodes and map their new IDs
        for node in kg.nodes:
            node_data = DocumentNodeCreate(
                id=node.id,
                title=node.title,
                description=node.description,
                type=node.type,
                label=node.label,
                document_relation_id=relation.id,
            )
            new_node = self.document_service.create_document_node(
                node_data=node_data, user=user
            )
            # Assume create_document_node returns the created node object with its new ID
            id_map[node.id] = new_node.id

        # Create edges using the new node IDs
        for edge in kg.edges:
            edge_data = DocumentEdgeCreate(
                label=edge.label,
                source=id_map[edge.source],  # Map old source ID to new ID
                target=id_map[edge.target],  # Map old target ID to new ID
                document_relation_id=relation.id,
            )
            self.document_service.create_document_edge(edge_data=edge_data, user=user)

        document = self.document_service.update_document(
            document_id=document_id,
            update_data=DocumentUpdate(is_graph_extracted=True),
            user=user,
        )
        return document

    def collection_map_create_nodes_edges(
        self,
        relation: DocumentRelation,
        kg: ExtractedGraph,
        collection_id: str,
        user: User,
    ) -> None:
        """Store the knowledge graph extracted from a file into the collection system."""
        # Mapping from old node ID to new node ID
        id_map = {}

        # Create nodes and map their new IDs
        for node in kg.nodes:
            node_data = CollectionNodeCreate(
                id=node.id,
                title=node.title,
                description=node.description,
                type=node.type,
                label=node.label,
                collection_relation_id=relation.id,
            )
            new_node = self.collection_service.create_collection_node(
                node_data=node_data, user=user
            )
            # Assume create_collection_node returns the created node object with its new ID
            id_map[node.id] = new_node.id

        # Create edges using the new node IDs
        for edge in kg.edges:
            edge_data = CollectionEdgeCreate(
                label=edge.label,
                source=id_map[edge.source],  # Map old source ID to new ID
                target=id_map[edge.target],  # Map old target ID to new ID
                collection_relation_id=relation.id,
            )
            self.collection_service.create_collection_edge(
                edge_data=edge_data, user=user
            )

    def store_document_knowledge_graph(
        self,
        title: str,
        description: str,
        kg: ExtractedGraph,
        document_id: str,
        user: User,
    ) -> Document:
        """Store the knowledge graph extracted from a file into the document system."""
        relation = self.document_service.create_document_relation(
            relation_data=DocumentRelationCreate(
                title=title,
                description=description,
                document_id=document_id,
            ),
            user=user,
        )

        if relation:
            self.document_map_create_nodes_edges(
                relation=relation, kg=kg, document_id=document_id, user=user
            )

        return relation

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
        try:
            # update document status to processing
            self.document_service.update_document(
                document_id=document.id,
                update_data=DocumentUpdate(status=enum.IngestionStatus.processing),
                user=user,
            )

            # extract document summary
            full_text = await self.extract_full_text(input_file)
            print(
                f"Extracted full text from {input_file.name}: {len(full_text)} characters"
            )
            print(full_text[:1000])  # Print first 1000 characters for debugging
            input_file.full_text = full_text
            document_summary = await self.get_document_summary(
                full_text=input_file.full_text, language="en"
            )
            self.document_service.update_document(
                document_id=document.id,
                update_data=DocumentUpdate(
                    title=document_summary.title,
                    document=full_text,
                    description=document_summary.description,
                ),
                user=user,
            )
            print(
                f"Document summary extracted for {input_file.name}: {document_summary.title} {document_summary.description[:100]}..."
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
                kg = await self._extract_and_store_knowledge_graph(
                    full_text=input_file.full_text,
                    title=input_file.name,
                    description=input_file.full_text[:200],
                    document_id=document.id,
                    user=user,
                )
                if not kg:
                    print(f"Failed to extract knowledge graph for {input_file.name}")

                self._merge_and_store_collection_knowledge_graph(
                    kg=kg,
                    collection_id=document.collection_id,
                    user=user,
                )

            print(f"Finished processing {input_file.name}")

            # update status to completed
            self.document_service.update_document(
                document_id=document.id,
                update_data=DocumentUpdate(status=enum.IngestionStatus.ready),
                user=user,
            )

        except Exception as e:
            print(f"Error ingesting file {input_file.name}: {e}")
            traceback.print_exc()
            # update status to failed
            self.document_service.update_document(
                document_id=document.id,
                update_data=DocumentUpdate(status=enum.IngestionStatus.failed),
                user=user,
            )
            raise e
