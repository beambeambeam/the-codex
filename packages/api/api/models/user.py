"""User model."""

from datetime import datetime
from typing import Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from api.models.chat import CollectionChat, CollectionChatHistory

from .base import Base


class User(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    username: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    accounts: Mapped[list["Account"]] = relationship("Account", back_populates="user")
    created_collections = relationship(
        "Collection", foreign_keys="[Collection.created_by]", back_populates="creator"
    )
    created_documents = relationship("Document", foreign_keys="[Document.created_by]")

    # Chats by the user
    created_chats: Mapped[list["CollectionChat"]] = relationship(
        "CollectionChat",
        back_populates="creator",
        foreign_keys="[CollectionChat.created_by]",
    )
    updated_chats: Mapped[list["CollectionChat"]] = relationship(
        "CollectionChat",
        back_populates="updater",
        foreign_keys="[CollectionChat.updated_by]",
    )
    created_chat_histories: Mapped[list["CollectionChatHistory"]] = relationship(
        "CollectionChatHistory",
        back_populates="creator",
        foreign_keys="[CollectionChatHistory.created_by]",
    )

    def __repr__(self) -> str:
        return (
            f"<User(id='{self.id}', username='{self.username}', email='{self.email}')>"
        )


class Account(Base):
    __tablename__ = "account"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    access_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    refresh_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    access_token_expires_at: Mapped[Optional[datetime]] = mapped_column(
        TIMESTAMP, nullable=True
    )
    refresh_token_expires_at: Mapped[Optional[datetime]] = mapped_column(
        TIMESTAMP, nullable=True
    )
    password: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="accounts")
    sessions: Mapped[list["Session"]] = relationship(
        "Session", back_populates="account"
    )


class Session(Base):
    __tablename__ = "session"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    account_id: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("account.id", ondelete="CASCADE"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP, nullable=True)

    account: Mapped[Optional["Account"]] = relationship(
        "Account", back_populates="sessions"
    )
