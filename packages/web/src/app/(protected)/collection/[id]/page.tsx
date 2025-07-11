import { HouseIcon, MessageCircleIcon, PanelsTopLeftIcon } from "lucide-react";

import CollectionIdHeader from "@/app/(protected)/collection/[id]/_components/header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CollectionIdPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <CollectionIdHeader />
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="before:bg-border relative mb-3 h-auto w-full justify-start gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
            <TabsTrigger
              value="tab-1"
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
              value="tab-2"
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
              value="tab-3"
              className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <PanelsTopLeftIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Files
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1">
          <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
            Content for Tab 1
          </p>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
            Content for Tab 2
          </p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default CollectionIdPage;
