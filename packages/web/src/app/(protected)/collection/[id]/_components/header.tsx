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
      {state == "collapsed" && (
        <>
          <Separator orientation="vertical" />
          <span>{context.title}</span>
        </>
      )}
    </div>
  );
}
export default CollectionIdHeader;
