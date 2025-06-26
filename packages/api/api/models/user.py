"""User model."""

from datetime import datetime
from typing import Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

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
