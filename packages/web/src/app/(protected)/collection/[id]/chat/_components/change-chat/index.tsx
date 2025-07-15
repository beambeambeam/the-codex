import { ChevronRightIcon, DotIcon } from "lucide-react";

import { MOCK_CHAT_COLLECTION } from "@/app/(protected)/collection/[id]/__mock__/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scroller } from "@/components/ui/scroller";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChangeChatSheetProps {
  title: string;
}

function ChangeChatSheet(props: ChangeChatSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-0">
          <h1 className="text-xl font-bold">{props.title}</h1>
          <ChevronRightIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[17.5rem]">
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          <SheetDescription>
            There are no description yet, Start and it this will be generated
          </SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100%-50px)] px-4">
          <p className="text-foreground/60 text-sm font-bold">Recents</p>
          <Scroller hideScrollbar className="flex flex-col gap-2">
            {[...MOCK_CHAT_COLLECTION]
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime(),
              )
              .map((chat) => (
                <div
                  key={chat.id}
                  className="hover:bg-muted inline-flex w-full cursor-pointer items-center rounded p-2 shadow-none transition-colors"
                >
                  <span className="block w-full truncate">{chat.title}</span>
                </div>
              ))}
          </Scroller>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default ChangeChatSheet;
