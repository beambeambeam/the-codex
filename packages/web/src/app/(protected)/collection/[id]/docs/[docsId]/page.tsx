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

import DocCanvasLayout from "@/app/(protected)/collection/[id]/docs/[docsId]/canvas/layout";
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

const MOCK_DOCS_NODES = [
  {
    id: "123a0198-8fc9-4cfe-b000-f1307f94196b",
    data: { label: "Ashish Vaswani" },
    position: { x: 0, y: 0 },
  },
  {
    id: "dd5e7683-40e5-4a6e-9f06-c87f81063a66",
    data: { label: "Noam Shazeer" },
    position: { x: 0, y: 0 },
  },
  {
    id: "01f90575-afdb-4cc4-afda-ad6703fbe82e",
    data: { label: "Niki Parmar" },
    position: { x: 0, y: 0 },
  },
  {
    id: "85c1ddd6-936d-4916-8060-8a8a7ffaef1b",
    data: { label: "Jakob Uszkoreit" },
    position: { x: 0, y: 0 },
  },
  {
    id: "f1a7dde6-515c-445a-a9d8-7e4a47b3b7be",
    data: { label: "Llion Jones" },
    position: { x: 0, y: 0 },
  },
  {
    id: "1b8923a8-307a-46f9-84d3-bf5635db2f38",
    data: { label: "Aidan N. Gomez" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2d7a2be9-a643-4e15-9ee7-ba3aa2da854c",
    data: { label: "Łukasz Kaiser" },
    position: { x: 0, y: 0 },
  },
  {
    id: "8c05ee0a-da14-47c4-bfee-3beabdbbafc1",
    data: { label: "Illia Polosukhin" },
    position: { x: 0, y: 0 },
  },
  {
    id: "9da61faa-dc9c-4a89-9d65-75cd4f7982cf",
    data: { label: "Google Brain" },
    position: { x: 0, y: 0 },
  },
  {
    id: "e5703dca-6154-4faa-8d64-2b9d58b82b58",
    data: { label: "Google Research" },
    position: { x: 0, y: 0 },
  },
  {
    id: "8c6eff78-12d9-4926-8b98-bccc7c3e493e",
    data: { label: "University of Toronto" },
    position: { x: 0, y: 0 },
  },
  {
    id: "fc960f24-c11b-4ad7-a846-d0d23002d181",
    data: { label: "Transformer Model" },
    position: { x: 0, y: 0 },
  },
  {
    id: "4d7c7350-980c-4c88-be1b-a7faa4caea7f",
    data: { label: "Attention Mechanism" },
    position: { x: 0, y: 0 },
  },
  {
    id: "f119caf3-1451-44b8-88ef-10c44b4014b2",
    data: { label: "Self-Attention" },
    position: { x: 0, y: 0 },
  },
  {
    id: "5e4dacc9-2c3d-4b5e-9b4a-d56642294780",
    data: { label: "Scaled Dot-Product Attention" },
    position: { x: 0, y: 0 },
  },
  {
    id: "b1ff39a5-dda4-4cb5-b73a-47cc0294f8a5",
    data: { label: "Multi-Head Attention" },
    position: { x: 0, y: 0 },
  },
  {
    id: "8d1e8c94-0aa8-4735-9b85-5aac914ef49f",
    data: { label: "WMT 2014 English-to-German" },
    position: { x: 0, y: 0 },
  },
  {
    id: "307f76f5-1263-4638-b2e2-4851f2aef19c",
    data: { label: "WMT 2014 English-to-French" },
    position: { x: 0, y: 0 },
  },
  {
    id: "48411ace-ccd2-427e-915f-84cb8b5d3084",
    data: { label: "NIPS 2017" },
    position: { x: 0, y: 0 },
  },
  {
    id: "f21ed287-9da1-421c-9cf0-f6ba1b1d12ec",
    data: { label: "Attention Is All You Need" },
    position: { x: 0, y: 0 },
  },
];

const MOCK_DOCS_EDGES = [
  {
    id: "bbf3c412-4164-4886-98a2-a1cb50a0aa45",
    source: "f21ed287-9da1-421c-9cf0-f6ba1b1d12ec", // Work_1 → "Attention Is All You Need"
    target: "48411ace-ccd2-427e-915f-84cb8b5d3084", // Event_1 → "NIPS 2017"
    data: { label: "presented_at" },
    type: "docCustomEdge",
  },
  {
    id: "427022da-6193-4354-bb12-0854b80b6e91",
    source: "4d7c7350-980c-4c88-be1b-a7faa4caea7f", // Concept_1 → "Attention Mechanism"
    target: "307f76f5-1263-4638-b2e2-4851f2aef19c", // Dataset_2 → "WMT 2014 English-to-French"
    data: { label: "evaluated_on" },
    type: "docCustomEdge",
  },
  {
    id: "75c48708-60bc-4c7d-8628-4813d4d88b43",
    source: "4d7c7350-980c-4c88-be1b-a7faa4caea7f",
    target: "8d1e8c94-0aa8-4735-9b85-5aac914ef49f", // Dataset_1 → "WMT 2014 English-to-German"
    data: { label: "evaluated_on" },
    type: "docCustomEdge",
  },
  {
    id: "2f4d1737-ea08-47f4-a209-770b228cc07d",
    source: "4d7c7350-980c-4c88-be1b-a7faa4caea7f",
    target: "b1ff39a5-dda4-4cb5-b73a-47cc0294f8a5", // Method_2 → "Multi-Head Attention"
    data: { label: "uses" },
    type: "docCustomEdge",
  },
  {
    id: "8e915f3a-142b-403b-9000-830b0e43d629",
    source: "4d7c7350-980c-4c88-be1b-a7faa4caea7f",
    target: "5e4dacc9-2c3d-4b5e-9b4a-d56642294780", // Method_1 → "Scaled Dot-Product Attention"
    data: { label: "uses" },
    type: "docCustomEdge",
  },
  {
    id: "397f62f9-710f-4847-b021-bc7348673235",
    source: "4d7c7350-980c-4c88-be1b-a7faa4caea7f",
    target: "f119caf3-1451-44b8-88ef-10c44b4014b2", // Concept_2 → "Self-Attention"
    data: { label: "uses" },
    type: "docCustomEdge",
  },
  {
    id: "92a346df-ccbf-4dec-b8c5-0f0823052ddc",
    source: "f21ed287-9da1-421c-9cf0-f6ba1b1d12ec",
    target: "4d7c7350-980c-4c88-be1b-a7faa4caea7f",
    data: { label: "introduces" },
    type: "docCustomEdge",
  },
  {
    id: "dc46f3e9-48c9-4dae-9746-375bed28a06e",
    source: "2d7a2be9-a643-4e15-9ee7-ba3aa2da854c", // Person_4 → "Łukasz Kaiser"
    target: "e5703dca-6154-4faa-8d64-2b9d58b82b58", // Organization_2 → "Google Research"
    data: { label: "affiliated_with" },
    type: "docCustomEdge",
  },
  {
    id: "f663f89e-2039-4d1a-8fbd-a1346e507e1c",
    source: "1b8923a8-307a-46f9-84d3-bf5635db2f38", // Person_3 → "Aidan N. Gomez"
    target: "e5703dca-6154-4faa-8d64-2b9d58b82b58",
    data: { label: "affiliated_with" },
    type: "docCustomEdge",
  },
  {
    id: "3e6c481f-f8b4-44ce-8503-3cc7a9a4916e",
    source: "01f90575-afdb-4cc4-afda-ad6703fbe82e", // Person_2 → "Niki Parmar"
    target: "9da61faa-dc9c-4a89-9d65-75cd4f7982cf", // Organization_1 → "Google Brain"
    data: { label: "affiliated_with" },
    type: "docCustomEdge",
  },
  {
    id: "440ce1d6-32c6-47fd-abcb-fbfec7b84de4",
    source: "dd5e7683-40e5-4a6e-9f06-c87f81063a66", // Person_1 → "Noam Shazeer"
    target: "9da61faa-dc9c-4a89-9d65-75cd4f7982cf",
    data: { label: "affiliated_with" },
    type: "docCustomEdge",
  },
  {
    id: "a039dc26-3d36-4ba6-a95e-5b83772ed4ca",
    source: "f21ed287-9da1-421c-9cf0-f6ba1b1d12ec",
    target: "2d7a2be9-a643-4e15-9ee7-ba3aa2da854c",
    data: { label: "authored_by" },
    type: "docCustomEdge",
  },
  {
    id: "509d082a-ac45-4478-97b3-a12e3f596c3b",
    source: "f21ed287-9da1-421c-9cf0-f6ba1b1d12ec",
    target: "1b8923a8-307a-46f9-84d3-bf5635db2f38",
    data: { label: "authored_by" },
    type: "docCustomEdge",
  },
  {
    id: "a52e78f8-097d-4010-8339-abbfb99ae5bd",
    source: "f21ed287-9da1-421c-9cf0-f6ba1b1d12ec",
    target: "01f90575-afdb-4cc4-afda-ad6703fbe82e",
    data: { label: "authored_by" },
    type: "docCustomEdge",
  },
  {
    id: "73d39d1a-70be-42d4-8811-f0fe39347fde",
    source: "f21ed287-9da1-421c-9cf0-f6ba1b1d12ec",
    target: "dd5e7683-40e5-4a6e-9f06-c87f81063a66",
    data: { label: "authored_by" },
    type: "docCustomEdge",
  },
];

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
                  <TabsTrigger
                    value="tab-2"
                    className="group"
                    disabled={!MOCK_DOCS.is_graph_extracted}
                  >
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <GitCompareArrowsIcon size={16} />
                    <p className="text-md font-bold">Knowledge Graph</p>
                  </div>
                  <Pill className="h-fit">
                    <PillStatus>
                      <PillIndicator variant="success" />
                      Latest Update
                    </PillStatus>
                    <RelativeTimeCard date="2025-07-16T00:00:00.000Z" />
                  </Pill>
                  <DocCanvasLayout
                    nodes={MOCK_DOCS_NODES}
                    edges={MOCK_DOCS_EDGES}
                  />
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
