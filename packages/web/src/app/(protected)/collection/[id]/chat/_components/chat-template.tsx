"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Scroller } from "@/components/ui/scroller";

interface ChatTemplateProps {
  message: {
    role: string;
    content: string;
    id: string;
    collection_chat_id: string;
    created_at: string;
    created_by: string;
  }[];
}

function ChatTemplate(props: ChatTemplateProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

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
      className="h-full max-h-[calc(100vh-380px)] px-8"
      hideScrollbar
      withNavigation
    >
      <div className="flex flex-col gap-8">
        {props.message.map((msg, index) =>
          msg.role === "user" ? (
            <Message key={msg.id} className="justify-end">
              <MessageContent>{msg.content}</MessageContent>
            </Message>
          ) : (
            <div key={msg.id} className="grid grid-cols-[2fr_1fr]">
              <Message className="justify-start">
                <MessageAvatar src="/avatars/ai.png" alt="AI" fallback="AI" />
                <div className="flex w-full flex-col gap-2">
                  <MessageContent
                    markdown
                    className="prose border bg-transparent p-4"
                  >
                    {msg.content}
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
                          className={`size-4 ${copied === msg.id ? "text-green-500" : ""}`}
                        />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                </div>
              </Message>
            </div>
          ),
        )}
      </div>
    </Scroller>
  );
}

export default ChatTemplate;
