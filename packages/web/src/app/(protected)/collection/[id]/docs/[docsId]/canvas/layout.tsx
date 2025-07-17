import { Edge, Node } from "@xyflow/react";

import DocCanvas from "@/app/(protected)/collection/[id]/docs/[docsId]/canvas";

interface DocCanvasLayoutProps {
  nodes: Node[];
  edges: Edge[];
}

function DocCanvasLayout(props: DocCanvasLayoutProps) {
  return <DocCanvas {...props} />;
}
export default DocCanvasLayout;
