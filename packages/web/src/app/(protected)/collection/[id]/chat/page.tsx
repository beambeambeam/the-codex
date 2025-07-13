"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Markdown } from "@/components/ui/markdown";
import { useTextStream } from "@/components/ui/response-stream";

import { MOCK_CHAT } from "../__mock__/chat";

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState(MOCK_CHAT.history);
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
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: now,
      created_by: "0ea38322-4d8b-4a63-af9e-2dd31cf9db2e",
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputText("");

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `## Streaming Markdown

This response was streamed with *typewriter effect*.

- Here's a bullet
- And a \`code block\`

\`\`\`js
console.log("Hello, world!");
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

  return (
    <div className="bg-background flex h-[calc(100vh-8rem)] w-full flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">{MOCK_CHAT.title}</h1>
        <p className="text-muted-foreground text-sm">{MOCK_CHAT.description}</p>
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
  message: any;
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
            <Markdown className="prose prose-sm dark:prose-invert prose-h2:mt-0! prose-h2:scroll-m-0!">
              {displayedText}
            </Markdown>
          ) : (
            <Markdown className="prose prose-sm dark:prose-invert prose-h2:mt-0! prose-h2:scroll-m-0! text-sm">
              {message.content}
            </Markdown>
          )
        ) : (
          <p className="text-xs">{message.content}</p>
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
