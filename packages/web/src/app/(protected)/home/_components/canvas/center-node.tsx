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
}

function CenterNode({ data }: CenterNodeProps) {
  const { name, imageUrl } = data;

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

      <div className="flex flex-col items-center gap-2">
        <Avatar className="size-20">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default CenterNode;
export type { CenterNodeData, CenterNodeProps };
