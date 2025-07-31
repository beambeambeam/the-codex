from fastapi import APIRouter, Depends, Query, status

from ..agentic.agent import rag_agent
from ..agentic.dependencies import get_rag_agent
from ..auth.dependencies import get_current_user
from ..message_queue.service import get_queue_service
from ..models.user import User
from .dependencies import (
    get_chat_service,
    get_chat_with_history_or_404,
)
from .schemas import (
    CollectionChatCreate,
    CollectionChatResponse,
    CollectionChatUpdate,
    CollectionChatWithHistoryResponse,
)
from .service import ChatService

router = APIRouter(prefix="/chats", tags=["chats"])


# CollectionChat endpoints
@router.post(
    "/",
    response_model=CollectionChatResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_chat_with_rag(
    chat_data: CollectionChatCreate,
    current_user: User = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
    rag_agent: rag_agent = Depends(get_rag_agent),
):
    """Create a new chat and trigger RAG processing in the background."""
    chat = chat_service.create_chat(chat_data, current_user)

    queue_service = get_queue_service()

    try:
        references = getattr(chat_data, "references", None)

        if references is not None and references != []:
            rag_agent.create_flow(flow_type="document")
        else:
            rag_agent.create_flow(flow_type="collection")

        shared_store = rag_agent.run(
            collection_chat_id=chat.id,
            user_question=chat_data.message,
            references=None,
        )

        if shared_store.retrieved_contexts:
            for context in shared_store.retrieved_contexts:
                context.chunk_text = (
                    context.chunk_text[:100] + "..."
                    if len(context.chunk_text) > 100
                    else context.chunk_text
                )

        queue_service.publish_chat_event(
            chat_id=chat.id,
            event_type="rag_processing_completed",
            data={"status": "completed", "chat_id": chat.id},
        )
    except Exception as e:
        queue_service.publish_chat_event(
            chat_id=chat.id,
            event_type="rag_processing_failed",
            data={"status": "failed", "error": str(e), "chat_id": chat.id},
        )

    chat.created_by = current_user.username if current_user else None
    chat.updated_by = current_user.username if current_user else None

    return chat


@router.get("/", response_model=list[CollectionChatResponse])
def list_chats(
    collection_id: str,
    chat_service: ChatService = Depends(get_chat_service),
):
    chat_list = chat_service.list_chats(collection_id)
    for chat in chat_list:
        chat.created_by = chat.creator.username if chat.creator else None
        chat.updated_by = chat.updater.username if chat.updater else None

    return chat_list


@router.get("/search", response_model=list[CollectionChatResponse])
def search_chats_by_title(
    collection_id: str,
    query: str = Query(
        ...,
        min_length=1,
        description="Search query for chats by title",
    ),
    chat_service: ChatService = Depends(get_chat_service),
):
    """Search for chats in a collection by title."""
    chat_list = chat_service.search_chats_by_title(collection_id, query)
    for chat in chat_list:
        chat.created_by = chat.creator.username if chat.creator else None
        chat.updated_by = chat.updater.username if chat.updater else None
    return chat_list


@router.get("/{chat_id}", response_model=CollectionChatWithHistoryResponse)
def get_chat(chat=Depends(get_chat_with_history_or_404)):
    """Get chat with its history by chat ID."""
    chat.created_by = chat.creator.username if chat.creator else None
    chat.updated_by = chat.updater.username if chat.updater else None
    for history in chat.histories:
        history.created_by = history.creator.username if history.creator else None

    return chat


@router.put("/{chat_id}", response_model=CollectionChatResponse)
def update_chat(
    chat_id: str,
    update_data: CollectionChatUpdate,
    current_user: User = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
):
    updated_chat = chat_service.update_chat(chat_id, update_data, current_user)
    if updated_chat is None:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )

    updated_chat.created_by = (
        updated_chat.creator.username if updated_chat.creator else None
    )
    updated_chat.updated_by = current_user.username if current_user else None
    return updated_chat


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(
    chat_id: str,
    chat_service: ChatService = Depends(get_chat_service),
):
    chat_service.delete_chat(chat_id)
