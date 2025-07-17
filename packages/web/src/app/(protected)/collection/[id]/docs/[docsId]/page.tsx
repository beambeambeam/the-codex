import { HouseIcon, PanelsTopLeftIcon } from "lucide-react";

import FilePreviwer from "@/components/file-previwer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DocIdPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b p-6 text-xl font-bold">
        Attention Is All You Need
      </div>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel className="flex flex-col gap-2 p-4">
          <p className="text-md font-bold">Preview</p>
          <FilePreviwer
            file={{
              name: "",
              size: 0,
              type: "pdf",
              url: "https://arxiv.org/pdf/1706.03762",
              id: "",
            }}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="p-4">
          <div className="border-border h-full w-full rounded p-2">
            <Tabs defaultValue="tab-1">
              <ScrollArea>
                <TabsList className="mb-3">
                  <TabsTrigger value="tab-1">
                    <HouseIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="tab-2" className="group">
                    <PanelsTopLeftIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Knowledge Graph
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
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
export default DocIdPage;
