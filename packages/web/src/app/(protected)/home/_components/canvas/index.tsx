"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";

import CenterNode from "@/app/(protected)/home/_components/canvas/center-node";
import CustomNode from "@/app/(protected)/home/_components/canvas/node";

const nodeTypes = {
  customNode: CustomNode,
  centerNode: CenterNode,
};

export interface HomeCanvasProps {
  nodes: Node[];
  edges: Edge[];
}

function HomeCanvas(props: HomeCanvasProps) {
  const [nodes, , onNodesChange] = useNodesState(props.nodes);
  const [edges, , onEdgesChange] = useEdgesState(props.edges);

  return (
    <div className="border-foreground/20 h-full w-full border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}

export default HomeCanvas;
