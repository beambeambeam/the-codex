"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon, FileTextIcon, XIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextareaAutosize } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchClient } from "@/lib/api/client";
import { components } from "@/lib/api/path";
import { cn } from "@/lib/utils";

export type Document = Omit<
  components["schemas"]["DocumentDetailResponse"],
  "chunks" | "relations"
>;

type Mention = {
  id: string;
  document: Document;
  startIndex: number;
  endIndex: number;
};

type ChatInputWithMentionsProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  onReferencesChange?: (references: string[]) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number | string;
  collectionId: string;
};

export function ChatInputWithMentions({
  value = "",
  onValueChange,
  onReferencesChange,
  onSubmit,
  placeholder = "Type @ and then type document name to mention...",
  disabled = false,
  className,
  maxHeight = 240,
  collectionId,
}: ChatInputWithMentionsProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [mentionDropdown, setMentionDropdown] = useState({
    isOpen: false,
    searchTerm: "",
    documents: [] as Document[],
    loading: false,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Update references when mentions change
  useEffect(() => {
    const references = mentions.map((mention) => mention.document.id);
    onReferencesChange?.(references);
  }, [mentions, onReferencesChange]);

  const searchDocuments = async (query: string) => {
    if (!query.trim() || query.trim().length < 2) return [];

    try {
      const response = await fetchClient.GET(
        "/documents/collection/{collection_id}/documents/search",
        {
          params: {
            path: { collection_id: collectionId },
            query: { query },
          },
        },
      );

      if (response.data) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onValueChange?.(newValue);

    const cursorPos = e.target.selectionStart;
    const beforeCursor = newValue.slice(0, cursorPos);
    const atIndex = beforeCursor.lastIndexOf("@");

    // Check if @ was just typed or if we're in a mention context
    if (atIndex !== -1) {
      const searchTerm = beforeCursor.slice(atIndex + 1);

      // Open dropdown if @ was just typed or if we're still typing after @
      if (
        !mentionDropdown.isOpen ||
        searchTerm !== mentionDropdown.searchTerm
      ) {
        setMentionDropdown((prev) => ({
          ...prev,
          isOpen: true,
          searchTerm,
          loading: true,
        }));

        // Search for documents
        const documents = await searchDocuments(searchTerm);
        setMentionDropdown((prev) => ({
          ...prev,
          documents: documents || [],
          loading: false,
        }));
      }
    } else {
      // Close dropdown if no @ found
      if (mentionDropdown.isOpen) {
        setMentionDropdown((prev) => ({ ...prev, isOpen: false }));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }

    // Handle escape to close mention dropdown
    if (e.key === "Escape") {
      setMentionDropdown((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleSelectDocument = (document: Document) => {
    if (!textareaRef.current) return;

    const cursorPos = textareaRef.current.selectionStart;
    const beforeCursor = internalValue.slice(0, cursorPos);
    const afterCursor = internalValue.slice(cursorPos);

    const atIndex = beforeCursor.lastIndexOf("@");
    if (atIndex !== -1) {
      const newValue =
        beforeCursor.slice(0, atIndex) +
        `@${document.file_name} ` +
        afterCursor;
      setInternalValue(newValue);
      onValueChange?.(newValue);

      // Add mention to the list
      const mentionId = `mention_${Date.now()}`;
      const newMention: Mention = {
        id: mentionId,
        document,
        startIndex: atIndex,
        endIndex: atIndex + document.file_name.length,
      };
      setMentions((prev) => [...prev, newMention]);

      // Set cursor position after the mention
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = atIndex + document.file_name.length + 2; // +2 for @ and space
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);

      // Close dropdown
      setMentionDropdown((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleRemoveMention = (mentionId: string) => {
    setMentions((prev) => prev.filter((mention) => mention.id !== mentionId));
  };

  return (
    <TooltipProvider>
      <div className="flex w-full flex-col gap-2">
        <div
          className={cn(
            "border-input bg-background relative cursor-text rounded-3xl border p-2 shadow-xs",
            className,
          )}
          onClick={() => textareaRef.current?.focus()}
        >
          <TextareaAutosize
            ref={textareaRef}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="text-primary min-h-[44px] w-full resize-none border-none bg-transparent break-words whitespace-pre-wrap shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            minRows={1}
            maxRows={10}
          />

          {/* Document Mention Dropdown */}
          {mentionDropdown.isOpen && mentionDropdown.searchTerm.length >= 2 && (
            <div
              className="bg-background border-border absolute z-50 max-h-48 overflow-y-auto rounded-lg border shadow-lg"
              style={{
                left: "0",
                bottom: "100%",
                marginBottom: "8px",
                minWidth: "250px",
              }}
            >
              {mentionDropdown.loading ? (
                <div className="text-muted-foreground flex items-center justify-center px-3 py-2 text-sm">
                  Searching documents...
                </div>
              ) : mentionDropdown.documents.length > 0 ? (
                mentionDropdown.documents.map((document) => (
                  <button
                    key={document.id}
                    className="hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-left"
                    onClick={() => handleSelectDocument(document)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        <FileTextIcon className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {document.title}{" "}
                        <span className="text-muted-foreground">
                          ({document.file_name})
                        </span>
                      </span>
                      {document.description && (
                        <span className="text-muted-foreground text-xs">
                          {document.description}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                mentionDropdown.searchTerm && (
                  <div className="text-muted-foreground px-3 py-2 text-sm">
                    No documents found. Try typing more characters.
                  </div>
                )
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Tooltip>
              <TooltipTrigger asChild disabled={disabled}>
                <Button
                  variant="default"
                  size="icon"
                  aria-label="Send message"
                  className="rounded-full"
                  disabled={disabled || !internalValue.trim()}
                  onClick={onSubmit}
                >
                  <ArrowUpRightIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Document Mention Badges */}
        {mentions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mentions.map((mention) => (
              <Badge
                key={mention.id}
                variant="secondary"
                className="flex items-center gap-1 text-xs"
              >
                {mention.document.title || mention.document.file_name}
                <button
                  onClick={() => handleRemoveMention(mention.id)}
                  className="hover:bg-muted ml-1 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove mention of ${mention.document.title || mention.document.file_name}`}
                >
                  <XIcon className="h-3 w-3 cursor-pointer" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
