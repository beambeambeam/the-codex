"use client";

import { useCallback, useState } from "react";

import { fetchClient } from "@/lib/api/client";
import { components } from "@/lib/api/path";

type CollectionResponse = components["schemas"]["CollectionResponse"];

export function useCollectionSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CollectionResponse[]>([]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    try {
      const response = await fetchClient.GET("/collections/search", {
        params: {
          query: {
            query: query.trim(),
          },
        },
      });

      if (response.data) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
  };
}
