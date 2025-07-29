"use client";

import { useMemo } from "react";

import { $api } from "@/lib/api/client";

export function useChatSearch(query: string, collectionId: string) {
  const trimmedQuery = query.trim();

  const { data, isPending, isError } = $api.useQuery(
    "get",
    "/chats/search",
    {
      params: {
        query: {
          collection_id: collectionId,
          query: trimmedQuery || "",
        },
      },
    },
    {
      enabled: trimmedQuery.length > 0 && collectionId.length > 0,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );

  const searchResults = useMemo(() => {
    return data || [];
  }, [data]);

  return {
    searchResults,
    isSearching: isPending,
    isError,
  };
}
