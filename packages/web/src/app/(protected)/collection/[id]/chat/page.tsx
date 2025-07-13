"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Markdown } from "@/components/ui/markdown";
import { useTextStream } from "@/components/ui/response-stream";

import { MOCK_CHAT_COLLECTION, MOCK_CHAT_HISTORY } from "../__mock__/chat";
import type { ChatCollection, ChatMessage } from "./types";

export default function ChatPage() {
  // const params = useParams();
  const params = { id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d" }; // Mocking useParams for demonstration
  const { id } = params;

  const chatData: ChatCollection | undefined = useMemo(() => {
    const data = MOCK_CHAT_COLLECTION.find((chat) => chat.id === id);
    if (!data) return undefined;
    if (data.id === MOCK_CHAT_HISTORY.id) {
      return { ...data, history: MOCK_CHAT_HISTORY.history };
    }
    return { ...data, history: [] };
  }, [id]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
    chatData?.history ?? [],
  );
  const [inputText, setInputText] = useState("");
  const chatRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: now,
      created_by: "0ea38322-4d8b-4a63-af9e-2dd31cf9db2e",
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputText("");

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `
# Markdown Example

This is a **bold text** and this is an *italic text*.

## Lists

### Unordered List
- Item 1
- Item 2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[Visit Prompt Kit](https://prompt-kit.com)

## Code

Inline \`code\` example.

\`\`\`javascript
// Code block example
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
`,
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: now,
      created_by: "0ea38322-4d8b-4a63-af9e-2dd31cf9db2e",
      stream: true,
    };

    setChatHistory((prev) => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chatData) {
    return <div>Chat not found</div>;
  }

  return (
    <div className="bg-background flex h-[calc(100vh-8rem)] w-full flex-col">
      <header className="border-b p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-0">
              <h1 className="text-xl font-bold">{chatData.title}</h1>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="p-2">
              <p className="font-bold">{chatData.title}</p>
              <p className="text-muted-foreground text-sm">
                {chatData.description}
              </p>
              <div className="text-muted-foreground mt-2 text-xs">
                <p>Updated by: {chatData.updated_by}</p>
                <p>
                  Updated at:{" "}
                  {formatDistanceToNow(new Date(chatData.updated_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="my-2 border-t" />
            <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
              Other Chats
            </div>
            {MOCK_CHAT_COLLECTION.filter((c) => c.id !== chatData.id).map(
              (chat) => (
                <DropdownMenuItem
                  key={chat.id}
                  onClick={() => {
                    window.location.href = `/collection/${chat.collection_id}/chat/${chat.id}`; // หรือใช้ router.push ถ้า next/router
                  }}
                >
                  {chat.title}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main ref={chatRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {chatHistory.map((message) => (
          <ChatMessage key={message.id} message={message} chatRef={chatRef} />
        ))}
      </main>

      <footer className="flex w-full justify-center p-6">
        <div className="relative w-1/2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="rounded-3xl pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-0 -translate-y-1/2 rounded-3xl"
            onClick={handleSend}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

// Component to render each message
function ChatMessage({
  message,
  chatRef,
}: {
  message: ChatMessage;
  chatRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isAssistant = message.role === "assistant";
  const shouldStream = isAssistant && message.stream;

  const { displayedText, startStreaming } = useTextStream({
    textStream: message.content,
    mode: "typewriter",
    speed: 50,
  });

  // Start streaming effect when assistant message with stream:true arrives
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
        {isAssistant ? (
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
