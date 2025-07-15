"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

  const targetHref = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(last) || !isNaN(Number(last))) {
      return `${pathname}/docs`;
    } else {
      parts[parts.length - 1] = "docs";
      return "/" + parts.join("/");
    }
  }, [pathname]);

  const handleNavigate = () => {
    router.push(targetHref);
    router.refresh();
  };

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
          <Button size="icon" variant="outline" onClick={handleNavigate}>
            <FilePlus2Icon />
          </Button>
        </div>
        <SidebarGroup>
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
