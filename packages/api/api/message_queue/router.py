"""Queue management router."""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from ..auth import get_current_user
from ..models.user import User
from .service import QueueService, QueueType, get_queue_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/queue", tags=["queue"])


class QueueHealthResponse(BaseModel):
    """Queue health check response."""

    healthy: bool
    message: str


class PublishMessageRequest(BaseModel):
    """Request to publish a message."""

    queue_type: QueueType
    message: dict


class TestPublishRequest(BaseModel):
    """Request to test publish a message to a document, collection, or chat."""

    target_type: str  # 'document', 'collection', or 'chat'
    target_id: str
    event_type: str
    data: dict


@router.get("/health", response_model=QueueHealthResponse)
def check_queue_health(
    queue_service: QueueService = Depends(get_queue_service),
):
    """Check RabbitMQ connection health."""
    is_healthy = queue_service.health_check()

    return QueueHealthResponse(
        healthy=is_healthy,
        message=(
            "Queue service is healthy" if is_healthy else "Queue service is unhealthy"
        ),
    )


@router.post("/initialize")
def initialize_queues(
    current_user: User = Depends(get_current_user),
    queue_service: QueueService = Depends(get_queue_service),
):
    """Initialize default queues (admin only)."""
    try:
        queue_service.initialize_default_queues()
        return {"message": "Default queues initialized successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initialize queues: {str(e)}",
        ) from e


@router.post("/test-publish")
def test_publish(
    req: TestPublishRequest,
    current_user: User = Depends(get_current_user),
    queue_service: QueueService = Depends(get_queue_service),
):
    """Test endpoint to publish a message to a document, collection, or chat queue."""
    try:
        if req.target_type == "document":
            queue_service.publish_document_event(
                req.target_id, req.event_type, req.data
            )
        elif req.target_type == "collection":
            queue_service.publish_collection_event(
                req.target_id, req.event_type, req.data
            )
        elif req.target_type == "chat":
            queue_service.publish_chat_event(req.target_id, req.event_type, req.data)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid target_type. Must be one of: document, collection, chat.",
            )
        return {
            "message": f"Published {req.event_type} to {req.target_type}_{req.target_id}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to publish test message: {str(e)}",
        ) from e
