"use client";

import { useId } from "react";
import { redirect, useParams } from "next/navigation";
import { FilePenIcon, SearchIcon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

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
  const params = useParams<{ id: string }>();

  const [open, setOpen] = useQueryState("s", parseAsBoolean.withDefault(false));

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
          <CommandGroup heading="Command Suggestions">
            <CommandItem
              onSelect={() => redirect(`/collection/${params.id}/docs`)}
            >
              <FilePenIcon />
              <span>Create new chat</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default CollectionIdSidebarSearchbox;
