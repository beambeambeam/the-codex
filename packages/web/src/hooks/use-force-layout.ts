import { useEffect, useState } from "react";
import { Edge, Node } from "@xyflow/react";
import * as d3 from "d3-force";

export interface ForceNode extends Node, d3.SimulationNodeDatum {
  id: string;
}

export type ForceEdge = Edge;

export interface ForceLayoutOptions {
  strength?: number;
  radius?: number;
  distance?: number;
}

export const useForceLayout = (
  initialNodes: Node[],
  initialEdges: Edge[],
  options: ForceLayoutOptions = {},
) => {
  const { strength = -60000, radius = 100, distance = 100 } = options;
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    const forceNodes: ForceNode[] = initialNodes.map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }));

    // 🛡️ Deep clone the edges to prevent D3 from mutating them
    const forceEdges: ForceEdge[] = initialEdges.map((edge) => ({ ...edge }));

    const simulation = d3
      .forceSimulation(forceNodes)
      .force(
        "link",
        d3
          .forceLink<ForceNode, ForceEdge>(forceEdges)
          .id((d) => d.id)
          .distance(distance),
      )
      .force("charge", d3.forceManyBody().strength(strength))
      .force("collide", d3.forceCollide().radius(radius))
      .force(
        "center",
        d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2),
      )
      .stop();

    simulation.tick(300);

    const layoutedNodes = forceNodes.map((node) => ({
      ...node,
      position: { x: node.x ?? 0, y: node.y ?? 0 },
    }));

    setNodes(layoutedNodes);
  }, [initialNodes, initialEdges, distance, radius, strength]);

  return { nodes, edges };
};
