"""Documents related models."""

from datetime import datetime
from typing import Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, TIMESTAMP, Boolean, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base


class Document(Base):
    __tablename__ = "document"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection.id", ondelete="CASCADE")
    )
    file_name: Mapped[str] = mapped_column(Text)
    source_file_path: Mapped[str] = mapped_column(Text)
    file_type: Mapped[str] = mapped_column(Text)
    knowledge_graph: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_vectorized: Mapped[bool] = mapped_column(Boolean, default=False)
    is_graph_extracted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    chunks = relationship(
        "Chunk", back_populates="document", cascade="all, delete-orphan"
    )
    chats = relationship(
        "DocumentChat", back_populates="document", cascade="all, delete-orphan"
    )
    relations = relationship(
        "DocumentRelation", back_populates="document", cascade="all, delete-orphan"
    )


class Chunk(Base):
    __tablename__ = "chunk"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    document_id: Mapped[str] = mapped_column(
        Text, ForeignKey("document.id", ondelete="CASCADE")
    )
    chunk_text: Mapped[str] = mapped_column(Text)
    embedding: Mapped[Optional[list[float]]] = mapped_column(Vector(256))
    page_number: Mapped[Optional[int]] = mapped_column(Integer)
    end_char: Mapped[Optional[int]] = mapped_column(Integer)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    document = relationship("Document", back_populates="chunks")


class DocumentChat(Base):
    __tablename__ = "document_chat"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    document_id: Mapped[str] = mapped_column(
        Text, ForeignKey("document.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    document = relationship("Document", back_populates="chats")
    history = relationship(
        "DocumentChatHistory", back_populates="chat", cascade="all, delete-orphan"
    )


class DocumentChatHistory(Base):
    __tablename__ = "document_chat_history"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    document_chat_id: Mapped[str] = mapped_column(
        Text, ForeignKey("document_chat.id", ondelete="CASCADE")
    )
    agent: Mapped[str] = mapped_column(Text)  # User or Agent
    system_prompt: Mapped[str] = mapped_column(Text)
    instruct: Mapped[str] = mapped_column(Text)
    text: Mapped[str] = mapped_column(Text)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )

    chat = relationship("DocumentChat", back_populates="history")


class DocumentRelation(Base):
    __tablename__ = "document_relation"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    document_id: Mapped[str] = mapped_column(
        Text, ForeignKey("document.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    document = relationship("Document", back_populates="relations")
    nodes = relationship(
        "DocumentNode", back_populates="relation", cascade="all, delete-orphan"
    )
    edges = relationship(
        "DocumentEdge", back_populates="relation", cascade="all, delete-orphan"
    )


class DocumentNode(Base):
    __tablename__ = "document_node"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    document_relation_id: Mapped[str] = mapped_column(
        Text, ForeignKey("document_relation.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    type: Mapped[str] = mapped_column(Text)
    label: Mapped[str] = mapped_column(Text)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    relation = relationship("DocumentRelation", back_populates="nodes")


class DocumentEdge(Base):
    __tablename__ = "document_edge"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    document_relation_id: Mapped[str] = mapped_column(
        Text, ForeignKey("document_relation.id", ondelete="CASCADE")
    )
    label: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(Text)
    target: Mapped[str] = mapped_column(Text)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    relation = relationship("DocumentRelation", back_populates="edges")
