"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HouseIcon, MessageCircleIcon, PanelsTopLeftIcon } from "lucide-react";

import { MOCK_CLUSTERING } from "@/app/(protected)/collection/[id]/__mock__/clustering";
import { ClusteringProvider } from "@/app/(protected)/collection/[id]/_components/clustering/context";
import CollectionIdHeader from "@/app/(protected)/collection/[id]/_components/header";
import CollectionIdSidebar from "@/app/(protected)/collection/[id]/_components/sidebar";
import { CollectionIdProvider } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getInitialTab(pathname: string) {
  if (pathname.endsWith("/chat")) return "tab-chat";
  if (pathname.endsWith("/docs")) return "tab-docs";
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
      <ClusteringProvider initialClusterings={[MOCK_CLUSTERING]}>
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
                    router.push(pathname.replace(/\/(chat|docs)$/, "") || "/");
                  } else if (value === "tab-chat") {
                    router.push(
                      pathname.endsWith("/chat")
                        ? pathname
                        : pathname.replace(/\/(docs)?$/, "") + "/chat",
                    );
                  } else if (value === "tab-docs") {
                    router.push(
                      pathname.endsWith("/docs")
                        ? pathname
                        : pathname.replace(/\/(chat)?$/, "") + "/docs",
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
                      value="tab-docs"
                      className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      <PanelsTopLeftIcon
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                      Docs
                    </TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </Tabs>
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ClusteringProvider>
    </CollectionIdProvider>
  );
}
