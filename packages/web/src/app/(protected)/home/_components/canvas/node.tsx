import * as React from "react";
import { Handle, Position } from "@xyflow/react";
import { BadgeInfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface CustomNodeData {
  header: string;
  paragraph: string;
  href: string;
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
        "bg-card text-card-foreground max-w-[21rem] min-w-[13rem] rounded-lg border transition-all duration-200",
        className,
      )}
      onClick={() => window.location.assign(data.href)}
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
          {header !== "" ? header : "No Header"}
        </h3>
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <BadgeInfoIcon className="size-4" />
          <p>Description</p>
        </span>
        <p className="text-foreground text-start text-sm leading-relaxed">
          {paragraph !== "" ? paragraph : "No Content"}
        </p>
      </div>
    </div>
  );
}

export default CustomNode;
export type { CustomNodeData, CustomNodeProps };
