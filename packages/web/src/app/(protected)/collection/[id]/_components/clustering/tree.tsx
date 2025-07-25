"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  expandAllFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
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
} from "@/app/(protected)/collection/[id]/_components/clustering/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { getFileIcon } from "@/lib/files";

const indent = 20;

function ClusteringTree() {
  const params = useParams<{ id: string }>();

  const { clusteringToTree } = useClusteringActions();
  const clustering = useClusterings();

  const clusteringTree = clusteringToTree(clustering[0]);

  const hasFiles =
    clusteringTree &&
    clusteringTree["root"] &&
    clusteringTree["root"].children &&
    clusteringTree["root"].children.length > 0;

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

      {hasFiles ? (
        <Tree indent={indent} tree={tree}>
          {tree.getItems().map((item) =>
            item.isFolder() ? (
              <TreeItem key={item.getId()} item={item}>
                <TreeItemLabel>
                  <span className="flex items-center gap-2">
                    {item.isExpanded() ? (
                      <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                    ) : (
                      <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                    )}
                    <span className="max-w-40 truncate">
                      {item.getItemName()}
                    </span>
                    <span className="text-muted-foreground -ms-1">
                      {`(${item.getChildren().length})`}
                    </span>
                  </span>
                </TreeItemLabel>
              </TreeItem>
            ) : (
              <Link
                href={`/collection/${params.id}/docs/${item.getItemData().id}`}
                key={item.getId()}
              >
                <TreeItem key={item.getId()} item={item}>
                  <TreeItemLabel>
                    <span className="flex items-center gap-2">
                      {getFileIcon({
                        file: {
                          name: item.getItemName(),
                          type: item.getItemName(),
                        },
                      })}
                      <span className="max-w-40 truncate">
                        {item.getItemName()}
                      </span>
                    </span>
                  </TreeItemLabel>
                </TreeItem>
              </Link>
            ),
          )}
        </Tree>
      ) : (
        <Link href={`/collection/${params.id}/docs`}>
          <Card className="text-muted-foreground flex h-[14rem] items-center justify-center gap-1 border border-dashed text-xs">
            <div className="flex flex-col items-center justify-center gap-0">
              <CloudUploadIcon className="size-7" />
              <p>Upload Files!</p>
              <p>PDF,</p>
              <p>Image (png, jpg or other)</p>
              <p>Table data (CSV, JSON or excel)</p>
              <p>Docs (doc, docx or pptx)</p>
            </div>
          </Card>
        </Link>
      )}
    </div>
  );
}
export default ClusteringTree;
