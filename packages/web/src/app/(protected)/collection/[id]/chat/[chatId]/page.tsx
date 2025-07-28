"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatTemplate from "@/app/(protected)/collection/[id]/chat/_components/chat-template";
import ChatHeader from "@/app/(protected)/collection/[id]/chat/_components/header";
import ChatIdPageSkeleton from "@/app/(protected)/collection/[id]/chat/[chatId]/skeleton";
import { Button } from "@/components/ui/button";
import { $api } from "@/lib/api/client";

function ChatIdPage() {
  const params = useParams<{ id: string; chatId: string }>();

  const { data, isPending, isError } = $api.useQuery(
    "get",
    "/chats/{chat_id}",
    {
      params: {
        path: {
          chat_id: params.chatId,
        },
      },
    },
  );

  if (isPending) {
    return <ChatIdPageSkeleton />;
  }

  if (!data || isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-10">
        <div className="text-destructive mb-2 text-2xl font-semibold">
          Something went wrong
        </div>
        <div className="text-muted-foreground mb-6">
          We couldn&apos;t load this chat. Please try again later.
        </div>
        <Link href={`/collection/${params.id}/chat`}>
          <Button type="button" variant="outline">
            Start a New conversation
          </Button>
        </Link>
      </div>
    );
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
export default ChatIdPage;
