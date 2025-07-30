"""SSE router for streaming events."""

from typing import Optional

from fastapi import APIRouter, Depends, Path, Query

from ..auth import get_current_user
from ..models.user import User
from .service import SSEService, get_sse_service

router = APIRouter(prefix="/sse", tags=["sse"])


@router.get("/events")
async def stream_events(
    channels: Optional[str] = Query(
        None, description="Comma-separated list of channels to subscribe to"
    ),
    current_user: User = Depends(get_current_user),
    sse_service: SSEService = Depends(get_sse_service),
):
    """Stream server-sent events for the authenticated user."""
    # Parse channels parameter
    channel_list = None
    if channels:
        channel_list = [ch.strip() for ch in channels.split(",") if ch.strip()]

    return sse_service.create_event_response(str(current_user.id), channel_list)


@router.get("/system")
async def stream_system_events(
    current_user: User = Depends(get_current_user),
    sse_service: SSEService = Depends(get_sse_service),
):
    """Stream system events."""
    return sse_service.create_event_response(str(current_user.id), ["system_events"])


@router.get("/collections/{collection_id}")
async def stream_collection_events(
    collection_id: str = Path(..., description="Collection ID to stream events for"),
    current_user: User = Depends(get_current_user),
    sse_service: SSEService = Depends(get_sse_service),
):
    """Stream SSE events for a specific collection."""
    channel = f"collection_{collection_id}"
    return sse_service.create_event_response(str(current_user.id), [channel])


@router.get("/documents/{document_id}")
async def stream_document_events(
    document_id: str = Path(..., description="Document ID to stream events for"),
    current_user: User = Depends(get_current_user),
    sse_service: SSEService = Depends(get_sse_service),
):
    """Stream SSE events for a specific document."""
    channel = f"document_{document_id}"
    return sse_service.create_event_response(str(current_user.id), [channel])


@router.get("/chats/{chat_id}")
async def stream_chat_events(
    chat_id: str = Path(..., description="Chat ID to stream events for"),
    current_user: User = Depends(get_current_user),
    sse_service: SSEService = Depends(get_sse_service),
):
    """Stream SSE events for a specific chat."""
    channel = f"chat_{chat_id}"
    return sse_service.create_event_response(str(current_user.id), [channel])
