import { Input } from "@/components/ui/input";
import { Scroller } from "@/components/ui/scroller";

function CollectionShare() {
  return (
    <Scroller className="flex h-full flex-col gap-y-4">
      <h1 className="text-lg font-bold">Share this library</h1>
      <div>
        <Input placeholder="Email, Comma seperate" />
      </div>
    </Scroller>
  );
}
export default CollectionShare;
