from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from ..models.enum import CollectionChatReferenceType


class CollectionChatBase(BaseModel):
    collection_id: str = Field(..., description="Collection ID")
    title: str = Field(..., description="Chat title")
    description: Optional[str] = Field(None, description="Chat description")


class CollectionChatCreate(CollectionChatBase):
    pass


class CollectionChatUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Chat title")
    description: Optional[str] = Field(None, description="Chat description")


class CollectionChatResponse(CollectionChatBase):
    id: str
    created_by: Optional[str]
    created_at: datetime
    updated_by: Optional[str]
    updated_at: datetime

    class Config:
        from_attributes = True


class CollectionChatHistoryBase(BaseModel):
    collection_chat_id: str = Field(..., description="Collection Chat ID")
    agent: str = Field(..., description="User or Agent")
    system_prompt: Optional[str] = Field(None, description="System prompt")
    instruct: Optional[str] = Field(None, description="Instruction")
    text: str = Field(..., description="Message text")


class CollectionChatHistoryCreate(CollectionChatHistoryBase):
    pass


class CollectionChatHistoryUpdate(BaseModel):
    system_prompt: Optional[str] = Field(None, description="System prompt")
    instruct: Optional[str] = Field(None, description="Instruction")
    text: Optional[str] = Field(None, description="Message text")


class CollectionChatHistoryResponse(CollectionChatHistoryBase):
    id: str
    created_by: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CollectionChatReferenceBase(BaseModel):
    collection_chat_history_id: str = Field(
        ..., description="Collection Chat History ID"
    )
    document_id: Optional[str] = Field(None, description="Document ID")
    chunk_id: Optional[str] = Field(None, description="Chunk ID")
    type: CollectionChatReferenceType = Field(
        ..., description="Reference type (chunk or graph)"
    )


class CollectionChatReferenceCreate(CollectionChatReferenceBase):
    pass


class CollectionChatReferenceUpdate(BaseModel):
    document_id: Optional[str] = Field(None, description="Document ID")
    chunk_id: Optional[str] = Field(None, description="Chunk ID")
    type: Optional[CollectionChatReferenceType] = Field(
        None, description="Reference type (chunk or graph)"
    )


class CollectionChatReferenceResponse(CollectionChatReferenceBase):
    id: str

    class Config:
        from_attributes = True
