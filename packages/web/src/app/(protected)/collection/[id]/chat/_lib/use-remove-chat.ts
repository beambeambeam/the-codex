import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { $api } from "@/lib/api/client";

export default function useRemoveChat() {
  const params = useParams<{ id: string; chatId?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = $api.useMutation("delete", "/chats/{chat_id}", {
    onSuccess: (_, variables) => {
      toast.success("Chat removed successfully!");

      if (params.chatId === variables.params.path.chat_id) {
        router.push(`/collection/${params.id}/chat`);
      }

      queryClient.invalidateQueries({
        queryKey: ["get", "/collections/{collection_id}/chats"],
      });
    },
    onError: (error: unknown) => {
      const message =
        typeof error === "object" && error !== null && "detail" in error
          ? (error as { detail?: string }).detail
          : undefined;
      toast.error(message || "Failed to remove chat. Please try again.");
    },
  });

  return { remove: mutate, isPending };
}
