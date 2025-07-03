import * as React from "react";
import { Handle, Position } from "@xyflow/react";

import { cn } from "@/lib/utils";

interface CustomNodeData {
  header: string;
  paragraph: string;
}

interface CustomNodeProps {
  data: CustomNodeData;
  selected?: boolean;
  className?: string;
}

function CustomNode({ data, className }: CustomNodeProps) {
  const { header, paragraph } = data;

  return (
    <div
      className={cn(
        "bg-card text-card-foreground max-w-[21rem] min-w-[13rem] rounded-lg transition-all duration-200",
        className,
      )}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex flex-col items-start justify-start gap-1.5 p-4">
        <h3 className="text-foreground text-2xl leading-tight font-bold">
          {header}
        </h3>
        <p className="text-muted-foreground text-start text-xs leading-relaxed">
          {paragraph}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default CustomNode;
export type { CustomNodeData, CustomNodeProps };
