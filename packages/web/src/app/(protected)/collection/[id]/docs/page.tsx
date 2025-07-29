"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useClusteringActions } from "@/app/(protected)/collection/[id]/_components/clustering/context";
import FileQueueTable from "@/app/(protected)/collection/[id]/docs/_components/documents-queue-table";
import CollectionFileForm, {
  FileArraySchemaType,
} from "@/app/(protected)/collection/[id]/docs/_components/form";
import { Label } from "@/components/ui/label";
import { JsonToFormData } from "@/lib/api/body-serializer";
import { $api } from "@/lib/api/client";

function CollectionIdFilePage() {
  const params = useParams<{ id: string }>();
  const formRef = useRef<{ reset: () => void }>(null);
  const queryClient = useQueryClient();

  const { fetchClusterings } = useClusteringActions();

  const { mutate, isPending } = $api.useMutation(
    "post",
    "/agentic/upload_ingest",
    {
      onSuccess: async () => {
        toast.success("Documents uploaded successfully!");
        formRef.current?.reset();
        await queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/collections/{collection_id}/documents",
            { params: { path: { collection_id: params.id } } },
          ],
        });

        await fetchClusterings(params.id);
      },
      onError: (error: unknown) => {
        const message =
          typeof error === "object" && error !== null && "detail" in error
            ? (error as { detail?: string }).detail
            : undefined;
        toast.error(message || "Failed to upload documents. Please try again.");
      },
    },
  );

  const onSubmit = (values: FileArraySchemaType) => {
    mutate({
      params: {
        query: {
          collection_id: params.id,
        },
      },
      body: {
        input_files: values.files,
      },
      bodySerializer: JsonToFormData,
    });
  };

  return (
    <div className="relative p-4">
      <div className="text-4xl font-bold">Manage documents</div>
      <div className="flex flex-col">
        <div className="text-2xl font-bold">
          Upload documents to collections
        </div>
        <CollectionFileForm
          ref={formRef}
          onSubmit={onSubmit}
          isPending={isPending}
          disabled={isPending}
          defaultValues={{ files: [] }}
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
