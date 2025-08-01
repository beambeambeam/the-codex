"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";

import { $api } from "@/lib/api/client";

import ShareForm, { ShareFormSchemaType } from "./form";

function CollectionShare() {
  const params = useParams<{ id: string }>();
  const collectionId = params.id;

  const {
    mutate: grantPermission,
    isPending: isGranting,
    isError: isGrantError,
  } = $api.useMutation("post", "/collections/{collection_id}/permissions", {
    onSuccess: () => {
      toast.success("Permission granted successfully!");
    },
    onError: (error: unknown) => {
      const message =
        typeof error === "object" && error !== null && "detail" in error
          ? (error as { detail?: string }).detail
          : undefined;
      toast.error(message || "Failed to grant permission. Please try again.");
    },
  });

  const handleSubmit = (values: ShareFormSchemaType) => {
    if (!collectionId) return;

    values.selectedUsers.forEach((user) => {
      grantPermission({
        params: {
          path: {
            collection_id: collectionId,
          },
        },
        body: {
          user_id: user.id,
          permission_level: "edit",
        },
      });
    });
  };

  return (
    <ShareForm
      onSubmit={handleSubmit}
      isPending={isGranting}
      isError={isGrantError}
      collectionId={collectionId}
    />
  );
}

export default CollectionShare;
