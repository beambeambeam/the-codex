"""Collection models."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import TIMESTAMP, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base

if TYPE_CHECKING:
    from .document import Document
    from .user import User


class CollectionPermissionLevel(str, Enum):
    """Collection permission levels."""

    EDIT = "edit"
    OWNER = "owner"


class CollectionPermissionAction(str, Enum):
    """Collection permission action types for audit log."""

    GRANTED = "granted"
    REVOKED = "revoked"


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
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )

    creator: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[created_by], back_populates="created_collections"
    )
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])

    relations: Mapped[list["CollectionRelation"]] = relationship(
        "CollectionRelation", back_populates="collection", cascade="all, delete-orphan"
    )
    documents: Mapped[list["Document"]] = relationship(
        "Document", cascade="all, delete-orphan"
    )
    permissions: Mapped[list["CollectionPermission"]] = relationship(
        "CollectionPermission",
        back_populates="collection",
        cascade="all, delete-orphan",
    )
    permission_logs: Mapped[list["CollectionPermissionLog"]] = relationship(
        "CollectionPermissionLog",
        back_populates="collection",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return (
            f"<Collection(id='{self.id}', name='{self.name}', "
            f"created_by='{self.created_by}')>"
        )


class CollectionPermission(Base):
    __tablename__ = "collection_permission"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[str] = mapped_column(
        Text, ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    permission_level: Mapped[CollectionPermissionLevel] = mapped_column(
        Enum("edit", "owner", name="collectionpermissionlevel"), nullable=False
    )
    granted_by: Mapped[str] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
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

    collection: Mapped["Collection"] = relationship(
        "Collection", back_populates="permissions"
    )
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    granter: Mapped["User"] = relationship("User", foreign_keys=[granted_by])

    def __repr__(self) -> str:
        return (
            f"<CollectionPermission(id='{self.id}', collection_id='{self.collection_id}', "
            f"user_id='{self.user_id}', permission_level='{self.permission_level}')>"
        )


class CollectionPermissionLog(Base):
    __tablename__ = "collection_permission_log"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[str] = mapped_column(
        Text, ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    action: Mapped[CollectionPermissionAction] = mapped_column(
        Enum("granted", "revoked", name="collectionpermissionaction"), nullable=False
    )
    permission_level: Mapped[CollectionPermissionLevel] = mapped_column(
        Enum("edit", "owner", name="collectionpermissionlevel"), nullable=False
    )
    performed_by: Mapped[str] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )

    collection: Mapped["Collection"] = relationship(
        "Collection", back_populates="permission_logs"
    )
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    performer: Mapped["User"] = relationship("User", foreign_keys=[performed_by])

    def __repr__(self) -> str:
        return (
            f"<CollectionPermissionLog(id='{self.id}', collection_id='{self.collection_id}', "
            f"user_id='{self.user_id}', action='{self.action}', "
            f"permission_level='{self.permission_level}')>"
        )


class CollectionRelation(Base):
    __tablename__ = "collection_relation"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
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

    collection: Mapped["Collection"] = relationship(
        "Collection", back_populates="relations"
    )
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])

    edges: Mapped[list["CollectionEdge"]] = relationship(
        "CollectionEdge", back_populates="relation", cascade="all, delete-orphan"
    )
    nodes: Mapped[list["CollectionNode"]] = relationship(
        "CollectionNode", back_populates="relation", cascade="all, delete-orphan"
    )


class CollectionEdge(Base):
    __tablename__ = "collection_edge"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_relation_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection_relation.id", ondelete="CASCADE"), nullable=False
    )
    label: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(Text, nullable=False)
    target: Mapped[str] = mapped_column(Text, nullable=False)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
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

    relation: Mapped["CollectionRelation"] = relationship(
        "CollectionRelation", back_populates="edges"
    )
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])


class CollectionNode(Base):
    __tablename__ = "collection_node"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    collection_relation_id: Mapped[str] = mapped_column(
        Text, ForeignKey("collection_relation.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    type: Mapped[str] = mapped_column(Text, nullable=False)
    label: Mapped[str] = mapped_column(Text, nullable=False)
    created_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        Text, ForeignKey("user.id", ondelete="SET NULL"), nullable=True
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

    relation: Mapped["CollectionRelation"] = relationship(
        "CollectionRelation", back_populates="nodes"
    )
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])
