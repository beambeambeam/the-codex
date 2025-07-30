import { useChatContext } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import { Skeleton } from "@/components/ui/skeleton";

function ChatList() {
  const { chats, isError, isLoading } = useChatContext();

  return (
    <div className="h-full w-full border-l">
      <div className="relative z-20 flex h-14 items-center justify-center gap-2 border-b p-2">
        <h1 className="group-hover:text-accent-foreground text-foreground text-md inline-flex w-full items-center gap-2 font-bold text-wrap transition-colors">
          Other Chats
        </h1>
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
              className="hover:bg-accent cursor-pointer rounded-md px-3 py-2 transition-colors"
            >
              <div className="font-medium">{chat.title || "Untitled Chat"}</div>
              <div className="text-muted-foreground truncate text-xs">
                {chat.title || "No messages yet."}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default ChatList;
