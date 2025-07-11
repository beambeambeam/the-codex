import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Scroller } from "@/components/ui/scroller";

function CollectionShare() {
  const id = useId();

  return (
    <Scroller className="flex h-full flex-col gap-y-4">
      <h1 className="text-lg font-bold">Share this library</h1>
      <div className="*:not-first:mt-2">
        <div className="flex rounded-md shadow-xs">
          <Input
            id={id}
            className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10"
            placeholder="Email, Comma seperate"
          />
          <button className="border-input bg-background text-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md border px-3 text-sm font-medium transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50">
            Send
          </button>
        </div>
      </div>
    </Scroller>
  );
}
export default CollectionShare;
