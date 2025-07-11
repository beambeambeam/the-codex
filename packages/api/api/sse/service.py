"""SSE service for streaming events from RabbitMQ to clients."""

import asyncio
import json
import logging
import time
from collections.abc import AsyncGenerator
from typing import Any, Optional

from sse_starlette import EventSourceResponse

from ..queue.service import QueueType, get_queue_service

logger = logging.getLogger(__name__)


class SSEService:
    """Service for streaming Server-Sent Events from RabbitMQ."""

    def __init__(self):
        """Initialize the SSE service."""
        self.active_connections: dict[str, asyncio.Queue] = {}

    async def stream_events(
        self, user_id: str, channels: Optional[list[str]] = None
    ) -> AsyncGenerator[dict[str, Any], None]:
        """Stream events to a client via SSE."""
        if channels is None:
            # Default to all available queue types
            channels = [
                "chat_notifications",
                "system_events",
                "document_processing",
                "collection_processing",
            ]

        # Create a queue for this connection
        connection_id = f"{user_id}_{int(time.time())}"
        connection_queue = asyncio.Queue(maxsize=100)
        self.active_connections[connection_id] = connection_queue

        # Start a background task to poll RabbitMQ
        poll_task = asyncio.create_task(self._poll_rabbitmq(connection_queue, channels))

        try:
            while True:
                try:
                    # Wait for events with timeout
                    event = await asyncio.wait_for(connection_queue.get(), timeout=30.0)
                    yield {
                        "event": event.get("event", "message"),
                        "data": json.dumps(event.get("data", {})),
                        "id": event.get("id", ""),
                    }
                except asyncio.TimeoutError:
                    # Send heartbeat to keep connection alive
                    yield {
                        "event": "heartbeat",
                        "data": json.dumps({"timestamp": int(time.time())}),
                    }
                except Exception as e:
                    logger.error(f"Error in event stream: {e}")
                    break
        except asyncio.CancelledError:
            logger.info(f"SSE connection cancelled for user {user_id}")
        except Exception as e:
            logger.error(f"Unexpected error in SSE stream: {e}")
        finally:
            # Clean up
            poll_task.cancel()
            if connection_id in self.active_connections:
                del self.active_connections[connection_id]

    def create_event_response(
        self, user_id: str, channels: Optional[list[str]] = None
    ) -> EventSourceResponse:
        """Create an EventSourceResponse for streaming events to a client."""
        return EventSourceResponse(
            self.stream_events(user_id, channels),
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Cache-Control",
            },
        )

    async def _poll_rabbitmq(
        self, connection_queue: asyncio.Queue, channels: list[str]
    ):
        """Poll RabbitMQ for messages and add them to the connection queue."""
        queue_service = get_queue_service()

        while True:
            try:
                # Poll each channel for messages
                for channel in channels:
                    try:
                        # Map channel names to queue types
                        queue_type = None
                        if channel == "chat_notifications":
                            queue_type = QueueType.CHAT_NOTIFICATIONS
                        elif channel == "system_events":
                            queue_type = QueueType.SYSTEM_EVENTS
                        elif channel == "document_processing":
                            queue_type = QueueType.DOCUMENT_PROCESSING
                        elif channel == "collection_processing":
                            queue_type = QueueType.COLLECTION_PROCESSING
                        else:
                            # Try to match any valid queue type
                            try:
                                queue_type = QueueType(channel)
                            except ValueError:
                                # Skip unknown channels
                                continue

                        # Get a message from the queue
                        message = queue_service.get_queue_message(queue_type)

                        if message:
                            logger.info(f"SSE: Got message from {channel}: {message}")
                            event_data = {
                                "event": channel,
                                "data": message,
                                "id": str(int(time.time())),
                            }

                            try:
                                connection_queue.put_nowait(event_data)
                                logger.info(f"SSE: Queued event for {channel}")
                            except asyncio.QueueFull:
                                logger.warning(
                                    "Connection queue full, dropping message"
                                )
                        else:
                            logger.debug(f"SSE: No message in {channel}")

                    except Exception as e:
                        logger.error(f"Error polling {channel}: {e}")

                # Small delay to prevent busy waiting
                await asyncio.sleep(1.0)  # Increased from 0.5 to 1.0 seconds

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in RabbitMQ polling: {e}")
                await asyncio.sleep(1)


# Global SSE service instance
sse_service = SSEService()


def get_sse_service() -> SSEService:
    """Get the global SSE service instance."""
    return sse_service
