"use client";

import { useCollectionIdContext } from "@/app/(protected)/collection/[id]/_components/use-collection-id-context";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

function CollectionIdHeader() {
  const context = useCollectionIdContext();
  const { state } = useSidebar();

  return (
    <div className="flex gap-4">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      {state == "collapsed" && context.title}
    </div>
  );
}
export default CollectionIdHeader;
