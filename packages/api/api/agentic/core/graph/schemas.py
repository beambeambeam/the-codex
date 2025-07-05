from pydantic import BaseModel, Field

from ....document.schemas import DocumentEdgeBase, DocumentNodeBase


class ExtractedGraph(BaseModel):
    """Schema for a knowledge graph."""

    nodes: list[DocumentNodeBase] = Field(
        default_factory=list, description="List of nodes in the knowledge graph"
    )
    edges: list[DocumentEdgeBase] = Field(
        default_factory=list, description="List of edges in the knowledge graph"
    )
