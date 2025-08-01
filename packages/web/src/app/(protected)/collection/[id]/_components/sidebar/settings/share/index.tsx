"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { $api } from "@/lib/api/client";

import ShareForm, { ShareFormSchemaType } from "./form";

function CollectionShare() {
  const params = useParams<{ id: string }>();
  const formResetRef = useRef<(() => void) | null>(null);

  const {
    mutate: grantPermission,
    isPending: isGranting,
    isError: isGrantError,
  } = $api.useMutation("post", "/collections/{collection_id}/permissions", {
    onSuccess: () => {
      toast.success("Permission granted successfully!");
      if (formResetRef.current) {
        formResetRef.current();
      }
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
    grantPermission({
      params: {
        path: {
          collection_id: params.id,
        },
      },
      body: {
        permissions: values.selectedUsers.map((user) => ({
          user_id: user.id,
          permission_level: "edit" as const,
        })),
      },
    });
  };

  return (
    <ShareForm
      onSubmit={handleSubmit}
      isPending={isGranting}
      isError={isGrantError}
    />
  );
}

export default CollectionShare;
