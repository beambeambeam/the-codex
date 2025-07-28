"use client";

import {
  ChatProvider,
  useChatContext,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";
import ChatHeader from "@/app/(protected)/collection/[id]/chat/_components/header";

function ChatContent() {
  const { isLoading, isError } = useChatContext();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading chats...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        Failed to load chats.
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full">
        <ChatHeader title="Start a new Conversation" />
        <ChatTemplate message={[]} />
      </div>
      <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-1 flex-col justify-end p-10 lg:mx-20">
        <ChatForm
          onSubmit={function (
            values: ChatFormSchemaType,
          ): void | Promise<void> {
            throw new Error("Function not implemented.");
          }}
          defaultValues={{
            chat_message: "",
          }}
          suggest={true}
        />
      </div>
    </>
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
