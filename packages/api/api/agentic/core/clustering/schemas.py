from pydantic import BaseModel

from ....document.schemas import DocumentResponse


class TopicCluster(BaseModel):
    """Represents a cluster of topics with associated documents."""

    title: str
    id: int
    documents: list[DocumentResponse]


class DocumentDistribution(BaseModel):
    """Represents the distribution of topics for a document."""

    document_id: str
    top_topic: str
    distribution: dict[str, int]


class ClusteringResult(BaseModel):
    """Result of the clustering operation."""

    topics: list[TopicCluster]
    documents: list[DocumentDistribution]
