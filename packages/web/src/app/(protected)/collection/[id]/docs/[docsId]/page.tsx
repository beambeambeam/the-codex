"use client";

import {
  BadgeQuestionMarkIcon,
  CheckCircleIcon,
  GitCompareArrowsIcon,
  HouseIcon,
  PanelsTopLeftIcon,
  XCircleIcon,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import FilePreviwer from "@/components/file-previwer";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/ui/markdown";
import {
  Pill,
  PillAvatar,
  PillIndicator,
  PillStatus,
} from "@/components/ui/pill";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes } from "@/hooks/use-file-upload";
import { formatFileType, getFileIcon } from "@/lib/files";

const MOCK_DOCS = {
  title: "Attention Is All You Need",
  description: `The paper "Attention Is All You Need" introduces the Transformer, a new network architecture that fundamentally shifts away from recurrent or convolutional neural networks by relying solely on attention mechanisms. This design allows for significantly more parallelization and reduced training time compared to prior dominant sequence transduction models.`,
  source_file_path: "https://arxiv.org/pdf/1706.03762",
  file: {
    name: "Attention Is All You Need.pdf",
    size: 10000000,
    type: "pdf",
    url: "https://arxiv.org/pdf/1706.03762",
    id: "mock-id",
  },
  is_graph_extracted: true,
};

function DocIdPage() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("tab-1"),
  );

  const onTabChange = (value: string) => {
    setTab(value);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b p-6 text-xl font-bold">
        Attention Is All You Need
      </div>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel className="flex flex-col gap-2 p-4" defaultSize={7}>
          <p className="text-md font-bold">Preview</p>
          <FilePreviwer
            file={{
              name: "",
              size: 0,
              type: "pdf",
              url: MOCK_DOCS.source_file_path,
              id: "",
            }}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="p-4" defaultSize={3}>
          <div className="border-border h-full w-full rounded p-2">
            <Tabs defaultValue="tab-1" value={tab} onValueChange={onTabChange}>
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
                <div className="flex h-full w-full flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{MOCK_DOCS.title}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Pill>
                          <PillAvatar fallback="UA" />
                          User Alpha
                        </Pill>
                        <Pill>
                          <PillStatus>
                            <PillIndicator variant="success" />
                            Upload at
                          </PillStatus>
                          <RelativeTimeCard date="2025-07-16T00:00:00.000Z" />
                        </Pill>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill>
                          <PillStatus>
                            {MOCK_DOCS.is_graph_extracted ? (
                              <CheckCircleIcon
                                className="text-emerald-500"
                                size={12}
                              />
                            ) : (
                              <XCircleIcon
                                className="text-destructive"
                                size={12}
                              />
                            )}
                            {MOCK_DOCS.is_graph_extracted ? "Yes" : "No"}
                          </PillStatus>
                          Knowledge Graph Extracted
                        </Pill>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill>
                          {getFileIcon({ file: MOCK_DOCS.file })}{" "}
                          {formatFileType(MOCK_DOCS.file.type)}
                        </Pill>
                        <Pill>{formatBytes(10000000)}</Pill>
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground flex flex-col gap-2">
                    <Label>
                      <BadgeQuestionMarkIcon size={16} />
                      Description
                    </Label>
                    <Markdown className="prose border-border w-full rounded border p-2">
                      {MOCK_DOCS.description}
                    </Markdown>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tab-2">
                <div className="flex items-center gap-2">
                  <GitCompareArrowsIcon size={16} />
                  <p className="text-md font-bold">Knowledge Graph</p>
                  <Pill>
                    <PillStatus>
                      <PillIndicator variant="success" />
                      Lastest Update
                    </PillStatus>
                    <RelativeTimeCard date="2025-07-16T00:00:00.000Z" />
                  </Pill>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
export default DocIdPage;
