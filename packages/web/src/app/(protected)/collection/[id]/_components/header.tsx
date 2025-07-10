"use client";

import { Separator } from "@radix-ui/react-separator";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

function CollectionIdHeader() {
  const { state } = useSidebar();

  return (
    <div className="flex gap-1">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      {state}
    </div>
  );
}
export default CollectionIdHeader;
