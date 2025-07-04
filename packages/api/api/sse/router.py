"""SSE router for streaming events."""

from typing import Optional

from fastapi import APIRouter, Depends, Query

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
