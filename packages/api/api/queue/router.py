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


class QueueStatsResponse(BaseModel):
    """Queue statistics response."""

    queue_name: str
    message_count: int


class PublishMessageRequest(BaseModel):
    """Request to publish a message."""

    queue_type: QueueType
    message: dict


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


@router.get("/stats/{queue_type}", response_model=QueueStatsResponse)
def get_queue_stats(
    queue_type: QueueType,
    current_user: User = Depends(get_current_user),
    queue_service: QueueService = Depends(get_queue_service),
):
    """Get statistics for a specific queue."""
    try:
        # For now, we'll just return the queue name
        # In a full implementation, you might want to get actual message counts
        return QueueStatsResponse(
            queue_name=queue_type.value,
            message_count=0,  # Placeholder
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get queue stats: {str(e)}",
        ) from e


@router.post("/purge/{queue_type}")
def purge_queue(
    queue_type: QueueType,
    current_user: User = Depends(get_current_user),
    queue_service: QueueService = Depends(get_queue_service),
):
    """Purge all messages from a queue (admin only)."""
    try:
        purged_count = queue_service.purge_queue(queue_type)
        return {"message": f"Purged {purged_count} messages from {queue_type.value}"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to purge queue: {str(e)}",
        ) from e


@router.get("/debug/{queue_type}")
def debug_queue_info(
    queue_type: QueueType,
    current_user: User = Depends(get_current_user),
    queue_service: QueueService = Depends(get_queue_service),
):
    """Debug endpoint to check queue information (admin only)."""
    try:
        # Check if queue is initialized
        is_initialized = queue_type.value in queue_service._initialized_queues

        return {
            "queue_type": queue_type.value,
            "is_initialized": is_initialized,
            "note": "Use /queue/peek/{queue_type} to see a message without consuming it",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to debug queue: {str(e)}",
        ) from e


@router.get("/peek/{queue_type}")
def peek_queue_message(
    queue_type: QueueType,
    current_user: User = Depends(get_current_user),
    queue_service: QueueService = Depends(get_queue_service),
):
    """Peek at a message in the queue (consumes one message for testing)."""
    try:
        message = queue_service.get_queue_message(queue_type)

        return {
            "queue_type": queue_type.value,
            "has_message": message is not None,
            "message": message,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to peek queue: {str(e)}",
        ) from e
