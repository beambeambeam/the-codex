import Link from "next/link";

import { MOCK_CHAT_COLLECTION } from "@/app/(protected)/collection/[id]/__mock__/chat";
import { Scroller } from "@/components/ui/scroller";

function ChatHistorySidebar() {
  return (
    <div className="h-full">
      <p className="text-foreground/60 pb-2 text-sm font-bold">Recents</p>
      <Scroller hideScrollbar className="flex h-full flex-col gap-2">
        {[...MOCK_CHAT_COLLECTION]
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          )
          .map((chat) => (
            <Link href={`chat/${chat.id}`} key={`/chat/${chat.id}`}>
              <div
                key={chat.id}
                className="hover:bg-muted inline-flex w-full cursor-pointer items-center rounded p-2 py-1 shadow-none transition-colors"
              >
                <span className="block w-full truncate">{chat.title}</span>
              </div>
            </Link>
          ))}
      </Scroller>
    </div>
  );
}
export default ChatHistorySidebar;
