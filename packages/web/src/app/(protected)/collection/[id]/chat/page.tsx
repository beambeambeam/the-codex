"use client";

import { ChatProvider } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatList from "@/app/(protected)/collection/[id]/chat/_components/chat-list";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";
import ChatHeader from "@/app/(protected)/collection/[id]/chat/_components/header";

function ChatContent() {
  const handleSubmit = (values: ChatFormSchemaType) => {
    console.log(values);
  };

  return (
    <div className="grid h-full grid-cols-[3fr_1fr]">
      <div className="relative h-full w-full">
        <ChatHeader title="Start a new Conversation" />
        <div className="h-full w-full">
          <ChatTemplate message={[]} />
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
