"use client";

import { useParams } from "next/navigation";
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
import { $api } from "@/lib/api/client";
import { formatFileType, getFileIcon } from "@/lib/files";
import { getFallbackUsername } from "@/lib/utils";

function DocIdPage() {
  const params = useParams<{ docsId: string }>();

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("tab-1"),
  );

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const { data } = $api.useQuery("get", "/documents/{document_id}", {
    params: {
      path: {
        document_id: params.docsId,
      },
    },
  });

  if (!data) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel className="flex flex-col gap-2 p-4" defaultSize={7}>
          <p className="text-md font-bold">Preview</p>
          <FilePreviwer
            file={{
              name: "",
              size: 0,
              type: data.file_type,
              url: data.minio_file_url ?? "",
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xl font-bold">
                        {data.title || data.file_name}
                      </p>
                      {data.title && data.title !== data.file_name && (
                        <p className="text-muted-foreground text-sm">
                          ({data.file_name})
                        </p>
                      )}
                      {!data.title && (
                        <p className="text-muted-foreground text-sm">
                          No title yet.
                        </p>
                      )}
                      <div className="flex flex-col gap-1"></div>
                      <div className="flex items-center gap-1">
                        {data.created_by ? (
                          <Pill>
                            <PillAvatar
                              fallback={getFallbackUsername(data.created_by)}
                            />
                            {data.created_by}
                          </Pill>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            Unknown user
                          </p>
                        )}
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
                            {data.is_graph_extracted ? (
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
                            {data.is_graph_extracted ? "Yes" : "No"}
                          </PillStatus>
                          Knowledge Graph
                        </Pill>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill>
                          {getFileIcon({
                            file: {
                              name: data.file_name,
                              type: data.file_type,
                            },
                          })}{" "}
                          {formatFileType(data.file_name)}
                        </Pill>
                        <Pill>{formatBytes(10000000)}</Pill>
                      </div>
                    </div>
                  </div>
                  {data.document && (
                    <div className="text-muted-foreground flex flex-col gap-2">
                      <Label>
                        <BadgeQuestionMarkIcon size={16} />
                        Document Content
                      </Label>
                      <div className="border-border max-h-40 w-full overflow-y-auto rounded border p-2">
                        <pre className="text-sm whitespace-pre-wrap">
                          {data.document}
                        </pre>
                      </div>
                    </div>
                  )}
                  <div className="text-muted-foreground flex flex-col gap-2">
                    <Label>
                      <BadgeQuestionMarkIcon size={16} />
                      Description
                    </Label>
                    {data.description ? (
                      <div className="border-border w-full rounded border p-2">
                        <p className="text-sm">{data.description}</p>
                      </div>
                    ) : (
                      <p className="text-sm">No description yet.</p>
                    )}
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
                  <DocCanvasLayout nodes={[]} edges={[]} />
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
