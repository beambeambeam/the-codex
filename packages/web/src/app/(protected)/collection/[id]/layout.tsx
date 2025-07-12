"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HouseIcon, MessageCircleIcon, PanelsTopLeftIcon } from "lucide-react";

import CollectionIdHeader from "@/app/(protected)/collection/[id]/_components/header";
import CollectionIdSidebar from "@/app/(protected)/collection/[id]/_components/sidebar";
import { CollectionIdProvider } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getInitialTab(pathname: string) {
  if (pathname.endsWith("/chat")) return "tab-chat";
  if (pathname.endsWith("/documents")) return "tab-documents";
  return "tab-overview";
}

export default function CollectionIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [tab, setTab] = useState(() => getInitialTab(pathname));
  const router = useRouter();

  return (
    <CollectionIdProvider
      initialTitle="LLM with SQL."
      initialDescription="Large Language Models (LLMs)—like ChatGPT, GPT-4, Claude, or others—in combination with Structured Query Language (SQL)."
    >
      <SidebarProvider>
        <CollectionIdSidebar />
        <SidebarInset>
          <main className="flex h-full shrink-0 flex-col items-start justify-start px-3 pt-3">
            <CollectionIdHeader />
            <Tabs
              defaultValue="tab-overview"
              value={tab}
              onValueChange={(value: string) => {
                if (value === "tab-overview") {
                  router.push(
                    pathname.replace(/\/(chat|documents)$/, "") || "/",
                  );
                } else if (value === "tab-chat") {
                  router.push(
                    pathname.endsWith("/chat")
                      ? pathname
                      : pathname.replace(/\/(documents)?$/, "") + "/chat",
                  );
                } else if (value === "tab-documents") {
                  router.push(
                    pathname.endsWith("/documents")
                      ? pathname
                      : pathname.replace(/\/(chat)?$/, "") + "/documents",
                  );
                }
                setTab(value);
              }}
            >
              <ScrollArea>
                <TabsList className="before:bg-border relative h-auto w-full justify-start gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                  <TabsTrigger
                    value="tab-overview"
                    className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                  >
                    <HouseIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab-chat"
                    className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                  >
                    <MessageCircleIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab-documents"
                    className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                  >
                    <PanelsTopLeftIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Documents
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </CollectionIdProvider>
  );
}
