"use client";

import { useEffect, useId, useState } from "react";
import { redirect, useParams } from "next/navigation";
import {
  FilePenIcon,
  MessageSquareIcon,
  PlusIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
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
import { useChatSearch } from "@/hooks/use-chat-search";
import { useDocumentSearch } from "@/hooks/use-document-search";

function CollectionIdSidebarSearchbox() {
  const id = useId();
  const params = useParams<{ id: string }>();

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

  const { searchResults: documentResults, isSearching: isDocumentSearching } =
    useDocumentSearch(inputValue || "", params.id);

  const { searchResults: chatResults, isSearching: isChatSearching } =
    useChatSearch(inputValue || "", params.id);

  const showLoading =
    (isSearching || isDocumentSearching || isChatSearching) &&
    inputValue &&
    inputValue.trim() !== "";

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
          <CommandEmpty>
            {showLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="h-4 w-4" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>

          {documentResults.length > 0 && (
            <CommandGroup heading="Documents">
              {documentResults.map((document) => (
                <CommandItem
                  key={document.id}
                  onSelect={() => {
                    setOpen(false);
                    redirect(`/collection/${params.id}/docs/${document.id}`);
                  }}
                >
                  <FilePenIcon className="mr-2 h-4 w-4" />
                  <span>{document.title || document.file_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {chatResults.length > 0 && (
            <CommandGroup heading="Chats">
              {chatResults.map((chat) => (
                <CommandItem
                  key={chat.id}
                  onSelect={() => {
                    setOpen(false);
                    redirect(`/collection/${params.id}/chat/${chat.id}`);
                  }}
                >
                  <MessageSquareIcon className="mr-2 h-4 w-4" />
                  <span>{chat.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* Static Actions */}
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                redirect(`/collection/${params.id}/chat`);
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>Create New Chat</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                redirect(`/collection/${params.id}/docs`);
              }}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              <span>Upload New File</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default CollectionIdSidebarSearchbox;
