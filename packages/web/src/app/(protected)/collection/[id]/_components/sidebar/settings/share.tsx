"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxLoading,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Scroller } from "@/components/ui/scroller";
import { fetchClient } from "@/lib/api/client";
import { debounce } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  email: string;
}

function CollectionShare() {
  const params = useParams<{ id: string }>();
  const collectionId = params.id;

  const [value, setValue] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const searchUsers = useCallback(
    async (searchTerm: string) => {
      if (!collectionId) {
        setFilteredUsers([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetchClient.GET(
          "/collections/{collection_id}/search/users",
          {
            params: {
              path: {
                collection_id: collectionId,
              },
              query: {
                query: searchTerm.trim(),
                limit: searchTerm.trim() === "" ? 5 : undefined,
              },
            },
          },
        );

        if (response.data) {
          setFilteredUsers(response.data);
        } else {
          setFilteredUsers([]);
        }
      } catch {
        setFilteredUsers([]);
      } finally {
        setIsSearching(false);
      }
    },
    [collectionId],
  );

  const debouncedSearch = useMemo(
    () => debounce(searchUsers, 300),
    [searchUsers],
  );

  const onInputValueChange = useCallback(
    (value: string) => {
      setSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const onValueChange = useCallback(
    (selectedValues: string[]) => {
      setValue(selectedValues);
      const allAvailableUsers = [...selectedUsers, ...filteredUsers];
      const uniqueUsers = allAvailableUsers.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.id === user.id),
      );
      const newSelectedUsers = uniqueUsers.filter((user) =>
        selectedValues.includes(user.id),
      );
      setSelectedUsers(newSelectedUsers);
    },
    [filteredUsers, selectedUsers],
  );

  return (
    <Scroller className="flex h-full flex-col gap-y-4">
      <h1 className="text-lg font-bold">Share this library</h1>
      <div className="*:not-first:mt-2">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Combobox
              value={value}
              onValueChange={onValueChange}
              inputValue={search}
              onInputValueChange={onInputValueChange}
              manualFiltering
              multiple
            >
              <ComboboxLabel>Search Users</ComboboxLabel>
              <ComboboxAnchor>
                <ComboboxBadgeList>
                  {selectedUsers.map((user) => (
                    <ComboboxBadgeItem key={user.id} value={user.id}>
                      {user.username}
                    </ComboboxBadgeItem>
                  ))}
                </ComboboxBadgeList>
                <ComboboxInput placeholder="Type to search for users..." />
                <ComboboxTrigger>
                  <ChevronDown className="h-4 w-4" />
                </ComboboxTrigger>
              </ComboboxAnchor>
              <ComboboxContent>
                {isSearching ? (
                  <ComboboxLoading value={0} label="Searching users..." />
                ) : filteredUsers.length === 0 ? (
                  <ComboboxEmpty>
                    {search.trim() === ""
                      ? "No users available"
                      : "No users found."}
                  </ComboboxEmpty>
                ) : (
                  filteredUsers.map((user) => (
                    <ComboboxItem key={user.id} value={user.id} outset>
                      {user.username}
                    </ComboboxItem>
                  ))
                )}
              </ComboboxContent>
            </Combobox>
          </div>
        </div>
      </div>
    </Scroller>
  );
}

export default CollectionShare;
