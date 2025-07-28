import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { $api } from "@/lib/api/client";

export default function useRemoveDocument() {
  const params = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/documents/{document_id}",
    {
      onSuccess: () => {
        toast.success("Document removed successfully!");
        queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/collections/{collection_id}/documents",
            { params: { path: { collection_id: params.id } } },
          ],
        });
      },
      onError: (error: unknown) => {
        const message =
          typeof error === "object" && error !== null && "detail" in error
            ? (error as { detail?: string }).detail
            : undefined;
        toast.error(message || "Failed to remove document. Please try again.");
      },
    },
  );
  return { remove: mutate, isPending };
}
