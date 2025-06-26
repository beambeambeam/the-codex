"""User model."""

from datetime import datetime

from sqlalchemy import TIMESTAMP, Column, Text
from sqlalchemy.sql import func

from .base import Base


class User(Base):
    """User table model."""

    __tablename__ = "user"

    id: str = Column(Text, primary_key=True)
    username: str = Column(Text, unique=True, nullable=False)
    email: str = Column(Text, unique=True, nullable=False)
    created_at: datetime = Column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    updated_at: datetime = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    def __repr__(self) -> str:
        """String representation of User."""
        return (
            f"<User(id='{self.id}', username='{self.username}', email='{self.email}')>"
        )
