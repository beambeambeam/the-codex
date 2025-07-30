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
      <div className="h-full w-full">
        <ChatHeader title="Start a new Conversation" />
        <ChatTemplate message={[]} />
        <ChatForm onSubmit={handleSubmit} suggest={true} />
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
