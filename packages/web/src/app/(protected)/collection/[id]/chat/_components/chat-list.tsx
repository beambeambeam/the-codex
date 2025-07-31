"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUpRightFromCircleIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";

import { useChatContext } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import useRemoveChat from "@/app/(protected)/collection/[id]/chat/_lib/use-remove-chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pill, PillAvatar } from "@/components/ui/pill";
import { Scroller } from "@/components/ui/scroller";
import { Skeleton } from "@/components/ui/skeleton";
import { getFallbackUsername } from "@/lib/utils";

function ChatList() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { chats, isError, isLoading } = useChatContext();
  const { remove, isPending } = useRemoveChat();

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

      <Scroller className="h-[calc(100vh-300px)]" hideScrollbar withNavigation>
        {!isLoading && !isError && chats.length > 0 && (
          <ul className="flex flex-col gap-2 p-4">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className="flex cursor-pointer flex-col gap-1 rounded-md border transition-colors"
              >
                <div className="divide-accent grid grid-cols-[1fr_auto] divide-x-2 divide-dashed">
                  <div className="hover:bg-accent flex flex-col gap-2 px-3 py-2">
                    <div className="font-medium">
                      {chat.title || "Untitled Chat"}
                    </div>
                    {chat.created_by && (
                      <Pill>
                        <PillAvatar
                          fallback={getFallbackUsername(chat.created_by)}
                        />
                        {chat.created_by}
                      </Pill>
                    )}
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-full w-full items-center justify-center px-3"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Manage this Chat.</DropdownMenuLabel>
                        <Link href={`/collection/${params.id}/chat/${chat.id}`}>
                          <DropdownMenuItem>
                            <ArrowUpRightFromCircleIcon className="text-foreground" />
                            Checkout
                          </DropdownMenuItem>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              disabled={isPending}
                              variant="destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <TrashIcon />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your chat and remove all
                                conversation history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  remove({
                                    params: { path: { chat_id: chat.id } },
                                  })
                                }
                                disabled={isPending}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Scroller>
    </div>
  );
}
export default ChatList;
