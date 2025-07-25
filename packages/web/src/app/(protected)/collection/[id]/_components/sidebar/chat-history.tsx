import Link from "next/link";
import { useParams } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { Scroller } from "@/components/ui/scroller";

function ChatHistorySidebar() {
  const params = useParams<{ id: string; chatId: string }>();

  return (
    <div className="h-full">
      <Link
        className="hover:bg-muted mb-4 flex items-center gap-2 rounded-l-2xl rounded-r p-1 transition-colors"
        href={`/collection/${params.id}/chat/`}
      >
        <div className="flex h-fit w-fit items-center justify-center rounded-full bg-red-500 p-2 transition-colors hover:bg-red-600">
          <PlusIcon className="size-3" />
        </div>
        <span className="text-base">New Chat</span>
      </Link>

      <p className="text-foreground/60 pb-2 text-sm font-bold">Recents</p>
      <Scroller hideScrollbar className="flex h-full flex-col gap-2">
        {/* {[]
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          )
          .map((chat) => {
            const isActive = params.chatId === chat.id;

            return (
              <Link
                href={`/collection/${params.id}/chat/${chat.id}`}
                key={`/chat/${chat.id}`}
              >
                <div
                  className={`hover:bg-muted inline-flex w-full cursor-pointer items-center rounded border border-dashed p-2 py-1.5 shadow-none transition-colors ${
                    isActive ? "bg-muted border border-solid" : ""
                  }`}
                >
                  <span className="block w-full truncate text-base">
                    {chat.title}
                  </span>
                </div>
              </Link>
            );
          })} */}
      </Scroller>
    </div>
  );
}
export default ChatHistorySidebar;
