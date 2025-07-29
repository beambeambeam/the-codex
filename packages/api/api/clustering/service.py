"""Clustering service for managing clustering and related entities."""

from collections import defaultdict
from datetime import datetime
from typing import Optional
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..document.schemas import DocumentResponse
from ..models.clustering import Clustering, ClusteringChild, ClusteringTopic
from ..models.document import Document
from ..models.user import User
from .schemas import (
    ClusteringChildCreate,
    ClusteringChildUpdate,
    ClusteringCreate,
    ClusteringTopicCreate,
    ClusteringTopicUpdate,
    ClusteringUpdate,
    EnhancedClusteringResponse,
    ClusteringTopicWithDocuments,
    ClusteringResponse,
    ClusteringTopicResponse,
)


class ClusteringService:
    """Service for managing clustering and related operations."""

    def __init__(self, db: Session):
        """Initialize clustering service."""
        self.db = db

    # Clustering CRUD operations
    def create_clustering(
        self, clustering_data: ClusteringCreate, user: User
    ) -> Clustering:
        """Create a new clustering."""
        clustering = Clustering(
            id=str(uuid4()),
            collection_id=clustering_data.collection_id,
            search_word=clustering_data.search_word,
            title=clustering_data.title,
            description=clustering_data.description,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(clustering)
        self.db.commit()
        self.db.refresh(clustering)
        return clustering

    def get_clustering(self, clustering_id: str) -> Optional[Clustering]:
        """Get a clustering by ID."""
        return self.db.query(Clustering).filter(Clustering.id == clustering_id).first()

    def list_clusterings(self, user: User) -> list[Clustering]:
        """Get all clusterings created by a user."""
        clusterings = (
            self.db.query(Clustering)
            .options(joinedload(Clustering.creator), joinedload(Clustering.updater))
            .filter(Clustering.created_by == user.id)
            .order_by(Clustering.created_at.desc())
            .all()
        )
        self._populate_clustering_usernames(clusterings)
        return clusterings

    def get_clusterings_by_collection(
        self, collection_id: str, user: User
    ) -> list[dict]:
        """Get all clusterings for a specific collection, including virtual clusterings by file type and date."""
        # Get existing clusterings
        clusterings = (
            self.db.query(Clustering)
            .options(joinedload(Clustering.creator), joinedload(Clustering.updater))
            .filter(Clustering.collection_id == collection_id)
            .filter(Clustering.created_by == user.id)
            .order_by(Clustering.created_at.desc())
            .all()
        )
        self._populate_clustering_usernames(clusterings)

        # Convert existing clusterings to dict format using Pydantic schemas
        result = []
        for clustering in clusterings:
            topics = []
            for topic in clustering.topics:
                documents = []
                for child in topic.children:
                    document = (
                        self.db.query(Document)
                        .filter(Document.id == child.target)
                        .first()
                    )
                    if document:
                        doc_response = DocumentResponse.model_validate(document)
                        documents.append(doc_response.model_dump())

                topic_with_docs = ClusteringTopicWithDocuments(
                    **ClusteringTopicResponse.model_validate(topic).model_dump(),
                    documents=documents,
                )
                topics.append(topic_with_docs.model_dump())

            clustering_dict = EnhancedClusteringResponse(
                **ClusteringResponse.model_validate(clustering).model_dump(),
                topics=topics,
            ).model_dump()

            result.append(clustering_dict)

        # Add virtual clustering by file type
        file_type_clustering = self._create_file_type_clustering(collection_id, user)
        if file_type_clustering:
            result.append(file_type_clustering)

        # Add virtual clustering by date
        date_clustering = self._create_date_clustering(collection_id, user)
        if date_clustering:
            result.append(date_clustering)

        return result

    def _create_file_type_clustering(
        self, collection_id: str, user: User
    ) -> Optional[dict]:
        """Create virtual clustering grouped by file type."""
        # Get all documents in the collection
        documents = (
            self.db.query(Document)
            .filter(Document.collection_id == collection_id)
            .all()
        )

        if not documents:
            return None

        # Group documents by file type
        file_type_groups = defaultdict(list)
        for doc in documents:
            file_type_groups[doc.file_type].append(doc)

        # Create topics for each file type
        topics = []
        for file_type, docs in file_type_groups.items():
            documents = [
                DocumentResponse.model_validate(doc).model_dump() for doc in docs
            ]

            topic_dict = ClusteringTopicWithDocuments(
                clustering_id="virtual_file_type_clustering",
                title=f"{file_type.upper()} Documents",
                description=f"Documents with file type {file_type}",
                id=f"virtual_topic_file_type_{file_type}",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                created_by=user.id,
                updated_by=user.id,
                documents=documents,
            ).model_dump()

            topics.append(topic_dict)

        return EnhancedClusteringResponse(
            collection_id=collection_id,
            search_word="by_file_type",
            title="Documents by File Type",
            description="Documents grouped by file type",
            id="virtual_file_type_clustering",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            created_by=user.id,
            updated_by=user.id,
            topics=topics,
        ).model_dump()

    def _create_date_clustering(self, collection_id: str, user: User) -> Optional[dict]:
        """Create virtual clustering grouped by creation date."""
        # Get all documents in the collection
        documents = (
            self.db.query(Document)
            .filter(Document.collection_id == collection_id)
            .all()
        )

        if not documents:
            return None

        # Group documents by creation date (date part only)
        date_groups = defaultdict(list)
        for doc in documents:
            date_key = doc.created_at.strftime("%Y-%m-%d")
            date_groups[date_key].append(doc)

        # Create topics for each date
        topics = []
        for date_key, docs in sorted(date_groups.items(), reverse=True):
            documents = [
                DocumentResponse.model_validate(doc).model_dump() for doc in docs
            ]

            topic_dict = ClusteringTopicWithDocuments(
                clustering_id="virtual_date_clustering",
                title=date_key,
                description=f"Documents created on {date_key}",
                id=f"virtual_topic_date_{date_key}",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                created_by=user.id,
                updated_by=user.id,
                documents=documents,
            ).model_dump()

            topics.append(topic_dict)

        return EnhancedClusteringResponse(
            collection_id=collection_id,
            search_word="by_date",
            title="Documents by Creation Date",
            description="Documents grouped by creation date",
            id="virtual_date_clustering",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            created_by=user.id,
            updated_by=user.id,
            topics=topics,
        ).model_dump()

    def update_clustering(
        self, clustering_id: str, update_data: ClusteringUpdate, user: User
    ) -> Clustering:
        """Update a clustering."""
        clustering = self.get_clustering(clustering_id)
        if not clustering:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Clustering not found"
            )

        # Check if user has permission to update
        if not self._can_modify_clustering(clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this clustering",
            )

        # Update fields if provided
        if update_data.search_word is not None:
            clustering.search_word = update_data.search_word
        if update_data.title is not None:
            clustering.title = update_data.title
        if update_data.description is not None:
            clustering.description = update_data.description

        clustering.updated_by = user.id

        self.db.commit()
        self.db.refresh(clustering)
        return clustering

    def delete_clustering(self, clustering_id: str, user: User) -> bool:
        """Delete a clustering."""
        clustering = self.get_clustering(clustering_id)
        if not clustering:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Clustering not found"
            )

        if not self._can_modify_clustering(clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this clustering",
            )

        self.db.delete(clustering)
        self.db.commit()
        return True

    # ClusteringTopic CRUD operations
    def create_clustering_topic(
        self, clustering_id: str, topic_data: ClusteringTopicCreate, user: User
    ) -> ClusteringTopic:
        """Create a new clustering topic."""
        # Verify clustering exists and user has access
        clustering = self.get_clustering(clustering_id)
        if not clustering:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Clustering not found"
            )

        if not self._can_modify_clustering(clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create topics for this clustering",
            )

        topic = ClusteringTopic(
            id=str(uuid4()),
            clustering_id=clustering_id,
            title=topic_data.title,
            description=topic_data.description,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(topic)
        self.db.commit()
        self.db.refresh(topic)
        return topic

    def get_clustering_topic(self, topic_id: str) -> Optional[ClusteringTopic]:
        """Get a clustering topic by ID."""
        return (
            self.db.query(ClusteringTopic)
            .filter(ClusteringTopic.id == topic_id)
            .first()
        )

    def list_clustering_topics(
        self, clustering_id: str, user: User
    ) -> list[ClusteringTopic]:
        """Get all topics for a clustering."""
        # Verify clustering exists and user has access
        clustering = self.get_clustering(clustering_id)
        if not clustering:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Clustering not found"
            )

        if not self._can_access_clustering(clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this clustering",
            )

        topics = (
            self.db.query(ClusteringTopic)
            .options(
                joinedload(ClusteringTopic.creator), joinedload(ClusteringTopic.updater)
            )
            .filter(ClusteringTopic.clustering_id == clustering_id)
            .order_by(ClusteringTopic.created_at.desc())
            .all()
        )
        self._populate_topic_usernames(topics)
        return topics

    def update_clustering_topic(
        self, topic_id: str, update_data: ClusteringTopicUpdate, user: User
    ) -> ClusteringTopic:
        """Update a clustering topic."""
        topic = self.get_clustering_topic(topic_id)
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found"
            )

        if not self._can_modify_topic(topic, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this topic",
            )

        # Update fields if provided
        if update_data.title is not None:
            topic.title = update_data.title
        if update_data.description is not None:
            topic.description = update_data.description

        topic.updated_by = user.id

        self.db.commit()
        self.db.refresh(topic)
        return topic

    def delete_clustering_topic(self, topic_id: str, user: User) -> bool:
        """Delete a clustering topic."""
        topic = self.get_clustering_topic(topic_id)
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found"
            )

        if not self._can_modify_topic(topic, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this topic",
            )

        self.db.delete(topic)
        self.db.commit()
        return True

    # ClusteringChild CRUD operations
    def create_clustering_child(
        self, topic_id: str, child_data: ClusteringChildCreate, user: User
    ) -> ClusteringChild:
        """Create a new clustering child."""
        # Verify topic exists and user has access
        topic = self.get_clustering_topic(topic_id)
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found"
            )

        if not self._can_modify_topic(topic, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create children for this topic",
            )

        child = ClusteringChild(
            id=str(uuid4()),
            clustering_topic_id=topic_id,
            target=child_data.target,
            created_by=user.id,
            updated_by=user.id,
        )

        self.db.add(child)
        self.db.commit()
        self.db.refresh(child)
        return child

    def get_clustering_child(self, child_id: str) -> Optional[ClusteringChild]:
        """Get a clustering child by ID."""
        return (
            self.db.query(ClusteringChild)
            .filter(ClusteringChild.id == child_id)
            .first()
        )

    def list_clustering_children(
        self, topic_id: str, user: User
    ) -> list[ClusteringChild]:
        """Get all children for a topic."""
        # Verify topic exists and user has access
        topic = self.get_clustering_topic(topic_id)
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found"
            )

        if not self._can_access_clustering(topic.clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this topic",
            )

        children = (
            self.db.query(ClusteringChild)
            .options(
                joinedload(ClusteringChild.creator), joinedload(ClusteringChild.updater)
            )
            .filter(ClusteringChild.clustering_topic_id == topic_id)
            .order_by(ClusteringChild.created_at.desc())
            .all()
        )
        self._populate_child_usernames(children)
        return children

    def update_clustering_child(
        self, child_id: str, update_data: ClusteringChildUpdate, user: User
    ) -> ClusteringChild:
        """Update a clustering child."""
        child = self.get_clustering_child(child_id)
        if not child:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Child not found"
            )

        if not self._can_modify_child(child, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this child",
            )

        # Update fields if provided
        if update_data.target is not None:
            child.target = update_data.target

        child.updated_by = user.id

        self.db.commit()
        self.db.refresh(child)
        return child

    def delete_clustering_child(self, child_id: str, user: User) -> bool:
        """Delete a clustering child."""
        child = self.get_clustering_child(child_id)
        if not child:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Child not found"
            )

        if not self._can_modify_child(child, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this child",
            )

        self.db.delete(child)
        self.db.commit()
        return True

    # Permission helper methods
    def _can_access_clustering(self, clustering: Clustering, user: User) -> bool:
        """Check if user can access a clustering."""
        return clustering.created_by == user.id

    def _can_modify_clustering(self, clustering: Clustering, user: User) -> bool:
        """Check if user can modify a clustering."""
        return clustering.created_by == user.id

    def _can_modify_topic(self, topic: ClusteringTopic, user: User) -> bool:
        """Check if user can modify a topic."""
        return topic.created_by == user.id or self._can_modify_clustering(
            topic.clustering, user
        )

    def _can_modify_child(self, child: ClusteringChild, user: User) -> bool:
        """Check if user can modify a child."""
        return child.created_by == user.id or self._can_modify_topic(child.topic, user)

    # Username population helpers
    def _populate_clustering_usernames(self, clusterings: list[Clustering]) -> None:
        """Helper to replace created_by and updated_by with usernames."""
        for clustering in clusterings:
            clustering.created_by = (
                clustering.creator.username if clustering.creator else None
            )
            clustering.updated_by = (
                clustering.updater.username if clustering.updater else None
            )

    def _populate_topic_usernames(self, topics: list[ClusteringTopic]) -> None:
        """Helper to replace created_by and updated_by with usernames."""
        for topic in topics:
            topic.created_by = topic.creator.username if topic.creator else None
            topic.updated_by = topic.updater.username if topic.updater else None

    def _populate_child_usernames(self, children: list[ClusteringChild]) -> None:
        """Helper to replace created_by and updated_by with usernames."""
        for child in children:
            child.created_by = child.creator.username if child.creator else None
            child.updated_by = child.updater.username if child.updater else None


def get_clustering_service(db: Session = Depends(get_db)) -> ClusteringService:
    """Get clustering service with database session."""
    return ClusteringService(db)
