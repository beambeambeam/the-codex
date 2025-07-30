from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

from ..models.enum import ChatStatus, CollectionChatReferenceType, Role


class CollectionChatBase(BaseModel):
    collection_id: str = Field(..., description="Collection ID")
    title: str = Field(..., description="Chat title")
    description: Optional[str] = Field(None, description="Chat description")


class CollectionChatCreate(CollectionChatBase):
    pass


class CollectionChatUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Chat title")
    description: Optional[str] = Field(None, description="Chat description")
    status: Optional[ChatStatus] = Field(None, description="Chat status")


class CollectionChatResponse(CollectionChatBase):
    id: str
    created_by: Optional[str]
    created_at: datetime
    updated_by: Optional[str]
    updated_at: datetime
    status: ChatStatus

    class Config:
        from_attributes = True


class CollectionChatWithHistoryResponse(CollectionChatBase):
    id: str
    created_by: Optional[str]
    created_at: datetime
    updated_by: Optional[str]
    updated_at: datetime
    status: ChatStatus
    histories: List["CollectionChatHistoryResponse"] = Field(
        default_factory=list, description="Chat history messages"
    )

    class Config:
        from_attributes = True


class CollectionChatHistoryBase(BaseModel):
    collection_chat_id: str = Field(..., description="Collection Chat ID")
    role: Role = Field(
        ..., description="Role of the message sender (user/assistant/system)"
    )
    content: str = Field(..., description="Content of the chat message")


class CollectionChatHistoryCreate(CollectionChatHistoryBase):
    pass


class CollectionChatHistoryUpdate(BaseModel):
    role: Optional[Role] = Field(
        None, description="Role of the message sender (user/assistant/system)"
    )
    content: Optional[str] = Field(None, description="Content of the chat message")


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


# Update forward references
CollectionChatWithHistoryResponse.model_rebuild()
