import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import CustomEdge from "@/app/(protected)/collection/[id]/docs/[docsId]/canvas/edge";

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
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}
export default DocCanvas;
