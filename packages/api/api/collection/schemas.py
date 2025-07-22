"""Collection schemas for request/response validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from ..models.enum import Role


class CollectionBase(BaseModel):
    """Base collection schema."""

    name: str = Field(..., min_length=1, max_length=255, description="Collection name")
    description: Optional[str] = Field(
        None, max_length=1000, description="Collection description"
    )


class CollectionCreate(CollectionBase):
    """Schema for creating a collection."""

    pass


class CollectionUpdate(BaseModel):
    """Schema for updating a collection."""

    name: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Collection name"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Collection description"
    )


class CollectionResponse(CollectionBase):
    """Schema for collection response."""

    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class CollectionRelationBase(BaseModel):
    """Base collection relation schema."""

    title: str = Field(..., min_length=1, max_length=255, description="Relation title")
    description: Optional[str] = Field(
        None, max_length=1000, description="Relation description"
    )


class CollectionRelationCreate(CollectionRelationBase):
    """Schema for creating a collection relation."""

    collection_id: str = Field(
        ..., description="Collection ID this relation belongs to"
    )


class CollectionRelationUpdate(BaseModel):
    """Schema for updating a collection relation."""

    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Relation title"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Relation description"
    )


class CollectionRelationResponse(CollectionRelationBase):
    """Schema for collection relation response."""

    id: str
    collection_id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class CollectionNodeBase(BaseModel):
    """Base collection node schema."""

    title: str = Field(..., min_length=1, max_length=255, description="Node title")
    description: Optional[str] = Field(
        None, max_length=1000, description="Node description"
    )
    type: str = Field(..., min_length=1, max_length=100, description="Node type")
    label: str = Field(..., min_length=1, max_length=255, description="Node label")


class CollectionNodeCreate(CollectionNodeBase):
    """Schema for creating a collection node."""

    collection_relation_id: str = Field(
        ..., description="Relation ID this node belongs to"
    )


class CollectionNodeUpdate(BaseModel):
    """Schema for updating a collection node."""

    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Node title"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Node description"
    )
    type: Optional[str] = Field(
        None, min_length=1, max_length=100, description="Node type"
    )
    label: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Node label"
    )


class CollectionNodeResponse(CollectionNodeBase):
    """Schema for collection node response."""

    id: str
    collection_relation_id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class CollectionEdgeBase(BaseModel):
    """Base collection edge schema."""

    label: str = Field(..., min_length=1, max_length=255, description="Edge label")
    source: str = Field(..., min_length=1, description="Source node ID")
    target: str = Field(..., min_length=1, description="Target node ID")


class CollectionEdgeCreate(CollectionEdgeBase):
    """Schema for creating a collection edge."""

    collection_relation_id: str = Field(
        ..., description="Relation ID this edge belongs to"
    )


class CollectionEdgeUpdate(BaseModel):
    """Schema for updating a collection edge."""

    label: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Edge label"
    )
    source: Optional[str] = Field(None, min_length=1, description="Source node ID")
    target: Optional[str] = Field(None, min_length=1, description="Target node ID")


class CollectionEdgeResponse(CollectionEdgeBase):
    """Schema for collection edge response."""

    id: str
    collection_relation_id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


# Detailed response schemas with nested relationships
class CollectionRelationWithNodes(CollectionRelationResponse):
    """Collection relation with nodes and edges."""

    nodes: list[CollectionNodeResponse] = []
    edges: list[CollectionEdgeResponse] = []


class CollectionDetailResponse(CollectionResponse):
    """Detailed collection response with all nested data."""

    relations: list[CollectionRelationWithNodes] = []
