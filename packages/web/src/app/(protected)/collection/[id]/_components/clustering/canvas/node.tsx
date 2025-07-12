import * as React from "react";
import { Handle, Position } from "@xyflow/react";

interface ClusteringCustomNodeData {
  label: string;
}

interface ClusteringCustomNodeProps {
  data: ClusteringCustomNodeData;
  selected?: boolean;
}

function ClusteringCustomNode(props: ClusteringCustomNodeProps) {
  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        className="invisible !top-1/2 !right-auto !bottom-auto !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="invisible !top-1/2 !right-auto !bottom-auto !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
      />

      {props.data.label}
    </div>
  );
}

export default ClusteringCustomNode;
export type { ClusteringCustomNodeData, ClusteringCustomNodeProps };
