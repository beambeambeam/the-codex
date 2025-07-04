import { useCallback, useEffect, useRef, useState } from "react";

import { env } from "@/env";

export interface SSEMessage {
  event: string;
  data: unknown;
  id?: string;
}

export interface UseSSEOptions {
  channels?: string[];
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface UseSSEReturn {
  messages: SSEMessage[];
  connectionState: "connecting" | "connected" | "disconnected" | "error";
  lastMessage: SSEMessage | null;
  error: string | null;
  reconnect: () => void;
  clearMessages: () => void;
}

export function useSSE(options: UseSSEOptions = {}): UseSSEReturn {
  const url = `${env.NEXT_PUBLIC_API_URL}/sse/events`;
  const {
    channels = [],
    autoReconnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
  } = options;

  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<SSEMessage | null>(null);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const buildUrl = useCallback(() => {
    const baseUrl = url;
    if (channels.length > 0) {
      const channelsParam = channels.join(",");
      const separator = baseUrl.includes("?") ? "&" : "?";
      return `${baseUrl}${separator}channels=${encodeURIComponent(channelsParam)}`;
    }
    return baseUrl;
  }, [url, channels]);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionState("connecting");
    setError(null);

    try {
      const eventSource = new EventSource(buildUrl(), {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        console.log("SSE connection opened");
        setConnectionState("connected");
        reconnectAttemptsRef.current = 0;
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const message: SSEMessage = {
            event: event.type || "message",
            data,
            id: event.lastEventId,
          };

          setLastMessage(message);
          setMessages((prev) => [...prev, message]);
        } catch (err) {
          console.error("Error parsing SSE message:", err);
        }
      };

      eventSource.onerror = (event) => {
        console.error("SSE connection error:", event);
        setConnectionState("error");
        setError("Connection error occurred");

        if (
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
              connect();
            }
          }, reconnectInterval);
        } else {
          setConnectionState("disconnected");
          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setError(
              `Max reconnection attempts (${maxReconnectAttempts}) reached`,
            );
          }
        }
      };

      const handleCustomEvent = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const message: SSEMessage = {
            event: event.type,
            data,
            id: event.lastEventId,
          };

          setLastMessage(message);
          setMessages((prev) => [...prev, message]);
        } catch (err) {
          console.error("Error parsing custom SSE event:", err);
        }
      };

      [
        "chat_notifications",
        "system_events",
        "document_processing",
        "collection_processing",
        "heartbeat",
      ].forEach((eventType) => {
        eventSource.addEventListener(eventType, handleCustomEvent);
      });

      eventSourceRef.current = eventSource;
    } catch (err) {
      console.error("Error creating EventSource:", err);
      setConnectionState("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [buildUrl, autoReconnect, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setConnectionState("disconnected");
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    messages,
    connectionState,
    lastMessage,
    error,
    reconnect,
    clearMessages,
  };
}
