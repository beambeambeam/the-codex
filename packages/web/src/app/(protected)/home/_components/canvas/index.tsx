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

const generateCircularPositions = (
  centerX: number,
  centerY: number,
  radius: number,
  count: number,
) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.push({ x, y });
  }
  return positions;
};

const centerPosition = { x: 500, y: 300 };
const radius = 200;

interface HomeCanvasProps {
  nodes: {
    data: {
      header: string;
      paragraph: string;
      href: string;
    };
  }[];
}

function HomeCanvas(props: HomeCanvasProps) {
  const nodePositions = generateCircularPositions(
    centerPosition.x,
    centerPosition.y,
    radius,
    props.nodes.length,
  );

  const propsNodes = props.nodes.map((node, index) => ({
    id: String(index + 1),
    type: "customNode",
    position: nodePositions[index] || { x: 0, y: 0 },
    data: node.data,
  }));

  const dynamicNodes: Node[] = [
    {
      id: "center",
      type: "centerNode",
      position: centerPosition,
      data: {
        title: "User",
        imageUrl: "",
      },
    },
    ...propsNodes,
  ];

  const dynamicEdges: Edge[] = propsNodes.map((node) => ({
    id: `e${node.id}-center`,
    source: node.id,
    target: "center",
  }));

  const [nodes, , onNodesChange] = useNodesState(dynamicNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(dynamicEdges);

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
