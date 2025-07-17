"use client";

import { MOCK_CHAT_HISTORY } from "@/app/(protected)/collection/[id]/__mock__/chat";
import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";

function CollectionIdPage() {
  return (
    <>
      <div className="h-full w-full">
        <header className="relative z-20 mb-4 flex items-center justify-between border-b p-4">
          <div className="h-full w-full">
            <h1 className="text-xl">{MOCK_CHAT_HISTORY.title}</h1>
            <p className="text-muted-foreground text-base">
              {MOCK_CHAT_HISTORY.description}
            </p>
          </div>
        </header>
        <ChatTemplate message={MOCK_CHAT_HISTORY.history} />
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
          suggest={false}
        />
      </div>
    </>
  );
}
export default CollectionIdPage;
