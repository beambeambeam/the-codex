from datetime import datetime
from typing import Optional

from sqlalchemy import TIMESTAMP, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base
from .enum import CollectionChatReferenceType


class CollectionChat(Base):
    __tablename__ = "collection_chat"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    histories = relationship(
        "CollectionChatHistory", back_populates="chat", cascade="all, delete-orphan"
    )


class CollectionChatHistory(Base):
    __tablename__ = "collection_chat_history"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_chat_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection_chat.id", ondelete="CASCADE"), nullable=False
    )
    agent: Mapped[str] = mapped_column(Text, nullable=False)  # User/Agent
    system_prompt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    instruct: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )

    chat = relationship("CollectionChat", back_populates="histories")
    references = relationship(
        "CollectionChatReference",
        back_populates="history",
        cascade="all, delete-orphan",
    )


class CollectionChatReference(Base):
    __tablename__ = "collection_chat_reference"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_chat_history_id: Mapped[str] = mapped_column(
        Text,
        ForeignKey("collection_chat_history.id", ondelete="CASCADE"),
        nullable=False,
    )
    document_id: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("document.id", ondelete="SET NULL"), nullable=True
    )
    chunk_id: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("chunk.id", ondelete="SET NULL"), nullable=True
    )
    type: Mapped[CollectionChatReferenceType] = mapped_column(
        Enum(CollectionChatReferenceType), nullable=False
    )

    history = relationship("CollectionChatHistory", back_populates="references")
