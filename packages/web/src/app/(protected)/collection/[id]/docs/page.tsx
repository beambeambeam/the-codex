"use client";

import CollectionIdTabs from "@/app/(protected)/collection/[id]/_components/tabs";
import FileQueueTable from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table";
import CollectionFileForm from "@/app/(protected)/collection/[id]/docs/_components/form";
import { Label } from "@/components/ui/label";

function CollectionIdFilePage() {
  return (
    <>
      <CollectionIdTabs tab="tab-docs" />
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
          <div className="text-2xl font-bold">All Documents</div>
          <Label>View all files in the collection</Label>
          <FileQueueTable />
        </div>
      </div>
    </>
  );
}
export default CollectionIdFilePage;
