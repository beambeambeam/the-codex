"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ChatProvider } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatList from "@/app/(protected)/collection/[id]/chat/_components/chat-list";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";
import ChatHeader from "@/app/(protected)/collection/[id]/chat/_components/header";
import { $api } from "@/lib/api/client";

interface ChatMessage {
  collection_chat_id: string;
  content: string;
  created_at: string;
  created_by: string;
  id: string;
  role: "user" | "assistant" | "system";
}

function ChatContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [msg, setMsg] = useState<ChatMessage[]>([]);

  const { mutate: createChatWithRag, isPending: isCreating } = $api.useMutation(
    "post",
    "/chats/",
    {
      onSuccess: (data) => {
        router.push(`/collection/${data.collection_id}/chat/${data.id}`);
      },
      onError: (error: unknown) => {
        const message =
          typeof error === "object" && error !== null && "detail" in error
            ? (error as { detail?: string }).detail
            : undefined;
        toast.error(
          message || "Failed to create collection chat. Please try again.",
        );
      },
    },
  );

  const handleSubmit = (values: ChatFormSchemaType) => {
    setMsg([
      {
        collection_chat_id: "user queue",
        content: values.chat_message,
        created_at: new Date().toDateString(),
        created_by: "",
        id: "",
        role: "user",
      },
      {
        collection_chat_id: "typing",
        content: "",
        created_at: new Date().toDateString(),
        created_by: "",
        id: "",
        role: "system",
      },
    ]);
    createChatWithRag({
      body: {
        collection_id: params.id,
        title:
          values.chat_message.length > 50
            ? values.chat_message.slice(0, 50) + "..."
            : values.chat_message,
        description:
          values.chat_message.length > 100
            ? values.chat_message.slice(0, 100) + "..."
            : values.chat_message,
        message: values.chat_message,
        reference: values.reference,
      },
    });
  };

  return (
    <div className="grid h-full grid-cols-[3fr_1fr]">
      <div className="relative h-full w-full">
        <ChatHeader title="Start a new Conversation" />
        <div className="w-full px-8">
          <ChatTemplate message={msg} />
        </div>
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 absolute right-0 bottom-0 left-0 z-50 backdrop-blur">
          <div className="p-4 px-12">
            <ChatForm
              onSubmit={handleSubmit}
              suggest={true}
              disabled={isCreating}
            />
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
