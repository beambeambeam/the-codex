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
      initialTitle="Attension is All you need"
      initialDescription="A seminal paper introducing the Transformer architecture, which relies entirely on attention mechanisms to draw global dependencies between input and output, revolutionizing natural language processing and sequence modeling."
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
