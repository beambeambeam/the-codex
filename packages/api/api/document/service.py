"""Document service for managing documents and related entities."""

from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import text
from sqlalchemy.orm import Session, aliased, joinedload

from ..models.document import (
    Chunk,
    Document,
    DocumentEdge,
    DocumentNode,
    DocumentRelation,
)
from ..models.user import User
from ..storage import storage_service
from .schemas import (
    ChunkCreate,
    ChunkResponse,
    ChunkSearchResponse,
    ChunkUpdate,
    DocumentCreate,
    DocumentEdgeCreate,
    DocumentNodeCreate,
    DocumentRelationCreate,
    DocumentResponse,
    DocumentSearchResponse,
    DocumentUpdate,
)


class DocumentService:
    """Service for managing documents and related operations."""

    def __init__(self, db: Session):
        """Initialize document service."""
        self.db = db

    # Document CRUD operations
    def create_document(self, document_data: DocumentCreate, user: User) -> Document:
        """Create a new document from uploaded file data."""
        document = Document(
            id=str(uuid4()),
            file_name=document_data.file_name,
            title=document_data.title,
            document=document_data.document,
            description=document_data.description,
            source_file_path=document_data.source_file_path,
            file_type=document_data.file_type,
            file_size=document_data.file_size,
            collection_id=document_data.collection_id,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def get_document(self, document_id: str) -> Optional[Document]:
        """Get a document by ID."""
        return self.db.query(Document).filter(Document.id == document_id).first()

    def get_collection_documents(self, collection_id: str) -> list[DocumentResponse]:
        """Get all documents in a collection, with created_by and updated_by replaced by usernames."""
        creator_alias = aliased(User)
        updater_alias = aliased(User)
        results = (
            self.db.query(
                Document,
                creator_alias.username.label("creator_username"),
                updater_alias.username.label("updater_username"),
            )
            .outerjoin(creator_alias, Document.created_by == creator_alias.id)
            .outerjoin(updater_alias, Document.updated_by == updater_alias.id)
            .filter(Document.collection_id == collection_id)
            .order_by(Document.created_at.desc())
            .all()
        )
        documents = []
        for doc, creator_username, updater_username in results:
            doc_dict = DocumentResponse.model_validate(doc)
            doc_dict.created_by = creator_username
            doc_dict.updated_by = updater_username
            documents.append(doc_dict)
        return documents

    def search_documents_by_name(
        self, collection_id: str, query: str
    ) -> list[DocumentResponse]:
        """Search for documents in a collection by name or description."""
        creator_alias = aliased(User)
        updater_alias = aliased(User)
        results = (
            self.db.query(
                Document,
                creator_alias.username.label("creator_username"),
                updater_alias.username.label("updater_username"),
            )
            .outerjoin(creator_alias, Document.created_by == creator_alias.id)
            .outerjoin(updater_alias, Document.updated_by == updater_alias.id)
            .filter(Document.collection_id == collection_id)
            .filter(
                Document.file_name.ilike(f"%{query}%")
                | Document.description.ilike(f"%{query}%")
                | Document.title.ilike(f"%{query}%")
            )
            .order_by(Document.created_at.desc())
            .limit(10)
            .all()
        )
        documents = []
        for doc, creator_username, updater_username in results:
            doc_dict = DocumentResponse.model_validate(doc)
            doc_dict.created_by = creator_username
            doc_dict.updated_by = updater_username
            documents.append(doc_dict)
        return documents

    def get_user_documents(self, user_id: str) -> list[Document]:
        """Get all documents created by a user."""
        return (
            self.db.query(Document)
            .filter(Document.created_by == user_id)
            .order_by(Document.created_at.desc())
            .all()
        )

    def update_document(
        self, document_id: str, update_data: DocumentUpdate, user: User
    ) -> Document:
        """Update a document."""
        document = self.get_document(document_id)
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
            )

        # Check if user has permission to update
        if not self._can_modify_document(document, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this document",
            )

        # Update fields if provided
        update_fields = update_data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(document, field, value)

        document.updated_by = user.id

        self.db.commit()
        self.db.refresh(document)
        return document

    def delete_document(self, document_id: str, user: User) -> bool:
        """Delete a document."""
        document = self.get_document(document_id)
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
            )

        if not self._can_modify_document(document, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this document",
            )

        self.db.delete(document)
        self.db.commit()
        return True

    def get_document_with_details(self, document_id: str) -> Optional[dict]:
        """Get document with all related data and MinIO file URL."""
        creator_alias = aliased(User)
        updater_alias = aliased(User)

        document = (
            self.db.query(
                Document,
                creator_alias.username.label("creator_username"),
                updater_alias.username.label("updater_username"),
            )
            .options(
                joinedload(Document.chunks),
                joinedload(Document.relations).joinedload(DocumentRelation.nodes),
                joinedload(Document.relations).joinedload(DocumentRelation.edges),
            )
            .outerjoin(creator_alias, Document.created_by == creator_alias.id)
            .outerjoin(updater_alias, Document.updated_by == updater_alias.id)
            .filter(Document.id == document_id)
            .first()
        )
        if not document:
            return None

        doc, creator_username, updater_username = document

        # Convert to dict (or use model_dump if using pydantic models)
        doc_dict = doc.__dict__.copy()
        # Add related fields if needed (chunks, relations)
        doc_dict["chunks"] = getattr(doc, "chunks", [])
        doc_dict["relations"] = getattr(doc, "relations", [])
        # Replace UUIDs with usernames
        doc_dict["created_by"] = creator_username
        doc_dict["updated_by"] = updater_username
        # Generate MinIO file URL
        doc_dict["minio_file_url"] = self.get_file_url(doc.source_file_path, None)
        return doc_dict

    # Chunk CRUD operations
    def create_chunk(self, chunk_data: ChunkCreate, user: User) -> Chunk:
        """Create a new chunk."""
        chunk = Chunk(
            id=str(uuid4()),
            document_id=chunk_data.document_id,
            chunk_text=chunk_data.chunk_text,
            embedding=chunk_data.embedding,
            start_char=chunk_data.start_char,
            page_number=chunk_data.page_number,
            end_char=chunk_data.end_char,
            token_count=chunk_data.token_count,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(chunk)
        self.db.commit()
        self.db.refresh(chunk)
        return chunk

    def get_document_chunks(
        self, document_id: str, embedding: bool = False
    ) -> list[Chunk]:
        """Get all chunks for a document, optionally only those with embeddings."""
        query = (
            self.db.query(Chunk)
            .filter(Chunk.document_id == document_id)
            .order_by(Chunk.page_number, Chunk.end_char)
        )

        if embedding:
            query = query.filter(Chunk.embedding.isnot(None))

        return query.all()

    def update_chunk(
        self, chunk_id: str, update_data: ChunkUpdate, user: User
    ) -> Chunk:
        """Update a chunk."""
        chunk = self.db.query(Chunk).filter(Chunk.id == chunk_id).first()
        if not chunk:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Chunk not found"
            )

        # Update fields if provided
        if update_data.chunk_text is not None:
            chunk.chunk_text = update_data.chunk_text
        if update_data.page_number is not None:
            chunk.page_number = update_data.page_number
        if update_data.end_char is not None:
            chunk.end_char = update_data.end_char

        chunk.updated_by = user.id

        self.db.commit()
        self.db.refresh(chunk)
        return chunk

    def delete_chunk(self, chunk_id: str, user: User) -> bool:
        """Delete a chunk."""
        chunk = self.db.query(Chunk).filter(Chunk.id == chunk_id).first()
        if not chunk:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Chunk not found"
            )

        self.db.delete(chunk)
        self.db.commit()
        return True

    # Document Relation CRUD operations
    def create_document_relation(
        self, relation_data: DocumentRelationCreate, user: User
    ) -> DocumentRelation:
        """Create a new document relation."""
        relation = DocumentRelation(
            id=str(uuid4()),
            document_id=relation_data.document_id,
            title=relation_data.title,
            description=relation_data.description,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(relation)
        self.db.commit()
        self.db.refresh(relation)
        return relation

    def get_document_relations(self, document_id: str) -> list[DocumentRelation]:
        """Get all relations for a document."""
        return (
            self.db.query(DocumentRelation)
            .filter(DocumentRelation.document_id == document_id)
            .order_by(DocumentRelation.created_at.desc())
            .all()
        )

    def get_document_relation(self, relation_id: str) -> Optional[DocumentRelation]:
        """Get a document relation by ID."""
        return (
            self.db.query(DocumentRelation)
            .options(
                joinedload(DocumentRelation.nodes),
                joinedload(DocumentRelation.edges),
            )
            .filter(DocumentRelation.id == relation_id)
            .first()
        )

    # Document Node CRUD operations
    def create_document_node(
        self, node_data: DocumentNodeCreate, user: User
    ) -> DocumentNode:
        """Create a new document node."""
        node = DocumentNode(
            id=str(uuid4()),
            document_relation_id=node_data.document_relation_id,
            title=node_data.title,
            description=node_data.description,
            type=node_data.type,
            label=node_data.label,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(node)
        self.db.commit()
        self.db.refresh(node)
        return node

    # Document Edge CRUD operations
    def create_document_edge(
        self, edge_data: DocumentEdgeCreate, user: User
    ) -> DocumentEdge:
        """Create a new document edge."""
        edge = DocumentEdge(
            id=str(uuid4()),
            document_relation_id=edge_data.document_relation_id,
            label=edge_data.label,
            source=edge_data.source,
            target=edge_data.target,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(edge)
        self.db.commit()
        self.db.refresh(edge)
        return edge

    # Permission helpers
    def _can_modify_document(self, document: Document, user: User) -> bool:
        """Check if user can modify the document."""
        return document.created_by == user.id

    def _can_view_document(self, document: Document, user: User) -> bool:
        """Check if user can view the document."""
        # For now, only creator can view. You might want to add more logic here
        return document.created_by == user.id

    def upload_file_to_minio(
        self, file: UploadFile, bucket_name: str, object_name: Optional[str] = None
    ) -> str:
        """Upload a file to MinIO."""
        if not object_name:
            object_name = file.filename

        # Upload the file using storage service
        storage_service.upload_file_from_fileobj(bucket_name, object_name, file.file)

        return f"File uploaded to MinIO: {object_name}"

    def delete_file_from_minio(self, object_name: str, bucket_name: str) -> bool:
        """Delete a file from MinIO."""
        storage_service.delete_file_from_storage(object_name, bucket_name)
        return True

    def get_file_url(self, object_name: str, bucket_name: str) -> str:
        """Get the public URL of a file in MinIO."""
        return storage_service.get_file_url_from_storage(object_name, bucket_name)

    @staticmethod
    def prepare_file_upload(file: UploadFile, user_id: str, collection_id: str):
        """
        Prepare storage object name and extract file type (MIME type) for an uploaded file.
        Returns (object_name, file_type, file_extension).
        """
        from uuid import uuid4

        # Get file extension from original filename
        file_extension = ""
        if file.filename and "." in file.filename:
            file_extension = "." + file.filename.split(".")[-1].lower()

        # Generate UUID-based filename for storage
        uuid_filename = str(uuid4()) + file_extension
        object_name = f"users/{user_id}/collections/{collection_id}/{uuid_filename}"

        # Get MIME type
        file_type = file.content_type or "unknown"

        return object_name, file_type, file_extension


class DocumentServiceSearch(DocumentService):
    """Service for searching documents and related entities."""

    def __init__(self, db: Session):
        super().__init__(db)

    def _search_collection_chunks_with_distances(
        self,
        collection_id: str,
        query_embedding: list[float],
        top_k: int,
        embedding: bool = False,
    ) -> list[tuple[Chunk, float]]:
        """Get chunks from a collection with their distances to the query embedding."""
        return (
            self.db.query(
                Chunk,
                Chunk.embedding.l2_distance(query_embedding).label("distance"),
            )
            .join(Document, Chunk.document_id == Document.id)
            .filter(Document.collection_id == collection_id)
            .order_by(text("distance ASC"))
            .limit(top_k)
            .all()
        )

    def _search_document_chunks_with_distances(
        self, document_id: str, query_embedding: list[float], top_k: int
    ) -> list[tuple[Chunk, float]]:
        """Get chunks from a document with their distances to the query embedding."""
        return (
            self.db.query(
                Chunk,
                Chunk.embedding.l2_distance(query_embedding).label("distance"),
            )
            .filter(Chunk.document_id == document_id)
            .order_by(text("distance ASC"))
            .limit(top_k)
            .all()
        )

    def search_collection_chunks(
        self,
        collection_id: str,
        query_embedding: list[float],
        top_k: int = 5,
        embedding: bool = False,
    ) -> list[ChunkSearchResponse]:
        """Search for chunks in a collection based on the query embedding."""
        chunk_results: list[tuple[Chunk, float]] = (
            self._search_collection_chunks_with_distances(
                collection_id=collection_id,
                query_embedding=query_embedding,
                top_k=top_k,
            )
        )

        response_list = []
        for chunk, distance in chunk_results:
            response = ChunkResponse.model_validate(chunk)
            if not embedding:
                response.embedding = []

            response_list.append(
                ChunkSearchResponse(
                    **response.model_dump(),
                    document_title=chunk.document.title,
                    document_description=chunk.document.description,
                    distance=float(distance),
                )
            )

        return response_list

    def search_collection_documents(
        self,
        collection_id: str,
        query_embedding: list[float],
        top_k: int = 5,
        embedding: bool = False,
    ) -> list[DocumentSearchResponse]:
        # Fetch top-k closest chunks with distances
        chunk_results = self._search_collection_chunks_with_distances(
            collection_id=collection_id, query_embedding=query_embedding, top_k=top_k
        )

        # Group chunks by document_id
        doc_chunks = {}
        for chunk, distance in chunk_results:
            doc_chunks.setdefault(chunk.document_id, []).append(
                ChunkSearchResponse(
                    **ChunkResponse.model_validate(chunk).model_dump(),
                    document_title=chunk.document.title,
                    document_description=chunk.document.description,
                    distance=float(distance),
                )
            )

        # Fetch related documents
        documents = (
            self.db.query(Document).filter(Document.id.in_(doc_chunks.keys())).all()
        )
        id_to_doc = {doc.id: doc for doc in documents}

        # Build ordered DocumentSearchResponse list
        response_list = []
        for document_id, chunks in doc_chunks.items():
            document = id_to_doc.get(document_id)
            if not document:
                continue

            response = DocumentSearchResponse(
                **DocumentResponse.model_validate(document).model_dump(), chunk=chunks
            )

            if not embedding:
                for chunk in response.chunk:
                    chunk.embedding = []

            response_list.append(response)

        return response_list

    def search_document_chunks(
        self,
        document_id: str,
        query_embedding: list[float],
        top_k: int = 5,
        embedding: bool = False,
    ) -> list[ChunkSearchResponse]:
        """Search for chunks in a document based on the query embedding."""
        chunk_results = self._search_document_chunks_with_distances(
            document_id=document_id, query_embedding=query_embedding, top_k=top_k
        )

        response_list = []
        for chunk, distance in chunk_results:
            response = ChunkResponse.model_validate(chunk)
            if not embedding:
                response.embedding = []

            response_list.append(
                ChunkSearchResponse(
                    **response.model_dump(),
                    document_title=chunk.document.title,
                    document_description=chunk.document.description,
                    distance=float(distance),
                )
            )

        return response_list
