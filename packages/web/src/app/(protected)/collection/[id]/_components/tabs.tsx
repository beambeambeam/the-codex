"use client";

import { usePathname, useRouter } from "next/navigation";
import { HouseIcon, MessageCircleIcon, PanelsTopLeftIcon } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CollectionIdTabsIdProps {
  tab: "tab-overview" | "tab-chat" | "tab-docs";
}

function CollectionIdTabs(props: CollectionIdTabsIdProps) {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="w-full">
      <Tabs
        defaultValue="tab-overview"
        value={props.tab}
        onValueChange={(value) => {
          if (typeof value === "string") {
            const segments = pathName.split("/").filter(Boolean);
            const basePath = segments.slice(0, 2).join("/");
            const newPath =
              value === "tab-overview"
                ? `/${basePath}`
                : `/${basePath}/${value.replace("tab-", "")}`;
            router.push(newPath);
          }
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
    </div>
  );
}
export default CollectionIdTabs;
