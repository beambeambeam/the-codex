"""Document service for managing documents and related entities."""

from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import text
from sqlalchemy.orm import Session, joinedload

from ..models.document import (
    Chunk,
    Document,
    DocumentChat,
    DocumentChatHistory,
    DocumentEdge,
    DocumentNode,
    DocumentRelation,
)
from ..models.user import User
from ..storage import storage_service
from .schemas import (
    ChunkCreate,
    ChunkUpdate,
    ChunkSearched,
    DocumentChatCreate,
    DocumentChatHistoryCreate,
    DocumentChatUpdate,
    DocumentCreate,
    DocumentEdgeCreate,
    DocumentNodeCreate,
    DocumentRelationCreate,
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
            source_file_path=document_data.source_file_path,
            file_type=document_data.file_type,
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

    def get_collection_documents(self, collection_id: str) -> list[Document]:
        """Get all documents in a collection."""
        return (
            self.db.query(Document)
            .filter(Document.collection_id == collection_id)
            .order_by(Document.created_at.desc())
            .all()
        )

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
        if update_data.file_name is not None:
            document.file_name = update_data.file_name
        if update_data.source_file_path is not None:
            document.source_file_path = update_data.source_file_path
        if update_data.file_type is not None:
            document.file_type = update_data.file_type
        if update_data.is_vectorized is not None:
            document.is_vectorized = update_data.is_vectorized

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

    def get_document_with_details(self, document_id: str) -> Optional[Document]:
        """Get document with all related data."""
        return (
            self.db.query(Document)
            .options(
                joinedload(Document.chunks),
                joinedload(Document.chats).joinedload(DocumentChat.history),
                joinedload(Document.relations).joinedload(DocumentRelation.nodes),
                joinedload(Document.relations).joinedload(DocumentRelation.edges),
            )
            .filter(Document.id == document_id)
            .first()
        )

    # Chunk CRUD operations
    def create_chunk(self, chunk_data: ChunkCreate, user: User) -> Chunk:
        """Create a new chunk."""
        chunk = Chunk(
            id=str(uuid4()),
            document_id=chunk_data.document_id,
            chunk_text=chunk_data.chunk_text,
            embedding=chunk_data.embedding,
            page_number=chunk_data.page_number,
            end_char=chunk_data.end_char,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(chunk)
        self.db.commit()
        self.db.refresh(chunk)
        return chunk

    def get_document_chunks(self, document_id: str) -> list[Chunk]:
        """Get all chunks for a document."""
        return (
            self.db.query(Chunk)
            .filter(Chunk.document_id == document_id)
            .order_by(Chunk.page_number, Chunk.end_char)
            .all()
        )

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

    # Document Chat CRUD operations
    def create_document_chat(
        self, chat_data: DocumentChatCreate, user: User
    ) -> DocumentChat:
        """Create a new document chat."""
        chat = DocumentChat(
            id=str(uuid4()),
            document_id=chat_data.document_id,
            title=chat_data.title,
            description=chat_data.description,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(chat)
        self.db.commit()
        self.db.refresh(chat)
        return chat

    def get_document_chats(self, document_id: str) -> list[DocumentChat]:
        """Get all chats for a document."""
        return (
            self.db.query(DocumentChat)
            .filter(DocumentChat.document_id == document_id)
            .order_by(DocumentChat.created_at.desc())
            .all()
        )

    def get_document_chat(self, chat_id: str) -> Optional[DocumentChat]:
        """Get a document chat by ID."""
        return self.db.query(DocumentChat).filter(DocumentChat.id == chat_id).first()

    def update_document_chat(
        self, chat_id: str, update_data: DocumentChatUpdate, user: User
    ) -> DocumentChat:
        """Update a document chat."""
        chat = self.get_document_chat(chat_id)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document chat not found"
            )

        # Update fields if provided
        if update_data.title is not None:
            chat.title = update_data.title
        if update_data.description is not None:
            chat.description = update_data.description

        chat.updated_by = user.id

        self.db.commit()
        self.db.refresh(chat)
        return chat

    def delete_document_chat(self, chat_id: str, user: User) -> bool:
        """Delete a document chat."""
        chat = self.get_document_chat(chat_id)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document chat not found"
            )

        self.db.delete(chat)
        self.db.commit()
        return True

    # Chat History operations
    def add_chat_history(
        self, history_data: DocumentChatHistoryCreate, user: User
    ) -> DocumentChatHistory:
        """Add a message to chat history."""
        history = DocumentChatHistory(
            id=str(uuid4()),
            document_chat_id=history_data.document_chat_id,
            agent=history_data.agent,
            system_prompt=history_data.system_prompt,
            instruct=history_data.instruct,
            text=history_data.text,
            created_by=user.id,
        )

        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history

    def get_chat_history(
        self, chat_id: str, limit: int = 100, offset: int = 0
    ) -> list[DocumentChatHistory]:
        """Get chat history for a document chat."""
        return (
            self.db.query(DocumentChatHistory)
            .filter(DocumentChatHistory.document_chat_id == chat_id)
            .order_by(DocumentChatHistory.created_at.asc())
            .offset(offset)
            .limit(limit)
            .all()
        )

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


class DocumentServiceSearch(DocumentService):
    """Service for searching documents and related entities."""

    def __init__(self, db: Session):
        super().__init__(db)

    def search_chunks(
        self, collection_id: str, query_embedding: list[float], top_k: int = 5
    ) -> list[ChunkSearched]:
        retrieved_docs = []

        results: list[tuple[Chunk, float]] = (
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

        for chunk, distance in results:
            retrieved_docs.append(
                ChunkSearched(
                    chunk_text=chunk.chunk_text,
                    embedding=chunk.embedding,
                    document_id=chunk.document_id,
                    distance=float(distance),
                )
            )

        return retrieved_docs
