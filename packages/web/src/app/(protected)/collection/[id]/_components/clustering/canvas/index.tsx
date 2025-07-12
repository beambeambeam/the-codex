"use client";

import { Controls, ReactFlow, useNodesState } from "@xyflow/react";

import {
  useClusteringActions,
  useClusterings,
} from "@/app/(protected)/collection/[id]/_components/clustering/context";

function ClusteringCanvas() {
  const clustering = useClusterings();
  const { clusteringToGraph } = useClusteringActions();
  const clusteringNode = clusteringToGraph(clustering[0]);

  const [nodes, , onNodesChange] = useNodesState(clusteringNode);

  return (
    <div className="border-foreground/20 h-full w-full border">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        defaultEdgeOptions={{ type: "straight" }}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}
export default ClusteringCanvas;
