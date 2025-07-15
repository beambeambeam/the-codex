"use client";

import React from "react";
import {
  expandAllFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
  FolderIcon,
  FolderOpenIcon,
  ListCollapseIcon,
  ListTreeIcon,
} from "lucide-react";

import {
  useClusteringActions,
  useClusterings,
} from "@/app/(protected)/collection/[id]/_components/clustering/context";
import { Button } from "@/components/ui/button";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { getFileIcon } from "@/lib/files";

interface Item {
  name: string;
  children?: string[];
}

const indent = 20;

function ClusteringTree() {
  const { clusteringToTree } = useClusteringActions();
  const clustering = useClusterings();

  const clusteringTree = clusteringToTree(clustering[0]);

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
      hotkeysCoreFeature,
      expandAllFeature,
    ],
  });

  return (
    <div className="flex h-full flex-col gap-2 *:nth-2:grow">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="font-bold">Clustering</p>
        <div className="flex items-center justify-end gap-2">
          <Button size="icon" variant="ghost" onClick={() => tree.expandAll()}>
            <ListTreeIcon size={16} aria-hidden="true" />
          </Button>
          <Button size="icon" variant="ghost" onClick={tree.collapseAll}>
            <ListCollapseIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => {
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel>
                <span className="flex items-center gap-2">
                  {item.isFolder() &&
                    (item.isExpanded() ? (
                      <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                    ) : (
                      <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                    ))}
                  {!item.isFolder() &&
                    getFileIcon({
                      file: {
                        name: item.getItemName(),
                        type: item.getItemName(),
                      },
                    })}
                  <span className="max-w-40 truncate">
                    {item.getItemName()}
                  </span>
                  {item.isFolder() && (
                    <span className="text-muted-foreground -ms-1">
                      {`(${item.getChildren().length})`}
                    </span>
                  )}
                </span>
              </TreeItemLabel>
            </TreeItem>
          );
        })}
      </Tree>
    </div>
  );
}
export default ClusteringTree;
