"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FilePlus2Icon } from "lucide-react";

import ClusteringTree from "@/app/(protected)/collection/[id]/_components/clustering/tree";
import ChatHistorySidebar from "@/app/(protected)/collection/[id]/_components/sidebar/chat-history";
import CollectionIdSidebarSearchbox from "@/app/(protected)/collection/[id]/_components/sidebar/search";
import CollectionIdSidebarSettings from "@/app/(protected)/collection/[id]/_components/sidebar/settings";
import { useCollectionIdContext } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarGroup } from "@/components/ui/sidebar";

function CollectionIdSidebar() {
  const context = useCollectionIdContext();
  const pathname = usePathname();

  const params = useParams<{ id: string }>();

  return (
    <Sidebar>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-4 group-data-[collapsible=icon]:overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{context.title}</h1>
          <CollectionIdSidebarSettings />
        </div>
        <p className="text-muted-foreground text-sm font-light">
          {context.description}
        </p>
        <Separator />
        <div className="flex w-full gap-2">
          <CollectionIdSidebarSearchbox />
          <Link href={`/collection/${params.id}/docs`}>
            <Button size="icon" variant="outline">
              <FilePlus2Icon />
            </Button>
          </Link>
        </div>
        <SidebarGroup className="p-0">
          {pathname.match(/\/chat(\/.*)?$/) ? (
            <ChatHistorySidebar />
          ) : (
            <ClusteringTree />
          )}
        </SidebarGroup>
      </div>
    </Sidebar>
  );
}

export default CollectionIdSidebar;
