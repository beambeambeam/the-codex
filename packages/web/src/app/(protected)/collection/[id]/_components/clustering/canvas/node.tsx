import * as React from "react";
import { Handle, Position } from "@xyflow/react";

import { getFileIcon } from "@/lib/files";

interface ClusteringCustomNodeData {
  label: string;
}

interface ClusteringCustomNodeProps {
  data: ClusteringCustomNodeData;
  selected?: boolean;
}

function ClusteringCustomNode(props: ClusteringCustomNodeProps) {
  return (
    <div className="group">
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

      <div className="flex flex-col items-center justify-center">
        <div className="group-hover:bg-accent flex items-center justify-center rounded-full border p-2.5 transition-colors">
          {getFileIcon({
            file: {
              name: props.data.label,
              type: props.data.label,
            },
          })}
        </div>
        <p className="group-hover:text-primary max-w-[200px] truncate text-center font-semibold text-wrap transition-colors">
          {props.data.label.replace(/\.[^/.]+$/, "").replace(/_/g, " ")}
        </p>
      </div>
    </div>
  );
}

export default ClusteringCustomNode;
export type { ClusteringCustomNodeData, ClusteringCustomNodeProps };
