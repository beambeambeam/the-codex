"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import ChatForm, {
  ChatFormSchemaType,
} from "@/app/(protected)/collection/[id]/chat/_components/chat-form";
import ChatList from "@/app/(protected)/collection/[id]/chat/_components/chat-list";
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

  const { mutate, isPending: isPendingMutate } = $api.useMutation(
    "post",
    "/agentic/rag_query",
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

  const handleSubmit = (values: ChatFormSchemaType) => {
    mutate({
      params: {
        query: {
          chat_id: params.chatId,
        },
      },
      body: {
        user_question: values.chat_message,
        reference: values.reference.length > 0 ? values.reference : undefined,
      },
    });
  };

  return (
    <div className="grid h-full grid-cols-[3fr_1fr]">
      <div className="relative h-full w-full">
        <ChatHeader
          title={data.title}
          by={data.created_by ?? undefined}
          date={new Date(data.updated_at)}
        />
        <div className="w-full px-8">
          <ChatTemplate message={data.histories ?? []} />
        </div>
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 absolute right-0 bottom-0 left-0 z-50 backdrop-blur">
          <div className="p-4 px-12">
            <ChatForm onSubmit={handleSubmit} disabled={isPendingMutate} />
          </div>
        </div>
      </div>
      <ChatList />
    </div>
  );
}
export default ChatIdPage;
