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
    ClusteringChildResponse,
    ClusteringChildUpdate,
    ClusteringCreate,
    ClusteringResponse,
    ClusteringTopicCreate,
    ClusteringTopicResponse,
    ClusteringTopicUpdate,
    ClusteringTopicWithDocuments,
    ClusteringUpdate,
    EnhancedClusteringResponse,
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

    def get_clustering(self, clustering_id: str, user: User) -> Optional[Clustering]:
        """Get a clustering by ID with authorization check."""
        clustering = (
            self.db.query(Clustering).filter(Clustering.id == clustering_id).first()
        )
        if not clustering:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Clustering not found"
            )

        if not self._can_access_clustering(clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this clustering",
            )

        return clustering

    def list_clusterings(self, user: User) -> list[ClusteringResponse]:
        """Get all clusterings created by a user."""
        clusterings = (
            self.db.query(Clustering)
            .options(joinedload(Clustering.creator), joinedload(Clustering.updater))
            .filter(Clustering.created_by == user.id)
            .order_by(Clustering.created_at.desc())
            .all()
        )
        return self._create_clustering_responses_with_usernames(clusterings)

    def get_clusterings_by_collection(
        self, collection_id: str, user: User
    ) -> list[EnhancedClusteringResponse]:
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

        # Convert existing clusterings to Pydantic models
        result = []
        for clustering in clusterings:
            # Collect all document IDs for this clustering to avoid N+1 queries
            all_doc_ids = []
            topic_doc_mapping = {}

            for topic in clustering.topics:
                doc_ids = [child.target for child in topic.children]
                topic_doc_mapping[topic.id] = doc_ids
                all_doc_ids.extend(doc_ids)

            # Fetch all documents for this clustering in a single query
            documents_map = {}
            if all_doc_ids:
                docs = (
                    self.db.query(Document).filter(Document.id.in_(all_doc_ids)).all()
                )
                documents_map = {
                    doc.id: DocumentResponse.model_validate(doc) for doc in docs
                }

            topics = []
            for topic in clustering.topics:
                doc_ids = topic_doc_mapping.get(topic.id, [])
                documents = [
                    documents_map[doc_id]
                    for doc_id in doc_ids
                    if doc_id in documents_map
                ]

                topic_response = self._create_topic_response_with_usernames(topic)
                topic_with_docs = ClusteringTopicWithDocuments(
                    **topic_response.model_dump(),
                    documents=documents,
                )
                topics.append(topic_with_docs)

            clustering_response = self._create_clustering_response_with_usernames(
                clustering
            )
            enhanced_response = EnhancedClusteringResponse(
                **clustering_response.model_dump(),
                topics=topics,
            )
            # Set computed field values for the enhanced response
            enhanced_response._created_by_username = (
                clustering_response._created_by_username
            )
            enhanced_response._updated_by_username = (
                clustering_response._updated_by_username
            )

            result.append(enhanced_response)

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
    ) -> Optional[EnhancedClusteringResponse]:
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
            documents = [DocumentResponse.model_validate(doc) for doc in docs]

            topic_with_docs = ClusteringTopicWithDocuments(
                clustering_id="virtual_file_type_clustering",
                title=f"{file_type.upper()} Documents",
                description=f"Documents with file type {file_type}",
                id=f"virtual_topic_file_type_{file_type}",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                created_by=user.id,
                updated_by=user.id,
                documents=documents,
            )
            # Set computed field values
            topic_with_docs._created_by_username = user.username
            topic_with_docs._updated_by_username = user.username

            topics.append(topic_with_docs)

        enhanced_response = EnhancedClusteringResponse(
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
        )
        # Set computed field values
        enhanced_response._created_by_username = user.username
        enhanced_response._updated_by_username = user.username

        return enhanced_response

    def _create_date_clustering(
        self, collection_id: str, user: User
    ) -> Optional[EnhancedClusteringResponse]:
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
            documents = [DocumentResponse.model_validate(doc) for doc in docs]

            topic_with_docs = ClusteringTopicWithDocuments(
                clustering_id="virtual_date_clustering",
                title=date_key,
                description=f"Documents created on {date_key}",
                id=f"virtual_topic_date_{date_key}",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                created_by=user.id,
                updated_by=user.id,
                documents=documents,
            )
            # Set computed field values
            topic_with_docs._created_by_username = user.username
            topic_with_docs._updated_by_username = user.username

            topics.append(topic_with_docs)

        enhanced_response = EnhancedClusteringResponse(
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
        )
        # Set computed field values
        enhanced_response._created_by_username = user.username
        enhanced_response._updated_by_username = user.username

        return enhanced_response

    def update_clustering(
        self, clustering_id: str, update_data: ClusteringUpdate, user: User
    ) -> Clustering:
        """Update a clustering."""
        clustering = self.get_clustering(clustering_id, user)

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
        clustering = self.get_clustering(clustering_id, user)

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
        clustering = self.get_clustering(clustering_id, user)

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

    def get_clustering_topic(
        self, topic_id: str, user: User
    ) -> Optional[ClusteringTopic]:
        """Get a clustering topic by ID with authorization check."""
        topic = (
            self.db.query(ClusteringTopic)
            .filter(ClusteringTopic.id == topic_id)
            .first()
        )
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found"
            )

        if not self._can_access_clustering(topic.clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this topic",
            )

        return topic

    def list_clustering_topics(
        self, clustering_id: str, user: User
    ) -> list[ClusteringTopicResponse]:
        """Get all topics for a clustering."""
        # Verify clustering exists and user has access
        self.get_clustering(clustering_id, user)

        topics = (
            self.db.query(ClusteringTopic)
            .options(
                joinedload(ClusteringTopic.creator), joinedload(ClusteringTopic.updater)
            )
            .filter(ClusteringTopic.clustering_id == clustering_id)
            .order_by(ClusteringTopic.created_at.desc())
            .all()
        )
        return self._create_clustering_topics_with_usernames(topics)

    def update_clustering_topic(
        self, topic_id: str, update_data: ClusteringTopicUpdate, user: User
    ) -> ClusteringTopic:
        """Update a clustering topic."""
        topic = self.get_clustering_topic(topic_id, user)

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
        topic = self.get_clustering_topic(topic_id, user)

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
        topic = self.get_clustering_topic(topic_id, user)
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

    def get_clustering_child(
        self, child_id: str, user: User
    ) -> Optional[ClusteringChild]:
        """Get a clustering child by ID with authorization check."""
        child = (
            self.db.query(ClusteringChild)
            .filter(ClusteringChild.id == child_id)
            .first()
        )
        if not child:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Child not found"
            )

        if not self._can_access_clustering(child.topic.clustering, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this child",
            )

        return child

    def list_clustering_children(
        self, topic_id: str, user: User
    ) -> list[ClusteringChildResponse]:
        """Get all children for a topic."""
        # Verify topic exists and user has access
        topic = self.get_clustering_topic(topic_id, user)
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
        return self._create_clustering_children_with_usernames(children)

    def update_clustering_child(
        self, child_id: str, update_data: ClusteringChildUpdate, user: User
    ) -> ClusteringChild:
        """Update a clustering child."""
        child = self.get_clustering_child(child_id, user)
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
        child = self.get_clustering_child(child_id, user)
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
    def _create_clustering_responses_with_usernames(
        self, clusterings: list[Clustering]
    ) -> list[ClusteringResponse]:
        """Create ClusteringResponse objects with usernames populated as computed fields."""
        responses = []
        for clustering in clusterings:
            response = ClusteringResponse.model_validate(clustering)
            # Set the computed field values
            response._created_by_username = (
                clustering.creator.username if clustering.creator else None
            )
            response._updated_by_username = (
                clustering.updater.username if clustering.updater else None
            )
            responses.append(response)
        return responses

    def _create_clustering_response_with_usernames(
        self, clustering: Clustering
    ) -> ClusteringResponse:
        """Create a single ClusteringResponse object with usernames populated as computed fields."""
        response = ClusteringResponse.model_validate(clustering)
        # Set the computed field values
        response._created_by_username = (
            clustering.creator.username if clustering.creator else None
        )
        response._updated_by_username = (
            clustering.updater.username if clustering.updater else None
        )
        return response

    def _create_topic_response_with_usernames(
        self, topic: ClusteringTopic
    ) -> ClusteringTopicResponse:
        """Create a ClusteringTopicResponse object with usernames populated as computed fields."""
        response = ClusteringTopicResponse.model_validate(topic)
        # Set the computed field values
        response._created_by_username = (
            topic.creator.username if topic.creator else None
        )
        response._updated_by_username = (
            topic.updater.username if topic.updater else None
        )
        return response

    def _create_clustering_topics_with_usernames(
        self, topics: list[ClusteringTopic]
    ) -> list[ClusteringTopicResponse]:
        """Create ClusteringTopicResponse objects with usernames populated as computed fields."""
        responses = []
        for topic in topics:
            response = ClusteringTopicResponse.model_validate(topic)
            # Set the computed field values
            response._created_by_username = (
                topic.creator.username if topic.creator else None
            )
            response._updated_by_username = (
                topic.updater.username if topic.updater else None
            )
            responses.append(response)
        return responses

    def _create_clustering_children_with_usernames(
        self, children: list[ClusteringChild]
    ) -> list[ClusteringChildResponse]:
        """Create ClusteringChildResponse objects with usernames populated as computed fields."""
        responses = []
        for child in children:
            response = ClusteringChildResponse.model_validate(child)
            # Set the computed field values
            response._created_by_username = (
                child.creator.username if child.creator else None
            )
            response._updated_by_username = (
                child.updater.username if child.updater else None
            )
            responses.append(response)
        return responses


def get_clustering_service(db: Session = Depends(get_db)) -> ClusteringService:
    """Get clustering service with database session."""
    return ClusteringService(db)
