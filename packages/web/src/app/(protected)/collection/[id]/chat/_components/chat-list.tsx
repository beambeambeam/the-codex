"use client";

import { useParams, useRouter } from "next/navigation";

import { useChatContext } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import { Pill, PillAvatar } from "@/components/ui/pill";
import { Skeleton } from "@/components/ui/skeleton";
import { getFallbackUsername } from "@/lib/utils";

function ChatList() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { chats, isError, isLoading } = useChatContext();

  return (
    <div className="h-full w-full border-l">
      <div className="relative z-20 flex h-[3.7rem] items-center justify-center gap-2 border-b p-2">
        <h1 className="group-hover:text-accent-foreground text-foreground text-md inline-flex w-full items-center gap-2 font-bold text-wrap transition-colors">
          Other Chats
        </h1>
      </div>

      <div className="w-full p-4">
        <li
          onClick={() => router.push(`/collection/${params.id}/chat`)}
          className="hover:bg-accent border-primary/40 flex cursor-pointer flex-col gap-1 rounded-md border border-dashed px-3 py-2 transition-colors"
        >
          <div className="text-primary font-medium">+ Create New Chat</div>
        </li>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2 p-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-destructive w-full p-4 text-center">
          Failed to load chats. Please try again.
        </div>
      )}

      {!isLoading && !isError && chats.length === 0 && (
        <div className="text-muted-foreground w-full p-4 text-center">
          No chats found. Start a new conversation to begin chatting.
        </div>
      )}

      {!isLoading && !isError && chats.length > 0 && (
        <ul className="flex flex-col gap-2 p-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="hover:bg-accent flex cursor-pointer flex-col gap-1 rounded-md border px-3 py-2 transition-colors"
              onClick={() =>
                router.push(`/collection/${params.id}/chat/${chat.id}`)
              }
            >
              <div className="font-medium">{chat.title || "Untitled Chat"}</div>
              {chat.created_by && (
                <Pill>
                  <PillAvatar fallback={getFallbackUsername(chat.created_by)} />
                  {chat.created_by}
                </Pill>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default ChatList;
