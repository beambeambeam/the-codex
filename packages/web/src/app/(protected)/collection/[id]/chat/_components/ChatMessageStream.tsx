import { useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { Markdown } from "@/components/ui/markdown";
import { useTextStream } from "@/components/ui/response-stream";
import type { ChatMessage } from "@/types";

interface ChatMessageProps {
  message: ChatMessage;
  chatRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isStreaming: boolean;
}

export function ChatMessageStream({
  message,
  chatRef,
  isLoading,
  isStreaming,
}: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const shouldStream = isAssistant && isStreaming;

  const { displayedText, startStreaming } = useTextStream({
    textStream: message.content,
    mode: "typewriter",
    speed: 50,
  });

  // Start streaming effect when isStreaming is true
  useEffect(() => {
    if (shouldStream) startStreaming();
  }, [startStreaming, shouldStream]);

  // Scroll to bottom whenever streaming text updates
  useEffect(() => {
    if (shouldStream && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [displayedText, shouldStream, chatRef]);

  return (
    <div
      className={`flex items-start gap-4 ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/static/logo/icon.svg" alt="Assistant" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {isLoading ? (
          <Loader variant="text-shimmer" text="Fetching Documents..." />
        ) : isAssistant ? (
          shouldStream ? (
            <Markdown className="prose">{displayedText}</Markdown>
          ) : (
            <Markdown className="prose">{message.content}</Markdown>
          )
        ) : (
          <Markdown className="text-xs">{message.content}</Markdown>
        )}
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
