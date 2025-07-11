"use client";

import FileQueueTable from "@/app/(protected)/collection/[id]/files/_components/file-queue-table";
import CollectionFileForm from "@/app/(protected)/collection/[id]/files/_components/form";
import { Label } from "@/components/ui/label";

function CollectionIdFilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-6 border-l p-4">
      <div className="text-4xl font-bold">Manage doucuments</div>
      <div className="flex flex-col">
        <div className="text-2xl font-bold">
          Upload documents to collections
        </div>
        <CollectionFileForm
          defaultValues={{
            files: [],
          }}
          onSubmit={function (values: { files: File[] }): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold">Documents Queue</div>
        <Label>View all files currently being processed / done processed</Label>
        <FileQueueTable />
      </div>
    </div>
  );
}
export default CollectionIdFilePage;
