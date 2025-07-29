"use client";

import { useEffect, useId, useState } from "react";
import { redirect } from "next/navigation";
import { FolderOpenIcon, LibraryBigIcon, SearchIcon } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useCollectionSearch } from "@/hooks/use-collection-search";

function HomeSidebarSearchbox() {
  const id = useId();
  const [open, setOpen] = useQueryState("s", parseAsBoolean.withDefault(false));
  const [inputValue, setInputValue] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [localInputValue, setLocalInputValue] = useState(inputValue || "");
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setInputValue(value);
    setIsSearching(false);
  }, 300);

  const handleInputChange = (value: string) => {
    setLocalInputValue(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (open) {
      setLocalInputValue(inputValue || "");
    }
  }, [open, inputValue]);

  const { searchResults, isSearching: isApiSearching } = useCollectionSearch(
    inputValue || "",
  );

  const showLoading =
    (isSearching || isApiSearching) && inputValue && inputValue.trim() !== "";

  return (
    <>
      <div>
        <div className="*:not-first:mt-2">
          <div className="relative">
            <Input
              id={id}
              className="peer ps-9"
              placeholder="Search in collections"
              type="text"
              onClick={() => setOpen(true)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Type a command or search..."
          value={localInputValue}
          onValueChange={handleInputChange}
        />
        <CommandList>
          {inputValue.trim() === "" && !showLoading && (
            <div className="flex items-center justify-center py-6">
              <div className="text-muted-foreground text-center">
                Search the Collections titles
              </div>
            </div>
          )}

          {showLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader className="h-4 w-4" />
              <span className="ml-2">Searching...</span>
            </div>
          )}

          {inputValue.trim() !== "" &&
            !showLoading &&
            searchResults.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

          {searchResults.length > 0 && (
            <CommandGroup heading="Collections">
              {searchResults.map((collection) => (
                <CommandItem
                  key={collection.id}
                  onSelect={() => {
                    redirect(`/collection/${collection.id}`);
                  }}
                >
                  <FolderOpenIcon className="mr-2 h-4 w-4" />
                  <span>{collection.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* Static Actions */}
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                redirect("/home?new=true");
              }}
            >
              <LibraryBigIcon className="mr-2 h-4 w-4" />
              <span>Create New Collection</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default HomeSidebarSearchbox;
