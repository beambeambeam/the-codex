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
} from "@/app/(protected)/collection/[id]/_components/clustering/context";

const nodeTypes = {
  groupLabel: ClusteringGroupLabelNode,
  groupChildren: ClusteringCustomNode,
};

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
