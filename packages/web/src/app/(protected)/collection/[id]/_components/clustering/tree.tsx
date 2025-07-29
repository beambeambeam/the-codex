"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  expandAllFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
  ChevronDownIcon,
  CloudUploadIcon,
  FolderIcon,
  FolderOpenIcon,
  ListCollapseIcon,
  ListTreeIcon,
} from "lucide-react";

import {
  Item,
  useClusteringActions,
  useClusterings,
  useClusteringState,
  useSelectedClustering,
  useSelectedClusteringId,
  type Clustering,
} from "@/app/(protected)/collection/[id]/_components/clustering/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";

const indent = 20;

function ClusteringTree() {
  const clusterings = useClusterings();
  const selectedClustering = useSelectedClustering();
  const { isPending, isEmpty, isError } = useClusteringState();

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader variant="text-shimmer" text="Loading clusterings..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground text-sm">
          Failed to load clusterings
        </p>
      </div>
    );
  }

  if (isEmpty || clusterings.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground text-sm">
          No clusterings available
        </p>
      </div>
    );
  }

  if (!selectedClustering) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground text-sm">No clustering selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 text-sm font-medium">
              {selectedClustering.title || "Clustering"}
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {clusterings.map((clustering) => (
              <ClusteringMenuItem key={clustering.id} clustering={clustering} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ClusteringTreeChild
        key={selectedClustering.id}
        clustering={selectedClustering}
      />
    </div>
  );
}

function ClusteringMenuItem({ clustering }: { clustering: Clustering }) {
  const { setSelectedId } = useClusteringActions();
  const selectedId = useSelectedClusteringId();

  return (
    <DropdownMenuItem
      onClick={() => setSelectedId(clustering.id)}
      className={selectedId === clustering.id ? "bg-accent" : ""}
    >
      {clustering.title}
    </DropdownMenuItem>
  );
}

function ClusteringTreeChild({ clustering }: { clustering: Clustering }) {
  const { clusteringToTree } = useClusteringActions();
  const clusteringTree = clusteringToTree(clustering);
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const tree = useTree<Item>({
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => clusteringTree[itemId],
      getChildren: (itemId) => clusteringTree[itemId]?.children ?? [],
    },
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      expandAllFeature,
      hotkeysCoreFeature,
    ],
  });

  const hasFiles =
    clusteringTree &&
    clusteringTree["root"] &&
    clusteringTree["root"].children &&
    clusteringTree["root"].children.length > 0;

  const handleItemDoubleClick = (item: ReturnType<typeof tree.getItems>[0]) => {
    if (
      item.getId() !== "root" &&
      !item.isFolder() &&
      item.getItemData()?.id &&
      !item.getItemData()?.id.startsWith("id-")
    ) {
      router.push(`/collection/${params.id}/docs/${item.getItemData().id}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Clustering</h3>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => tree.expandAll()}
            className="h-6 w-6"
          >
            <ListTreeIcon className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => tree.collapseAll()}
            className="h-6 w-6"
          >
            <ListCollapseIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {hasFiles ? (
        <Tree tree={tree}>
          {tree.getItems().map((item) => (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel
                onDoubleClick={() => handleItemDoubleClick(item)}
                className={
                  item.isFolder()
                    ? ""
                    : "hover:bg-accent cursor-pointer transition-colors"
                }
                title={
                  item.isFolder() ? undefined : "Double-click to view document"
                }
              >
                <div className="flex items-center gap-2">
                  {item.isFolder() ? (
                    item.isExpanded() ? (
                      <FolderOpenIcon className="h-4 w-4" />
                    ) : (
                      <FolderIcon className="h-4 w-4" />
                    )
                  ) : (
                    <CloudUploadIcon className="h-4 w-4" />
                  )}
                  <span className="truncate">{item.getItemData().name}</span>
                </div>
              </TreeItemLabel>
            </TreeItem>
          ))}
        </Tree>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground text-sm">
            No documents in clustering
          </p>
        </Card>
      )}
    </div>
  );
}

export default ClusteringTree;
