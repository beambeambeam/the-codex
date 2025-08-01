"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { useTextStream } from "@/components/ui/response-stream";
import { Scroller } from "@/components/ui/scroller";
import { components } from "@/lib/api/path";
import { cn } from "@/lib/utils";

interface ChatTemplateProps {
  message: components["schemas"]["CollectionChatHistoryResponse"][];
}

function ChatTemplate(props: ChatTemplateProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Find the latest AI message
  const latestAiMessage = props.message
    .filter((msg) => msg.role === "assistant")
    .pop();

  // Check if the latest AI message is very recent (within 10 seconds)
  const isMessageRecent = latestAiMessage?.created_at
    ? Date.now() - new Date(latestAiMessage.created_at).getTime() < 10000
    : false;

  const { displayedText, startStreaming } = useTextStream({
    textStream: latestAiMessage?.content || "",
    mode: "typewriter",
    speed: 50,
  });

  useEffect(() => {
    if (latestAiMessage && isMessageRecent) {
      startStreaming();
    }
  }, [latestAiMessage, isMessageRecent, startStreaming]);

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(messageId);
      setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  useEffect(() => {
    const node = scrollerRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [props.message.length]);

  return (
    <Scroller
      ref={scrollerRef}
      className="h-full max-h-[calc(100vh-300px)] px-8 pb-16"
      hideScrollbar
      withNavigation
    >
      <div className="flex flex-col gap-8">
        {props.message.map((msg) => {
          if (msg.role === "user") {
            return (
              <Message key={msg.id} className="justify-end">
                <MessageContent>{msg.content}</MessageContent>
              </Message>
            );
          }

          if (msg.role === "assistant") {
            return (
              <div key={msg.id} className="grid grid-cols-[2fr_1fr]">
                <Message className="justify-start">
                  <MessageAvatar src="/avatars/ai.png" alt="AI" fallback="AI" />
                  <div className="flex w-full flex-col gap-2">
                    <MessageContent
                      markdown
                      className="prose border bg-transparent p-4"
                    >
                      {msg.id === latestAiMessage?.id && isMessageRecent
                        ? displayedText
                        : msg.content}
                    </MessageContent>

                    <MessageActions className="self-start">
                      <MessageAction tooltip="Copy to clipboard">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleCopy(msg.content, msg.id)}
                        >
                          <CopyIcon
                            className={cn(
                              "size-4",
                              copied === msg.id && "text-green-500",
                            )}
                          />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  </div>
                </Message>
              </div>
            );
          }

          if (msg.role === "system") {
            return <Loader variant="typing" key={msg.id} />;
          }

          return null;
        })}
      </div>
    </Scroller>
  );
}

export default ChatTemplate;
