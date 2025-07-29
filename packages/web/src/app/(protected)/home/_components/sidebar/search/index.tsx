"use client";

import { useEffect, useId, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { FolderOpenIcon, SearchIcon } from "lucide-react";

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
import { useCollectionSearch } from "@/hooks/use-collection-search";

function HomeSidebarSearchbox() {
  const id = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { searchResults, isSearching, handleSearch } = useCollectionSearch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim()) {
        handleSearch(inputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, handleSearch]);

  const handleSelect = (collectionId: string) => {
    setOpen(false);
    setInputValue("");
    router.push(`/collection/${collectionId}`);
  };

  return (
    <>
      <div>
        <div className="*:not-first:mt-2">
          <div className="relative">
            <Input
              id={id}
              className="peer ps-9"
              placeholder="Search for Library"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onClick={() => setOpen(true)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? "Searching..." : "No results found."}
          </CommandEmpty>
          {searchResults.length > 0 && (
            <CommandGroup heading="Collections">
              {searchResults.map((collection) => (
                <CommandItem
                  key={collection.id}
                  onSelect={() => handleSelect(collection.id)}
                >
                  <FolderOpenIcon className="mr-2 h-4 w-4" />
                  <span>{collection.name}</span>
                  {collection.description && (
                    <span className="text-muted-foreground ml-2">
                      - {collection.description}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                redirect("/home?new=true");
              }}
            >
              Create New Collections
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default HomeSidebarSearchbox;
