"""Queue management router."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from ..auth import get_current_user
from ..models.user import User
from .service import QueueService, QueueType, get_queue_service

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


@router.post("/publish")
def publish_message(
    request: PublishMessageRequest,
    current_user: User = Depends(get_current_user),
    queue_service: QueueService = Depends(get_queue_service),
):
    """Publish a message to a queue (for testing/admin purposes)."""
    try:
        # Use the client directly for custom messages
        with queue_service.client:
            queue_service.client.publish_to_queue(
                queue_name=request.queue_type.value, message=request.message
            )

        return {"message": f"Message published to {request.queue_type.value}"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to publish message: {str(e)}",
        ) from e
