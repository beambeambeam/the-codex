from pydantic import BaseModel

from ....document.schemas import DocumentResponse


class TopicCluster(BaseModel):
    topic_id: int
    documents: list[DocumentResponse]


class DocumentDistribution(BaseModel):
    top_topic: str
    distribution: dict[str, int]


class ClusteringResult(BaseModel):
    topics: dict[str, TopicCluster]
    documents: dict[str, DocumentDistribution]
