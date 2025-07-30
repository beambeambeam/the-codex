"use client";

import { ClockFadingIcon } from "lucide-react";

import { Pill, PillAvatar, PillIcon } from "@/components/ui/pill";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { getFallbackUsername } from "@/lib/utils";

interface ChatHeaderProps {
  chatId?: string;
  title: string;
  date?: Date;
  by?: string;
}

function ChatHeader(props: ChatHeaderProps) {
  return (
    <header className="relative z-20 mb-2 h-14 border-b p-2">
      <div className="group w-full max-w-full cursor-pointer justify-between">
        <div className="grid w-full grid-cols-1 items-center gap-2 p-1 sm:grid-cols-[auto_auto_1fr]">
          <div className="flex min-w-0 gap-2">
            <h1 className="group-hover:text-accent-foreground text-foreground text-md inline-flex w-full items-center gap-2 font-bold text-wrap transition-colors">
              {props.title}
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
    </header>
  );
}
export default ChatHeader;
