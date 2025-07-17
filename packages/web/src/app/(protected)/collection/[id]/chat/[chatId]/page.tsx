"use client";

import { ClockFadingIcon } from "lucide-react";

import { MOCK_CHAT_HISTORY } from "@/app/(protected)/collection/[id]/__mock__/chat";
import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";
import { Pill, PillIcon } from "@/components/ui/pill";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";

function CollectionIdPage() {
  return (
    <>
      <div className="h-full w-full">
        <header className="relative z-20 mb-4 flex items-center justify-between border-b p-3">
          <div className="flex h-full w-full flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-lg">{MOCK_CHAT_HISTORY.title}</h1>
              <Pill>
                <PillIcon icon={ClockFadingIcon} />
                <RelativeTimeCard date={MOCK_CHAT_HISTORY.updated_at} />
              </Pill>
            </div>
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
