"use client";

import { useParams } from "next/navigation";
import { ClockFadingIcon } from "lucide-react";

import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";
import ChatHeader from "@/app/(protected)/collection/[id]/chat/_components/header";
import { $api } from "@/lib/api/client";

function CollectionIdPage() {
  const params = useParams<{ id: string; chatId: string }>();

  const { data, isPending, isError } = $api.useQuery(
    "get",
    "/chats/{chat_id}",
    {
      params: {
        path: {
          chat_id: "",
        },
      },
    },
  );

  if (isPending) {
    return null;
  }

  if (!data || isError) {
    return null;
  }

  return (
    <>
      <div className="h-full w-full">
        <ChatHeader title={""} />
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
          suggest={false}
        />
      </div>
    </>
  );
}
export default CollectionIdPage;
