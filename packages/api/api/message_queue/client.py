"""RabbitMQ client using pika."""

import json
import logging
from typing import Any, Callable, Optional

import pika
from pika.adapters.blocking_connection import BlockingChannel
from pika.connection import Connection

from ..config import get_settings

logger = logging.getLogger(__name__)


class QueueClient:
    """RabbitMQ client for publishing and consuming messages."""

    def __init__(self):
        """Initialize the queue client."""
        self.settings = get_settings()
        self._connection: Optional[Connection] = None
        self._channel: Optional[BlockingChannel] = None

    def connect(self) -> None:
        """Establish connection to RabbitMQ."""
        try:
            credentials = pika.PlainCredentials(
                username=self.settings.RABBITMQ_USER,
                password=self.settings.RABBITMQ_PASSWORD,
            )

            connection_params = pika.ConnectionParameters(
                host=self.settings.RABBITMQ_HOST,
                port=self.settings.RABBITMQ_PORT,
                virtual_host=self.settings.RABBITMQ_VHOST,
                credentials=credentials,
                heartbeat=600,
                blocked_connection_timeout=300,
            )

            self._connection = pika.BlockingConnection(connection_params)
            self._channel = self._connection.channel()

            logger.info(
                f"Connected to RabbitMQ at "
                f"{self.settings.RABBITMQ_HOST}:{self.settings.RABBITMQ_PORT}"
            )

        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            raise

    def disconnect(self) -> None:
        """Close the connection to RabbitMQ."""
        try:
            if self._channel and not self._channel.is_closed:
                self._channel.close()
            if self._connection and not self._connection.is_closed:
                self._connection.close()
            logger.info("Disconnected from RabbitMQ")
        except Exception as e:
            logger.error(f"Error disconnecting from RabbitMQ: {e}")

    def declare_queue(
        self,
        queue_name: str,
        durable: bool = True,
        exclusive: bool = False,
        auto_delete: bool = False,
    ) -> None:
        """Declare a queue."""
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")

        self._channel.queue_declare(
            queue=queue_name,
            durable=durable,
            exclusive=exclusive,
            auto_delete=auto_delete,
        )
        logger.info(f"Queue '{queue_name}' declared")

    def declare_exchange(
        self,
        exchange_name: str,
        exchange_type: str = "direct",
        durable: bool = True,
        auto_delete: bool = False,
    ) -> None:
        """Declare an exchange."""
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")

        self._channel.exchange_declare(
            exchange=exchange_name,
            exchange_type=exchange_type,
            durable=durable,
            auto_delete=auto_delete,
        )
        logger.info(f"Exchange '{exchange_name}' declared")

    def bind_queue(
        self,
        queue_name: str,
        exchange_name: str,
        routing_key: str = "",
    ) -> None:
        """Bind a queue to an exchange."""
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")

        self._channel.queue_bind(
            queue=queue_name,
            exchange=exchange_name,
            routing_key=routing_key,
        )
        logger.info(
            f"Queue '{queue_name}' bound to exchange '{exchange_name}' "
            f"with routing key '{routing_key}'"
        )

    def publish_message(
        self,
        exchange: str,
        routing_key: str,
        message: dict[str, Any],
        persistent: bool = True,
    ) -> None:
        """Publish a message to an exchange."""
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")

        properties = pika.BasicProperties(
            delivery_mode=2 if persistent else 1,  # Make message persistent
            content_type="application/json",
        )

        message_body = json.dumps(message)

        self._channel.basic_publish(
            exchange=exchange,
            routing_key=routing_key,
            body=message_body,
            properties=properties,
        )

        logger.info(
            f"Message published to exchange '{exchange}' "
            f"with routing key '{routing_key}'"
        )

    def publish_to_queue(
        self,
        queue_name: str,
        message: dict[str, Any],
        persistent: bool = True,
    ) -> None:
        """Publish a message directly to a queue."""
        self.publish_message(
            exchange="",
            routing_key=queue_name,
            message=message,
            persistent=persistent,
        )

    def consume_messages(
        self,
        queue_name: str,
        callback: Callable[[dict[str, Any]], None],
        auto_ack: bool = False,
    ) -> None:
        """Start consuming messages from a queue."""
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")

        def wrapper(ch, method, properties, body):
            try:
                message = json.loads(body.decode())
                callback(message)

                if not auto_ack:
                    ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                if not auto_ack:
                    ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

        self._channel.basic_consume(
            queue=queue_name,
            on_message_callback=wrapper,
            auto_ack=auto_ack,
        )

        logger.info(f"Started consuming from queue '{queue_name}'")
        self._channel.start_consuming()

    def get_message(self, queue_name: str) -> Optional[dict[str, Any]]:
        """Get a single message from a queue (polling)."""
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")

        method_frame, header_frame, body = self._channel.basic_get(queue=queue_name)

        if method_frame:
            try:
                message = json.loads(body.decode())
                self._channel.basic_ack(delivery_tag=method_frame.delivery_tag)
                return message
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                self._channel.basic_nack(
                    delivery_tag=method_frame.delivery_tag, requeue=False
                )
                return None

        return None

    def purge_queue(self, queue_name: str) -> int:
        """Purge all messages from a queue."""
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")

        result = self._channel.queue_purge(queue=queue_name)
        logger.info(
            f"Purged {result.method.message_count} messages from queue '{queue_name}'"
        )
        return result.method.message_count

    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.disconnect()
