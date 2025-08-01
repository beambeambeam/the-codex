"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Pill, PillAvatar } from "@/components/ui/pill";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Scroller } from "@/components/ui/scroller";
import { fetchClient } from "@/lib/api/client";
import { components } from "@/lib/api/path";
import { cn, debounce, getFallbackUsername } from "@/lib/utils";

type User = components["schemas"]["UserSearchResponse"];

function CollectionShare() {
  const params = useParams<{ id: string }>();
  const collectionId = params.id;

  const [value, setValue] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
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

  return (
    <Scroller className="flex h-full flex-col gap-y-4">
      <h1 className="text-lg font-bold">Share this library</h1>
      <div className="*:not-first:mt-2">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div>
              <h2 className="mb-2 text-sm font-semibold">Search Users:</h2>
              <div className="space-y-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                        }),
                        "flex w-full justify-between bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
                      )}
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedUsers.length == 0 && "No user Selected"}
                        {selectedUsers.map((user) => (
                          <Pill
                            key={user.id}
                            variant="secondary"
                            className="hover:bg-secondary/80 cursor-pointer gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newValue = value.filter(
                                (v) => v !== user.id,
                              );
                              setValue(newValue);
                              setSelectedUsers((prev) =>
                                prev.filter((u) => u.id !== user.id),
                              );
                            }}
                          >
                            <PillAvatar
                              fallback={getFallbackUsername(user.username)}
                            />
                            {user.username}
                            <X className="h-3 w-3" />
                          </Pill>
                        ))}
                      </div>
                      <ChevronsUpDown className="opacity-50" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search users..."
                        className="h-9"
                        value={search}
                        onValueChange={onInputValueChange}
                      />
                      <CommandList>
                        {isSearching ? (
                          <div className="py-6 text-center text-sm">
                            Searching users...
                          </div>
                        ) : filteredUsers.length === 0 ? (
                          <CommandEmpty>
                            {search.trim() === ""
                              ? "No users available try to search."
                              : "No users found."}
                          </CommandEmpty>
                        ) : (
                          <CommandGroup>
                            <CommandEmpty>
                              {search.trim() === ""
                                ? "No users available"
                                : "No users found or All matching users are already selected."}
                            </CommandEmpty>
                            {filteredUsers
                              .filter((user) => !value.includes(user.id))
                              .map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={user.id}
                                  onSelect={(currentValue) => {
                                    if (
                                      currentValue &&
                                      !value.includes(currentValue)
                                    ) {
                                      const newValue = [...value, currentValue];
                                      setValue(newValue);
                                      const selectedUser = filteredUsers.find(
                                        (u) => u.id === currentValue,
                                      );
                                      if (selectedUser) {
                                        setSelectedUsers((prev) => [
                                          ...prev,
                                          selectedUser,
                                        ]);
                                      }
                                    }
                                  }}
                                >
                                  {user.username}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      value.includes(user.id)
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Scroller>
  );
}

export default CollectionShare;
