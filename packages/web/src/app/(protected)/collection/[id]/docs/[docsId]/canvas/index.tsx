import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

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
        defaultEdgeOptions={{ type: "straight" }}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}
export default DocCanvas;
