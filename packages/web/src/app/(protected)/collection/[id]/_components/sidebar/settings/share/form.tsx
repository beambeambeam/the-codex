"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { FormProps } from "@/types";

type User = components["schemas"]["UserSearchResponse"];

const shareFormSchema = z.object({
  selectedUsers: z
    .array(
      z.object({
        id: z.string(),
        username: z.string(),
        email: z.string(),
      }),
    )
    .min(1, "At least one user must be selected"),
});

export type ShareFormSchemaType = z.infer<typeof shareFormSchema>;

type ShareFormProps = FormProps<ShareFormSchemaType>;

export default function ShareForm({
  onSubmit,
  isPending,
  isError,
  disabled,
  defaultValues,
}: ShareFormProps) {
  const params = useParams<{ id: string }>();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<ShareFormSchemaType>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: defaultValues || {
      selectedUsers: [],
    },
    disabled,
  });

  const selectedUsers = form.watch("selectedUsers");

  const searchUsers = useCallback(
    async (searchTerm: string) => {
      if (!params.id) {
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
                collection_id: params.id,
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
    [params.id],
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

  const handleUserSelect = (userId: string) => {
    const selectedUser = filteredUsers.find((u) => u.id === userId);
    if (selectedUser && !selectedUsers.find((u) => u.id === userId)) {
      form.setValue("selectedUsers", [...selectedUsers, selectedUser]);
    }
  };

  const handleUserRemove = (userId: string) => {
    form.setValue(
      "selectedUsers",
      selectedUsers.filter((u) => u.id !== userId),
    );
  };

  return (
    <Scroller className="flex h-full flex-col gap-y-4">
      <h1 className="text-lg font-bold">Share this library</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid items-end justify-end gap-2 sm:grid-cols-1 md:grid-cols-[3fr_1fr]"
        >
          <FormField
            control={form.control}
            name="selectedUsers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Users</FormLabel>
                <FormControl>
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
                            {selectedUsers.length === 0 && "No user Selected"}
                            {selectedUsers.map((user) => (
                              <Pill
                                key={user.id}
                                variant="secondary"
                                className="hover:bg-secondary/80 cursor-pointer gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserRemove(user.id);
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
                                  .filter(
                                    (user) =>
                                      !selectedUsers.find(
                                        (u) => u.id === user.id,
                                      ),
                                  )
                                  .map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.id}
                                      onSelect={handleUserSelect}
                                    >
                                      {user.username}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          selectedUsers.find(
                                            (u) => u.id === user.id,
                                          )
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isError && (
            <div className="text-destructive text-sm">
              Failed to share collection. Please try again.
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={disabled || isPending || selectedUsers.length === 0}
              className="w-full"
            >
              {isPending ? "Sharing..." : "Share Collection"}
            </Button>
          </div>
        </form>
      </Form>
    </Scroller>
  );
}
