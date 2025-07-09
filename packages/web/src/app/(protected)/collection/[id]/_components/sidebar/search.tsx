"use client";

import { useId, useState } from "react";
import { FilePenIcon, SearchIcon } from "lucide-react";

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

function CollectionIdSidebarSearchbox() {
  const id = useId();

  const [open, setOpen] = useState(false);

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
              onClick={() => setOpen(true)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Documents Suggestions">
            <CommandItem>
              <FilePenIcon />
              <span>Document #1</span>
            </CommandItem>
            <CommandItem>
              <FilePenIcon />
              <span>Document #2</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default CollectionIdSidebarSearchbox;
