"""Clustering models."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base

if TYPE_CHECKING:
    from .collection import Collection
    from .user import User


class Clustering(Base):
    __tablename__ = "clustering"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection.id", ondelete="CASCADE"), nullable=False
    )
    search_word: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
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
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )

    collection: Mapped["Collection"] = relationship("Collection")
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])
    topics: Mapped[list["ClusteringTopic"]] = relationship(
        "ClusteringTopic", back_populates="clustering", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<Clustering(id='{self.id}', title='{self.title}', "
            f"collection_id='{self.collection_id}')>"
        )


class ClusteringTopic(Base):
    __tablename__ = "clustering_topic"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    clustering_id: Mapped[str] = mapped_column(
        Text, ForeignKey("clustering.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
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
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )

    clustering: Mapped["Clustering"] = relationship(
        "Clustering", back_populates="topics"
    )
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])
    children: Mapped[list["ClusteringChild"]] = relationship(
        "ClusteringChild", back_populates="topic", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<ClusteringTopic(id='{self.id}', title='{self.title}', "
            f"clustering_id='{self.clustering_id}')>"
        )


class ClusteringChild(Base):
    __tablename__ = "clustering_child"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    clustering_topic_id: Mapped[str] = mapped_column(
        Text, ForeignKey("clustering_topic.id", ondelete="CASCADE"), nullable=False
    )
    target: Mapped[str] = mapped_column(Text, nullable=False)  # document_id
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
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )

    topic: Mapped["ClusteringTopic"] = relationship(
        "ClusteringTopic", back_populates="children"
    )
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])

    def __repr__(self) -> str:
        return (
            f"<ClusteringChild(id='{self.id}', target='{self.target}', "
            f"clustering_topic_id='{self.clustering_topic_id}')>"
        )
