"""Collection model."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base

if TYPE_CHECKING:
    from .user import User


class Collection(Base):
    __tablename__ = "collection"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="CASCADE"), nullable=True
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="NULL"), nullable=True
    )

    creator: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[created_by], back_populates="collections"
    )
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])

    def __repr__(self) -> str:
        return (
            f"<Collection(id='{self.id}', name='{self.name}', "
            f"created_by='{self.created_by}')>"
        )
