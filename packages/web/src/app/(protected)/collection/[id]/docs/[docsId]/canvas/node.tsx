"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

interface CustomNodeProps {
  data: {
    title: string;
    description: string;
    type: string;
  };
}

const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <div className="text-lg font-bold">{data.title}</div>
        <div className="text-sm">
          {data.description
            .split(" ")
            .reduce((acc, word) => {
              const lastLine = acc[acc.length - 1];
              if (lastLine && lastLine.length + word.length + 1 <= 50) {
                acc[acc.length - 1] = `${lastLine} ${word}`;
              } else {
                acc.push(word);
              }
              return acc;
            }, [] as string[])
            .map((line, index) => (
              <div key={index}>{line}</div>
            ))}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
