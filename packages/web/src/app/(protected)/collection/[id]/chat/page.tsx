"use client";

import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";

function ChatPage() {
  return (
    <>
      <div className="h-full w-full">
        <header className="relative z-20 border-b p-4">
          Start New Conversation
        </header>
        <ChatTemplate message={[]} />
      </div>
      <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-1 flex-col justify-end p-10">
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
export default ChatPage;
