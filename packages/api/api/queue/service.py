"""Queue service for handling common queue operations."""

import logging
from enum import Enum
from typing import Any, Callable, Optional

from .client import QueueClient

logger = logging.getLogger(__name__)


class QueueType(str, Enum):
    """Predefined queue types."""

    DOCUMENT_PROCESSING = "document_processing"
    CHAT_NOTIFICATIONS = "chat_notifications"
    EMAIL_NOTIFICATIONS = "email_notifications"
    SYSTEM_EVENTS = "system_events"


class QueueService:
    """High-level service for queue operations."""

    def __init__(self):
        """Initialize the queue service."""
        self.client = QueueClient()
        self._initialized_queues: set[str] = set()

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

    def publish_document_processing_task(
        self,
        document_id: str,
        task_type: str,
        metadata: Optional[dict[str, Any]] = None,
    ) -> None:
        """Publish a document processing task."""
        message = {
            "document_id": document_id,
            "task_type": task_type,
            "metadata": metadata or {},
        }

        with self.client:
            self.client.publish_message(
                exchange="processing",
                routing_key=QueueType.DOCUMENT_PROCESSING.value,
                message=message,
            )

        logger.info(f"Published document processing task for {document_id}")

    def publish_chat_notification(
        self,
        user_id: str,
        chat_id: str,
        message_content: str,
        notification_type: str = "new_message",
    ) -> None:
        """Publish a chat notification."""
        message = {
            "user_id": user_id,
            "chat_id": chat_id,
            "message_content": message_content,
            "notification_type": notification_type,
        }

        with self.client:
            self.client.publish_message(
                exchange="notifications",
                routing_key=QueueType.CHAT_NOTIFICATIONS.value,
                message=message,
            )

        logger.info(f"Published chat notification for user {user_id}")

    def publish_email_notification(
        self,
        recipient_email: str,
        subject: str,
        body: str,
        template: Optional[str] = None,
    ) -> None:
        """Publish an email notification."""
        message = {
            "recipient_email": recipient_email,
            "subject": subject,
            "body": body,
            "template": template,
        }

        with self.client:
            self.client.publish_message(
                exchange="notifications",
                routing_key=QueueType.EMAIL_NOTIFICATIONS.value,
                message=message,
            )

        logger.info(f"Published email notification to {recipient_email}")

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

        with self.client:
            return self.client.get_message(queue_name)

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


# Singleton instance
_queue_service: Optional[QueueService] = None


def get_queue_service() -> QueueService:
    """Get the queue service singleton."""
    global _queue_service
    if _queue_service is None:
        _queue_service = QueueService()
    return _queue_service
