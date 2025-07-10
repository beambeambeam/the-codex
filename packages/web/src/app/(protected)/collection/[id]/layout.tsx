"use client";

import CollectionIdSidebar from "@/app/(protected)/collection/[id]/_components/sidebar";
import { CollectionIdProvider } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CollectionIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CollectionIdProvider
      initialTitle="LLM with SQL."
      initialDescription="Large Language Models (LLMs)—like ChatGPT, GPT-4, Claude, or others—in combination with Structured Query Language (SQL)."
    >
      <SidebarProvider>
        <CollectionIdSidebar />
        <SidebarInset>
          <main className="flex h-full shrink-0 items-start justify-start gap-2 p-3">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </CollectionIdProvider>
  );
}
