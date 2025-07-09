"""Queue service for handling common queue operations."""

import logging
from enum import Enum
from typing import Any, Callable, Optional

from .client import QueueClient

logger = logging.getLogger(__name__)


class QueueType(str, Enum):
    """Predefined queue types."""

    DOCUMENT_PROCESSING = "document_processing"
    COLLECTION_PROCESSING = "collection_processing"
    CHAT_NOTIFICATIONS = "chat_notifications"
    SYSTEM_EVENTS = "system_events"


class QueueService:
    """High-level service for queue operations."""

    def __init__(self):
        """Initialize the queue service."""
        self.client = QueueClient()
        self._initialized_queues: set[str] = set()

        try:
            self.initialize_default_queues()
        except Exception as e:
            logger.warning(f"Failed to auto-initialize queues on startup: {e}")

    def initialize_default_queues(self) -> None:
        """Initialize all default queues and exchanges."""
        with self.client:
            # Declare default exchanges
            self.client.declare_exchange("notifications", "direct")
            self.client.declare_exchange("processing", "direct")
            self.client.declare_exchange("events", "fanout")

            # Declare and bind queues
            for queue_type in QueueType:
                queue_name = queue_type.value
                self.client.declare_queue(queue_name, durable=True)

                # Bind to appropriate exchange
                if "notification" in queue_name:
                    self.client.bind_queue(queue_name, "notifications", queue_name)
                elif "processing" in queue_name:
                    self.client.bind_queue(queue_name, "processing", queue_name)
                else:
                    self.client.bind_queue(queue_name, "events", "")

                self._initialized_queues.add(queue_name)

            logger.info("Default queues initialized")

    def publish_system_event(
        self,
        event_type: str,
        data: dict[str, Any],
    ) -> None:
        """Publish a system event (broadcast to all listeners)."""
        message = {
            "event_type": event_type,
            "data": data,
        }

        with self.client:
            self.client.publish_message(
                exchange="events",
                routing_key="",  # Fanout exchange ignores routing key
                message=message,
            )

        logger.info(f"Published system event: {event_type}")

    def start_consumer(
        self,
        queue_type: QueueType,
        callback: Callable[[dict[str, Any]], None],
        auto_ack: bool = False,
    ) -> None:
        """Start consuming messages from a specific queue."""
        queue_name = queue_type.value

        # Ensure queue is initialized
        if queue_name not in self._initialized_queues:
            self.initialize_default_queues()

        with self.client:
            logger.info(f"Starting consumer for queue: {queue_name}")
            self.client.consume_messages(queue_name, callback, auto_ack)

    def get_queue_message(self, queue_type: QueueType) -> Optional[dict[str, Any]]:
        """Get a single message from a queue (polling)."""
        queue_name = queue_type.value

        try:
            with self.client:
                message = self.client.get_message(queue_name)
                if message:
                    logger.info(f"Retrieved message from queue {queue_name}: {message}")
                else:
                    logger.debug(f"No messages in queue {queue_name}")
                return message
        except Exception as e:
            logger.error(f"Error getting message from queue {queue_name}: {e}")
            return None

    def purge_queue(self, queue_type: QueueType) -> int:
        """Purge all messages from a queue."""
        queue_name = queue_type.value

        with self.client:
            return self.client.purge_queue(queue_name)

    def health_check(self) -> bool:
        """Check if RabbitMQ connection is healthy."""
        try:
            with self.client:
                # Try to declare a temporary queue to test connection
                self.client.declare_queue("health_check", auto_delete=True)
                return True
        except Exception as e:
            logger.error(f"Queue health check failed: {e}")
            return False

    def publish_document_event(
        self, document_id: str, event_type: str, data: dict[str, Any]
    ) -> None:
        """Publish an SSE event for a specific document."""
        message = {
            "event_type": event_type,
            "document_id": document_id,
            "data": data,
        }
        channel = f"document_{document_id}"
        self.client.publish_to_queue(channel, message)

    def publish_collection_event(
        self, collection_id: str, event_type: str, data: dict[str, Any]
    ) -> None:
        """Publish an SSE event for a specific collection."""
        message = {
            "event_type": event_type,
            "collection_id": collection_id,
            "data": data,
        }
        channel = f"collection_{collection_id}"
        self.client.publish_to_queue(channel, message)

    def publish_chat_event(
        self, chat_id: str, event_type: str, data: dict[str, Any]
    ) -> None:
        """Publish an SSE event for a specific chat."""
        message = {
            "event_type": event_type,
            "chat_id": chat_id,
            "data": data,
        }
        channel = f"chat_{chat_id}"
        self.client.publish_to_queue(channel, message)


# Singleton instance
_queue_service: Optional[QueueService] = None


def get_queue_service() -> QueueService:
    """Get the queue service singleton."""
    global _queue_service
    if _queue_service is None:
        _queue_service = QueueService()
    return _queue_service
