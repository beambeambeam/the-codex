from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from ..models.chat import CollectionChat, CollectionChatHistory, CollectionChatReference
from ..models.user import User
from .schemas import (
    CollectionChatCreate,
    CollectionChatHistoryCreate,
    CollectionChatHistoryUpdate,
    CollectionChatReferenceCreate,
    CollectionChatReferenceUpdate,
    CollectionChatUpdate,
)


class ChatService:
    def __init__(self, db: Session):
        self.db = db

    # CollectionChat CRUD
    def create_chat(
        self, chat_data: CollectionChatCreate, user: User
    ) -> CollectionChat:
        chat = CollectionChat(
            id=str(uuid4()),
            collection_id=chat_data.collection_id,
            title=chat_data.title,
            description=chat_data.description,
            created_by=user.id,
            updated_by=user.id,
        )
        self.db.add(chat)
        self.db.commit()
        self.db.refresh(chat)
        return chat

    def get_chat(self, chat_id: str) -> Optional[CollectionChat]:
        return (
            self.db.query(CollectionChat).filter(CollectionChat.id == chat_id).first()
        )

    def list_chats(self, collection_id: str) -> list[CollectionChat]:
        return (
            self.db.query(CollectionChat)
            .filter(CollectionChat.collection_id == collection_id)
            .all()
        )

    def update_chat(
        self, chat_id: str, update_data: CollectionChatUpdate, user: User
    ) -> CollectionChat:
        chat = self.get_chat(chat_id)
        if not chat:
            return None
        if update_data.title is not None:
            chat.title = update_data.title
        if update_data.description is not None:
            chat.description = update_data.description
        chat.updated_by = user.id
        self.db.commit()
        self.db.refresh(chat)
        return chat

    def delete_chat(self, chat_id: str):
        chat = self.get_chat(chat_id)
        if chat:
            self.db.delete(chat)
            self.db.commit()

    # CollectionChatHistory CRUD
    def create_history(
        self, history_data: CollectionChatHistoryCreate, user: User
    ) -> CollectionChatHistory:
        history = CollectionChatHistory(
            id=str(uuid4()),
            collection_chat_id=history_data.collection_chat_id,
            role=history_data.role,
            content=history_data.content,
            created_by=user.id,
        )
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history

    def get_history(self, history_id: str) -> Optional[CollectionChatHistory]:
        return (
            self.db.query(CollectionChatHistory)
            .filter(CollectionChatHistory.id == history_id)
            .first()
        )

    def list_histories(self, chat_id: str) -> list[CollectionChatHistory]:
        return (
            self.db.query(CollectionChatHistory)
            .filter(CollectionChatHistory.collection_chat_id == chat_id)
            .all()
        )

    def update_history(
        self, history_id: str, update_data: CollectionChatHistoryUpdate
    ) -> Optional[CollectionChatHistory]:
        history = self.get_history(history_id)
        if not history:
            return None
        if update_data.role is not None:
            history.role = update_data.role
        if update_data.content is not None:
            history.content = update_data.content
        self.db.commit()
        self.db.refresh(history)
        return history

    def delete_history(self, history_id: str):
        history = self.get_history(history_id)
        if history:
            self.db.delete(history)
            self.db.commit()

    def clear_history(self, chat_id: str):
        histories = self.list_histories(chat_id)
        for history in histories:
            self.db.delete(history)
        self.db.commit()

    # CollectionChatReference CRUD
    def create_reference(
        self, reference_data: CollectionChatReferenceCreate
    ) -> CollectionChatReference:
        reference = CollectionChatReference(
            id=str(uuid4()),
            collection_chat_history_id=reference_data.collection_chat_history_id,
            document_id=reference_data.document_id,
            chunk_id=reference_data.chunk_id,
            type=reference_data.type,
        )
        self.db.add(reference)
        self.db.commit()
        self.db.refresh(reference)
        return reference

    def get_reference(self, reference_id: str) -> Optional[CollectionChatReference]:
        return (
            self.db.query(CollectionChatReference)
            .filter(CollectionChatReference.id == reference_id)
            .first()
        )

    def list_references(self, history_id: str) -> list[CollectionChatReference]:
        return (
            self.db.query(CollectionChatReference)
            .filter(CollectionChatReference.collection_chat_history_id == history_id)
            .all()
        )

    def update_reference(
        self, reference_id: str, update_data: CollectionChatReferenceUpdate
    ) -> Optional[CollectionChatReference]:
        reference = self.get_reference(reference_id)
        if not reference:
            return None
        if update_data.document_id is not None:
            reference.document_id = update_data.document_id
        if update_data.chunk_id is not None:
            reference.chunk_id = update_data.chunk_id
        if update_data.type is not None:
            reference.type = update_data.type
        self.db.commit()
        self.db.refresh(reference)
        return reference

    def delete_reference(self, reference_id: str):
        reference = self.get_reference(reference_id)
        if reference:
            self.db.delete(reference)
            self.db.commit()
