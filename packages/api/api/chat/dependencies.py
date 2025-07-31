from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.chat import CollectionChat, CollectionChatHistory, CollectionChatReference
from .service import ChatService


def get_chat_service(db: Session = Depends(get_db)) -> ChatService:
    return ChatService(db)


def get_chat_or_404(
    chat_id: str, chat_service: ChatService = Depends(get_chat_service)
) -> CollectionChat:
    chat = chat_service.get_chat(chat_id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )
    return chat


def get_chat_with_history_or_404(
    chat_id: str, chat_service: ChatService = Depends(get_chat_service)
) -> CollectionChat:
    chat = chat_service.get_chat_with_history(chat_id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )
    return chat


def get_history_or_404(
    history_id: str, chat_service: ChatService = Depends(get_chat_service)
) -> CollectionChatHistory:
    history = chat_service.get_history(history_id)
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat history not found"
        )
    return history


def get_reference_or_404(
    reference_id: str, chat_service: ChatService = Depends(get_chat_service)
) -> CollectionChatReference:
    reference = chat_service.get_reference(reference_id)
    if not reference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat reference not found"
        )
    return reference
