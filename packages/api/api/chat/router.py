import asyncio
from fastapi import APIRouter, Depends, Query, status

from ..auth.dependencies import get_current_user
from ..models.user import User
from .dependencies import (
    get_chat_or_404,
    get_chat_service,
)
from .schemas import (
    CollectionChatCreate,
    CollectionChatResponse,
    CollectionChatUpdate,
)
from .service import ChatService
from ..agentic.agent import rag_agent
from ..agentic.dependencies import get_rag_agent
from ..message_queue.service import get_queue_service

router = APIRouter(prefix="/chats", tags=["chats"])


# CollectionChat endpoints
@router.post(
    "/", response_model=CollectionChatResponse, status_code=status.HTTP_201_CREATED
)
def create_chat(
    chat_data: CollectionChatCreate,
    current_user: User = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
):
    return chat_service.create_chat(chat_data, current_user)


@router.post(
    "/with_rag",
    response_model=CollectionChatResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_chat_with_rag(
    chat_data: CollectionChatCreate,
    current_user: User = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
    rag_agent_instance: rag_agent = Depends(get_rag_agent),
):
    """Create a new chat and trigger RAG processing in the background."""
    # Create the chat first
    chat = chat_service.create_chat(chat_data, current_user)

    # Get queue service for background processing
    queue_service = get_queue_service()

    # Schedule RAG processing in the background
    async def process_rag_background():
        try:
            # Initialize RAG flow for collection
            rag_agent_instance.create_flow(flow_type="collection")

            # Run RAG processing
            shared_store = rag_agent_instance.run(
                collection_chat_id=chat.id,
                user_question="",  # Empty question to initialize RAG
                references=None,
            )

            # Publish completion event
            queue_service.publish_chat_event(
                chat_id=chat.id,
                event_type="rag_processing_completed",
                data={"status": "completed", "chat_id": chat.id},
            )
        except Exception as e:
            # Publish error event
            queue_service.publish_chat_event(
                chat_id=chat.id,
                event_type="rag_processing_failed",
                data={"status": "failed", "error": str(e), "chat_id": chat.id},
            )

    # Start background processing
    asyncio.create_task(process_rag_background())

    return chat


@router.get("/", response_model=list[CollectionChatResponse])
def list_chats(
    collection_id: str,
    chat_service: ChatService = Depends(get_chat_service),
):
    return chat_service.list_chats(collection_id)


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
    return chat_service.search_chats_by_title(collection_id, query)


@router.get("/{chat_id}", response_model=CollectionChatResponse)
def get_chat(chat=Depends(get_chat_or_404)):
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
    return updated_chat


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(
    chat_id: str,
    chat_service: ChatService = Depends(get_chat_service),
):
    chat_service.delete_chat(chat_id)
