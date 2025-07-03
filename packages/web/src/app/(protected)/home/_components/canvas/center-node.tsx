import * as React from "react";
import { Handle, Position } from "@xyflow/react";
import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CenterNodeData {
  name: string;
  imageUrl?: string;
}

interface CenterNodeProps {
  data: CenterNodeData;
  selected?: boolean;
  className?: string;
}

function CenterNode({ data, className }: CenterNodeProps) {
  const { name, imageUrl } = data;

  return (
    <div className="rounded-full">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary/60 !h-3 !w-3"
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary/60 !h-3 !w-3"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary/60 !h-3 !w-3"
      />

      <div className="flex flex-col items-center gap-2">
        <Avatar className="border-primary/30 size-16 border-2">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary/60 !h-3 !w-3"
      />
    </div>
  );
}

export default CenterNode;
export type { CenterNodeData, CenterNodeProps };
