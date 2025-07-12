import * as React from "react";
import { Handle, Position } from "@xyflow/react";

import { cn } from "@/lib/utils";

interface ClusteringCustomNodeData {
  label: string;
}

interface ClusteringCustomNodeProps {
  data: ClusteringCustomNodeData;
  selected?: boolean;
  className?: string;
}

function ClusteringCustomNode({ data, className }: ClusteringCustomNodeProps) {
  const { label } = data;

  return (
    <div
      className={cn(
        "bg-card text-card-foreground max-w-[21rem] min-w-[13rem] rounded-lg transition-all duration-200",
        className,
      )}
    >
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

      <div className="flex flex-col items-start justify-start gap-1.5 p-4">
        <h3 className="text-foreground text-2xl leading-tight font-bold">
          {label !== "" ? label : "No label"}
        </h3>
      </div>
    </div>
  );
}

export default ClusteringCustomNode;
export type { ClusteringCustomNodeData, ClusteringCustomNodeProps };
