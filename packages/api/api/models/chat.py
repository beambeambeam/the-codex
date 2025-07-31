from datetime import datetime
from typing import Optional

from sqlalchemy import TIMESTAMP, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base
from .enum import ChatStatus, CollectionChatReferenceType, Role


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
    status: Mapped[ChatStatus] = mapped_column(
        Enum(ChatStatus, native_enum=False), nullable=False
    )

    histories = relationship(
        "CollectionChatHistory", back_populates="chat", cascade="all, delete-orphan"
    )
    creator = relationship(
        "User", back_populates="created_chats", foreign_keys=[created_by]
    )
    updater = relationship(
        "User", back_populates="updated_chats", foreign_keys=[updated_by]
    )


class CollectionChatHistory(Base):
    __tablename__ = "collection_chat_history"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_chat_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection_chat.id", ondelete="CASCADE"), nullable=False
    )
    role: Mapped[Role] = mapped_column(Enum(Role, native_enum=False), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    # create username by user id, user.username

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )

    chat = relationship("CollectionChat", back_populates="histories")
    references = relationship(
        "CollectionChatReference",
        back_populates="history",
        cascade="all, delete-orphan",
    )
    creator = relationship(
        "User",
        back_populates="created_chat_histories",
        foreign_keys=[created_by],
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
