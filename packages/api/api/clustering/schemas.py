from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ClusteringBase(BaseModel):
    collection_id: str = Field(..., description="Collection ID")
    search_word: Optional[str] = Field(None, description="Search word")
    title: str = Field(..., description="Clustering title")
    description: Optional[str] = Field(None, description="Clustering description")


class ClusteringCreate(ClusteringBase):
    pass


class ClusteringUpdate(BaseModel):
    search_word: Optional[str] = Field(None, description="Search word")
    title: Optional[str] = Field(None, description="Clustering title")
    description: Optional[str] = Field(None, description="Clustering description")


class ClusteringResponse(ClusteringBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class ClusteringTopicBase(BaseModel):
    clustering_id: str = Field(..., description="Clustering ID")
    title: str = Field(..., description="Topic title")
    description: Optional[str] = Field(None, description="Topic description")


class ClusteringTopicCreate(ClusteringTopicBase):
    pass


class ClusteringTopicUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Topic title")
    description: Optional[str] = Field(None, description="Topic description")


class ClusteringTopicResponse(ClusteringTopicBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True


class ClusteringChildBase(BaseModel):
    clustering_topic_id: str = Field(..., description="Clustering Topic ID")
    target: str = Field(..., description="Document ID")


class ClusteringChildCreate(ClusteringChildBase):
    pass


class ClusteringChildUpdate(BaseModel):
    target: Optional[str] = Field(None, description="Document ID")


class ClusteringChildResponse(ClusteringChildBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]

    class Config:
        from_attributes = True
