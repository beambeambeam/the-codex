"use client";

import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MOCK_CHAT } from "../__mock__/chat";

export default function ChatPage() {
  return (
    <div className="bg-background flex h-[calc(100vh-6rem)] flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">{MOCK_CHAT.title}</h1>
        <p className="text-muted-foreground text-sm">{MOCK_CHAT.description}</p>
      </header>
      <main className="flex-1 space-y-4 overflow-y-auto p-4">
        {MOCK_CHAT.history.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
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
              <p className="text-sm">{message.content}</p>
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </main>
      <footer className="border-t p-4">
        <div className="relative">
          <Input placeholder="Type your message..." className="pr-12 w-1/2  " />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
