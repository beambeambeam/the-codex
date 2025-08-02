import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeLabelRenderer,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import CustomEdge from "@/app/(protected)/collection/[id]/docs/[docsId]/canvas/edge";
import CustomNode from "@/app/(protected)/collection/[id]/docs/[docsId]/canvas/node";

interface DocCanvasProps {
  nodes: Node[];
  edges: Edge[];
}

function DocCanvas(props: DocCanvasProps) {
  const [nodes, , onNodesChange] = useNodesState(props.nodes);
  const [edges, , onEdgesChange] = useEdgesState(props.edges);

  return (
    <div className="border-foreground/20 h-[calc(100vh-350px)] w-full rounded border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        edgeTypes={{ docCustomEdge: CustomEdge }}
        nodeTypes={{ custom: CustomNode }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
        <EdgeLabelRenderer>
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);

            if (!sourceNode || !targetNode) {
              return null;
            }

            const x = (sourceNode.position.x + targetNode.position.x) / 2;
            const y = (sourceNode.position.y + targetNode.position.y) / 2;

            return (
              <div
                key={edge.id}
                style={{
                  position: "absolute",
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  pointerEvents: "all",
                  background: "white",
                  padding: "5px",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}
                className="nodrag nopan"
              >
                {edge.label}
              </div>
            );
          })}
        </EdgeLabelRenderer>
      </ReactFlow>
    </div>
  );
}
export default DocCanvas;
