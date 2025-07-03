"use client";

import { useCallback } from "react";
import {
  addEdge,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type OnConnect,
} from "@xyflow/react";

import CenterNode from "@/app/(protected)/home/_components/canvas/center-node";
import CustomNode from "@/app/(protected)/home/_components/canvas/node";

const nodeTypes = {
  customNode: CustomNode,
  centerNode: CenterNode,
};

const initialNodes: Node[] = [
  {
    id: "center",
    type: "centerNode",
    position: { x: 1000, y: 500 },
    data: {
      title: "User",
      imageUrl: "",
    },
  },
  {
    id: "1",
    type: "customNode",
    position: { x: -500, y: 50 },
    data: {
      header: "🩻 LLM Medical Fine tune",
      paragraph:
        "This Library is about Medical LLM fine-tuning refers to the process of adapting a large language model (LLM)—like GPT, LLaMA, or BERT—for specialized use in medical and healthcare-related tasks.",
      href: "/home",
    },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 100, y: 250 },
    data: {
      header: "VLM Technical Report",
      paragraph:
        "This library is all about list of Technical Report of how-well VLM do in current task (OCR, Context and more)",
      href: "/home",
    },
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 500, y: 150 },
    data: {
      header: "LLM Carbon Footprint",
      paragraph:
        "This Library contain a data about How much each LLM consume the data for carbon.",
      href: "/home",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-center", source: "1", target: "center" },
  { id: "ecenter-2", source: "center", target: "2" },
  { id: "ecenter-3", source: "center", target: "3" },
];

function HomeCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="border-foreground/20 h-full w-full border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: "straight" }}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default HomeCanvas;
