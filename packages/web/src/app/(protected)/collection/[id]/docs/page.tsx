"use client";

import FileQueueTable from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table";
import CollectionFileForm from "@/app/(protected)/collection/[id]/docs/_components/form";
import { Label } from "@/components/ui/label";

function CollectionIdFilePage() {
  return (
    <div className="p-4">
      <div className="text-4xl font-bold">Manage documents</div>
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
        <div className="text-2xl font-bold">All Documents</div>
        <Label>View all files in the collection</Label>
        <FileQueueTable />
      </div>
    </div>
  );
}
export default CollectionIdFilePage;
