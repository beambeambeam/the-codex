import { Edge, Node } from "@xyflow/react";

import DocCanvas from "@/app/(protected)/collection/[id]/docs/[docsId]/canvas";
import { useForceLayout } from "@/hooks/use-force-layout";

interface DocCanvasLayoutProps {
  nodes: Node[];
  edges: Edge[];
}

function DocCanvasLayout(props: DocCanvasLayoutProps) {
  const { nodes: layoutNodes, edges: layoutEgdes } = useForceLayout(
    props.nodes,
    props.edges,
    {
      strength: 80,
      radius: 100,
      distance: 100,
    },
  );

  if (layoutNodes.length == 0) {
    return null;
  }

  return <DocCanvas nodes={layoutNodes} edges={layoutEgdes} />;
}
export default DocCanvasLayout;
