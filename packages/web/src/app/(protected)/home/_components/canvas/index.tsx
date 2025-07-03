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

import CustomNode from "./node";

const nodeTypes = {
  customNode: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "customNode",
    position: { x: 100, y: 50 },
    data: {
      header: "Getting Started",
      paragraph:
        "This is your first custom node with a header and paragraph. You can drag it around and connect it to other nodes.",
    },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 100, y: 250 },
    data: {
      header: "Next Steps",
      paragraph:
        "Here's another node to demonstrate connections. Try connecting these nodes together using the handles.",
    },
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 400, y: 150 },
    data: {
      header: "Advanced Features",
      paragraph:
        "This node shows the default styling. You can customize the appearance and add more functionality as needed.",
    },
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

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
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default HomeCanvas;
