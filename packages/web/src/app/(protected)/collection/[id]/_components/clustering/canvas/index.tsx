"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
} from "@xyflow/react";

import ClusteringGroupLabelNode from "@/app/(protected)/collection/[id]/_components/clustering/canvas/label";
import ClusteringCustomNode from "@/app/(protected)/collection/[id]/_components/clustering/canvas/node";
import {
  useClusteringActions,
  useClusterings,
  useClusteringState,
  useSelectedClustering,
  type Clustering,
} from "@/app/(protected)/collection/[id]/_components/clustering/context";
import { Loader } from "@/components/ui/loader";

const nodeTypes = {
  groupLabel: ClusteringGroupLabelNode,
  groupChildren: ClusteringCustomNode,
};

function ClusteringCanvas() {
  const clusterings = useClusterings();
  const { isPending, isEmpty, isError } = useClusteringState();
  const selectedClustering = useSelectedClustering();

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader
          variant="text-shimmer"
          text="Loading clusterings..."
          className="text-2xl font-bold"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load clusterings</h3>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (isEmpty || clusterings.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No clusterings found</h3>
          <p className="text-muted-foreground">
            Create a clustering to visualize your documents.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedClustering) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No clustering selected</h3>
          <p className="text-muted-foreground">
            Please select a clustering to visualize.
          </p>
        </div>
      </div>
    );
  }

  return <ClusteringCanvasChild clustering={selectedClustering} />;
}

function ClusteringCanvasChild({ clustering }: { clustering: Clustering }) {
  const { clusteringToGraph } = useClusteringActions();

  const clusteringNode = clusteringToGraph(clustering);
  const [nodes, , onNodesChange] = useNodesState(clusteringNode);

  return (
    <div className="border-foreground/20 h-full w-full border">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        defaultEdgeOptions={{ type: "straight" }}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}

export default ClusteringCanvas;
