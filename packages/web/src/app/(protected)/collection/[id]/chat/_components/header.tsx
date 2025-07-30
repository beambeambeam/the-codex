"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckIcon, ChevronsUpDownIcon, ClockFadingIcon } from "lucide-react";

import { useChatContext } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Pill, PillAvatar, PillIcon } from "@/components/ui/pill";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { cn, getFallbackUsername } from "@/lib/utils";

interface ChatHeaderProps {
  chatId?: string;
  title: string;
  date?: Date;
  by?: string;
}

function ChatHeader(props: ChatHeaderProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { chats, isLoading } = useChatContext();

  return (
    <header className="relative z-20 border-b p-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="group w-full max-w-full cursor-pointer justify-between">
            <div className="grid w-full grid-cols-1 items-center gap-2 p-1 sm:grid-cols-[auto_auto_1fr]">
              <div className="flex min-w-0 gap-2">
                <h1 className="group-hover:text-accent-foreground text-foreground inline-flex w-full items-center gap-2 text-lg text-wrap transition-colors">
                  {props.title}
                  <ChevronsUpDownIcon className="shrink-0 opacity-50" />
                </h1>
              </div>
              <Pill className="h-fit">
                <PillIcon icon={ClockFadingIcon} />
                <RelativeTimeCard date={new Date()} />
              </Pill>
              {props.by && (
                <Pill>
                  <PillAvatar fallback={getFallbackUsername(props.by)} />
                  {props.by}
                </Pill>
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="left-0 w-sm p-0" align="start">
          <Command>
            <CommandInput placeholder="Search chat..." />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Chat is loading...</CommandEmpty>
              ) : (
                <CommandEmpty>
                  No chat found, Try to start conversation!
                </CommandEmpty>
              )}
              <CommandGroup>
                {[...chats]
                  .sort(
                    (a, b) =>
                      new Date(b.updated_at).getTime() -
                      new Date(a.updated_at).getTime(),
                  )
                  .map((c) => (
                    <CommandItem
                      key={c.id}
                      value={c.id}
                      onSelect={() => {
                        router.push(
                          `/collection/${c.collection_id}/chat/${c.id}`,
                        );
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          props.chatId === c.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {c.title}
                      {c.description ?? "No chat description yet!"}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </header>
  );
}
export default ChatHeader;
