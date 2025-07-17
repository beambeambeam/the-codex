import { useEffect, useState } from "react";
import { Edge, Node } from "@xyflow/react";
import * as d3 from "d3-force";

export interface ForceNode extends Node, d3.SimulationNodeDatum {
  id: string;
}

export type ForceEdge = Edge;

export const useForceLayout = (initialNodes: Node[], initialEdges: Edge[]) => {
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
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-60000))
      .force("collide", d3.forceCollide().radius(100))
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
  }, [initialNodes, initialEdges]);

  return { nodes, edges };
};
