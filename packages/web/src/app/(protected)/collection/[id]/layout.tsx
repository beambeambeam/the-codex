"use client";

import React from "react";
import { useParams } from "next/navigation";
import { EventSourceProvider } from "react-sse-hooks";

import { ClusteringProvider } from "@/app/(protected)/collection/[id]/_components/clustering/context";
import CollectionIdHeader from "@/app/(protected)/collection/[id]/_components/header";
import CollectionIdSidebar from "@/app/(protected)/collection/[id]/_components/sidebar";
import { CollectionIdProvider } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { ChatProvider } from "@/app/(protected)/collection/[id]/chat/_components/chat-context";
import CollectionIdSkeleton from "@/app/(protected)/collection/[id]/skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { $api } from "@/lib/api/client";

export default function CollectionIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id: string }>();

  const { isPending, isError, data } = $api.useQuery(
    "get",
    "/collections/{collection_id}",
    {
      params: {
        path: {
          collection_id: params.id,
        },
      },
    },
  );

  if (isPending) {
    return <CollectionIdSkeleton />;
  }

  if (!data || isError) {
    if (typeof window !== "undefined") {
      window.location.replace("/404");
      return null;
    }
  }

  return (
    <EventSourceProvider>
      <CollectionIdProvider
        initialTitle={data?.name}
        initialDescription={data?.description ?? ""}
      >
        <ClusteringProvider collectionId={params.id}>
          <ChatProvider>
            <SidebarProvider>
              <CollectionIdSidebar />
              <SidebarInset>
                <main className="flex h-full shrink-0 flex-col items-start justify-start px-3 pt-3">
                  <CollectionIdHeader />
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </ChatProvider>
        </ClusteringProvider>
      </CollectionIdProvider>
    </EventSourceProvider>
  );
}
