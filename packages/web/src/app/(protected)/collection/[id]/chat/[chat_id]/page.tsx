"use client";

import { MOCK_CHAT_HISTORY } from "@/app/(protected)/collection/[id]/__mock__/chat";
import CollectionIdTabs from "@/app/(protected)/collection/[id]/_components/tabs";
import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";

function CollectionIdPage() {
  return (
    <>
      <CollectionIdTabs tab="tab-chat" />
      <div className="bg-background flex h-full w-full flex-col border-l">
        <div className="h-full w-full">
          <header className="relative z-20 mb-4 border-b p-4">
            {MOCK_CHAT_HISTORY.title}
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
      </div>
    </>
  );
}
export default CollectionIdPage;
