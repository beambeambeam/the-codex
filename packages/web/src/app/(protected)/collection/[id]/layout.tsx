"use client";

import { MOCK_CLUSTERING } from "@/app/(protected)/collection/[id]/__mock__/clustering";
import { ClusteringProvider } from "@/app/(protected)/collection/[id]/_components/clustering/context";
import CollectionIdHeader from "@/app/(protected)/collection/[id]/_components/header";
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
      <ClusteringProvider initialClusterings={[MOCK_CLUSTERING]}>
        <SidebarProvider>
          <CollectionIdSidebar />
          <SidebarInset>
            <main className="flex h-full shrink-0 flex-col items-start justify-start px-3 pt-3">
              <CollectionIdHeader />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ClusteringProvider>
    </CollectionIdProvider>
  );
}
