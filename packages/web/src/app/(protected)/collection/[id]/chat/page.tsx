"use client";

import { useState } from "react";

import { ChatProvider } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatList from "@/app/(protected)/collection/[id]/chat/_components/chat-list";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";
import ChatHeader from "@/app/(protected)/collection/[id]/chat/_components/header";
import { components } from "@/lib/api/path";

function ChatContent() {
  const [msg, setMsg] = useState<
    components["schemas"]["CollectionChatHistoryResponse"][]
  >([]);

  const handleSubmit = (values: ChatFormSchemaType) => {
    setMsg([
      {
        collection_chat_id: "",
        content: values.chat_message,
        created_at: new Date().toDateString(),
        created_by: "",
        id: "",
        role: "user",
      },
    ]);
  };

  return (
    <div className="grid h-full grid-cols-[3fr_1fr]">
      <div className="relative h-full w-full">
        <ChatHeader title="Start a new Conversation" />
        <div className="h-full w-full">
          <ChatTemplate message={msg} />
        </div>
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 absolute right-0 bottom-0 left-0 z-50 backdrop-blur">
          <div className="p-4">
            <ChatForm onSubmit={handleSubmit} suggest={true} />
          </div>
        </div>
      </div>
      <ChatList />
    </div>
  );
}

function ChatPage() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
}
export default ChatPage;
