"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Mock user data for mentions
const MOCK_USERS = [
  { id: "1", name: "John Doe", email: "john.doe@example.com", avatar: "" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com", avatar: "" },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: "",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    avatar: "",
  },
];

type MentionUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type Mention = {
  id: string;
  user: MentionUser;
  startIndex: number;
  endIndex: number;
};

type ChatInputWithMentionsProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number | string;
};

export function ChatInputWithMentions({
  value = "",
  onValueChange,
  onSubmit,
  placeholder = "Type @ to mention someone...",
  disabled = false,
  className,
  maxHeight = 240,
}: ChatInputWithMentionsProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [mentionDropdown, setMentionDropdown] = useState({
    isOpen: false,
    searchTerm: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [internalValue, maxHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        setMentionDropdown({
          isOpen: true,
          searchTerm,
        });
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

  const handleSelectUser = (user: MentionUser) => {
    if (!textareaRef.current) return;

    const cursorPos = textareaRef.current.selectionStart;
    const beforeCursor = internalValue.slice(0, cursorPos);
    const afterCursor = internalValue.slice(cursorPos);

    const atIndex = beforeCursor.lastIndexOf("@");
    if (atIndex !== -1) {
      const newValue =
        beforeCursor.slice(0, atIndex) + `@${user.name} ` + afterCursor;
      setInternalValue(newValue);
      onValueChange?.(newValue);

      // Add mention to the list
      const mentionId = `mention_${Date.now()}`;
      const newMention: Mention = {
        id: mentionId,
        user,
        startIndex: atIndex,
        endIndex: atIndex + user.name.length,
      };
      setMentions((prev) => [...prev, newMention]);

      // Set cursor position after the mention
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = atIndex + user.name.length + 2; // +2 for @ and space
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);

      // Close dropdown
      setMentionDropdown((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(mentionDropdown.searchTerm.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(mentionDropdown.searchTerm.toLowerCase()),
  );

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
          <Textarea
            ref={textareaRef}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />

          {/* Mention Dropdown */}
          {mentionDropdown.isOpen && filteredUsers.length > 0 && (
            <div
              className="bg-background border-border absolute z-50 max-h-48 overflow-y-auto rounded-lg border shadow-lg"
              style={{
                left: "0",
                bottom: "100%",
                marginBottom: "8px",
                minWidth: "200px",
              }}
            >
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-left"
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {user.email}
                    </span>
                  </div>
                </button>
              ))}
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

        {/* Mention Badges */}
        {mentions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mentions.map((mention) => (
              <Badge key={mention.id} variant="secondary" className="text-xs">
                @{mention.user.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
