from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from ....document.schemas import DocumentResponse


class TopicCluster(BaseModel):
    """Represents a cluster of topics with associated documents."""

    title: str
    description: Optional[str] = Field(
        None, description="Description of the topic cluster"
    )
    id: int
    documents: list[DocumentResponse]


class DocumentDistribution(BaseModel):
    """Represents the distribution of topics for a document."""

    document_id: str
    title: str
    description: Optional[str]
    distribution: dict[str, int]


class ClusteringResult(BaseModel):
    """Result of the clustering operation."""

    title: str = Field(..., description="Title of the clustering result")
    description: Optional[str] = Field(
        None, description="Description of the clustering result"
    )
    topics: list[TopicCluster]
    documents: list[DocumentDistribution]


class ClusteringDetails(BaseModel):
    """Schema for describing a cluster of related documents (e.g., from topic modeling)."""

    title: Optional[str] = Field(
        None, description="Representative title for this cluster of documents"
    )
    description: Optional[str] = Field(
        None,
        description=(
            "Comprehensive summary of the dominant themes or concepts represented by documents in this cluster. "
            "May include notable trends, patterns, or shared content among documents."
        ),
    )

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "title": "Victorian Literature and Modern Reflections",
                    "description": (
                        "This cluster includes academic papers and essays exploring Victorian-era poetry and novels, "
                        "particularly focusing on how 19th-century themes—such as secrecy, identity, and passion—resonate in modern literary analysis. "
                        "Many documents discuss narrative structure, archival research, and dual timelines in historical fiction."
                    ),
                },
                {
                    "title": "Exercise and Mental Health Research",
                    "description": (
                        "Documents in this cluster revolve around clinical studies, meta-analyses, and wellness articles "
                        "investigating the mental health benefits of regular aerobic activity. Common themes include randomized controlled trials, depression/anxiety scoring scales, and integration of exercise into public health recommendations."
                    ),
                },
                {
                    "title": "Global COVID-19 Data Visualizations",
                    "description": (
                        "This cluster includes infographics and data summaries tracking COVID-19 case trends worldwide from 2020 to 2021. "
                        "Visualizations highlight major waves, variant emergence, vaccine deployment, and data sources like WHO and Johns Hopkins."
                    ),
                },
            ]
        }
    )
