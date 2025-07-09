import Link from "next/link";
import { HomeIcon, UserIcon } from "lucide-react";

import CollectionIdSidebar from "@/app/(protected)/collection/[id]/_components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function CollectionIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const imageUrl = "";
  const name = "";

  return (
    <div className="flex h-screen w-full shrink-0 border-l">
      <div className="flex w-[70px] flex-col items-center gap-6 border-r px-5 py-4">
        <Avatar className="size-8">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <Separator />
        <Link href="/home">
          <HomeIcon className="size-6" />
        </Link>
      </div>
      <div className="flex">
        <CollectionIdSidebar
          title={"LLM with SQL."}
          description={
            "Large Language Models (LLMs)—like ChatGPT, GPT-4, Claude, or others—in combination with Structured Query Language (SQL)."
          }
        />
        <main className="flex h-full shrink-0 items-start justify-start gap-2 p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
