"use client";

import FileQueueTable from "@/app/(protected)/collection/[id]/files/_components/file-queue-table";
import CollectionFileForm from "@/app/(protected)/collection/[id]/files/_components/form";

function CollectionIdFilePage() {
  return (
    <div className="h-full w-full border-l p-4">
      <div className="text-2xl font-bold">Manage all files</div>
      <CollectionFileForm
        defaultValues={{
          files: [],
        }}
        onSubmit={function (values: { files: File[] }): void {
          throw new Error("Function not implemented.");
        }}
      />
      <FileQueueTable />
    </div>
  );
}
export default CollectionIdFilePage;
