"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ChevronDown, Square } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import { Markdown } from "@/components/ui/markdown";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { useTextStream } from "@/components/ui/response-stream";
import { getFileIcon } from "@/lib/files";
import type { ChatCollection, ChatMessage, Document } from "@/types";

import { MOCK_CHAT_COLLECTION, MOCK_CHAT_HISTORY } from "../__mock__/chat";
import { MOCK_DOCUMENTS } from "../__mock__/documents";

export default function ChatPage() {
  // const params = useParams();
  const params = { id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d" }; // Mocking useParams for demonstration
  const { id } = params;

  const chatData: ChatCollection | undefined = useMemo(() => {
    const data = MOCK_CHAT_COLLECTION.find((chat) => chat.id === id);
    if (!data) return undefined;
    if (data.id === MOCK_CHAT_HISTORY.id) {
      return { ...data, history: MOCK_CHAT_HISTORY.history };
    }
    return { ...data, history: [] };
  }, [id]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
    chatData?.history ?? [],
  );
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastAssistantMessageId, setLastAssistantMessageId] = useState<
    string | null
  >(null);

  // Auto complete stated
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteQuery, setAutocompleteQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: now,
      created_by: "0ea38322-4d8b-4a63-af9e-2dd31cf9db2e",
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputText("");

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `
# Exploring Transformer Architectures in Natural Language Processing

Natural Language Processing (NLP) has experienced rapid advancements due to the introduction of transformer-based models. One of the foundational works in this domain is the **Attention Is All You Need** paper by Vaswani et al. (2017), which introduced the transformer model architecture.

## Key Concepts

### Self-Attention Mechanism
The **self-attention** mechanism allows the model to weigh the importance of different words in a sequence when encoding a particular word, enabling it to capture contextual relationships more effectively.

### Positional Encoding
Since transformer models lack recurrence, positional encodings are added to input embeddings to retain the order of sequences.

## Example: Positional Encoding Formula

The positional encoding for each position and dimension is defined as:

1 + 1 = 2

where:
- (pos) is the position index
- (i) is the dimension index
- (d_{model}) is the embedding size

## Code Example: Simple Self-Attention in Python

\`\`\`python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    scores = torch.matmul(Q, K.transpose(-2, -1)) / Q.size(-1)**0.5
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V)
\`\`\`

## References

- Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). *Attention is all you need*. In *Advances in Neural Information Processing Systems* (pp. 5998-6008). [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)


`,
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: now,
      created_by: "0ea38322-4d8b-4a63-af9e-2dd31cf9db2e",
    };

    setChatHistory((prev) => [...prev, assistantMessage]);
    setLastAssistantMessageId(assistantMessage.id);
    setIsLoading(true);
    setIsStreaming(true);

    setTimeout(() => {
      setIsLoading(false);
      // You can decide if/when to set streaming false depending on your actual stream state logic
      setIsStreaming(true);
    }, 2000);
  };

  // Handle input change for auto-complete
  useEffect(() => {
    const cursor = cursorPosition;
    const value = inputText;

    // Find last '@' before cursor
    const triggerIndex = value.lastIndexOf("@", cursor - 1);

    if (triggerIndex !== -1) {
      // Extract the substring after '@' up to the cursor
      const query = value.substring(triggerIndex + 1, cursor);

      // Only show autocomplete if there's no space in the query
      if (!query.includes(" ")) {
        setAutocompleteQuery(query);
        setShowAutocomplete(true);
        return;
      }
    }

    // Otherwise, hide autocomplete
    setAutocompleteQuery("");
    setShowAutocomplete(false);
  }, [inputText, cursorPosition]);

  // Filter documents based on the autocomplete query
  const filteredDocuments = useMemo(() => {
    if (!autocompleteQuery) return [];
    return MOCK_DOCUMENTS.filter((doc) =>
      doc.file_name.toLowerCase().includes(autocompleteQuery.toLowerCase()),
    );
  }, [autocompleteQuery]);

  // Mention syntax helper
  const mentionSyntax = (doc: Document) => `@[${doc.id}|${doc.file_name}]`;

  // Handle document selection
  const handleSelectDocument = (doc: Document) => {
    const beforeCursor = inputText.substring(0, cursorPosition);
    const afterCursor = inputText.substring(cursorPosition);

    const triggerIndex = beforeCursor.lastIndexOf("@");
    const mentionText = mentionSyntax(doc);

    const newText =
      beforeCursor.substring(0, triggerIndex) + mentionText + " " + afterCursor;

    setInputText(newText);
    setShowAutocomplete(false);

    // Update cursor position to after inserted mention plus space
    const newCursorPos = (
      beforeCursor.substring(0, triggerIndex) +
      mentionText +
      " "
    ).length;
    setCursorPosition(newCursorPos);

    // Optionally, you can set focus back to input and set cursor position manually with a ref
  };
  if (!chatData) {
    return <div>Chat not found</div>;
  }
  return (
    <div className="bg-background flex h-[calc(100vh-8rem)] w-full flex-col">
      <header className="border-b p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-0">
              <h1 className="text-xl font-bold">{chatData.title}</h1>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="p-2">
              <p className="font-bold">{chatData.title}</p>
              <p className="text-muted-foreground text-sm">
                {chatData.description}
              </p>
              <div className="text-muted-foreground mt-2 text-xs">
                <p>Updated by: {chatData.updated_by}</p>
                <p>
                  Updated at:{" "}
                  {formatDistanceToNow(new Date(chatData.updated_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="my-2 border-t" />
            <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
              Other Chats
            </div>
            {MOCK_CHAT_COLLECTION.filter((c) => c.id !== chatData.id).map(
              (chat) => (
                <DropdownMenuItem
                  key={chat.id}
                  onClick={() => {
                    window.location.href = `/collection/${chat.collection_id}/chat/${chat.id}`;
                  }}
                >
                  {chat.title}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main ref={chatRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {chatHistory.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            chatRef={chatRef}
            isLoading={
              isLoading &&
              message.role === "assistant" &&
              message.id === lastAssistantMessageId
            }
            isStreaming={
              isStreaming &&
              message.role === "assistant" &&
              message.id === lastAssistantMessageId
            }
          />
        ))}
      </main>

      <footer className="flex w-full justify-center p-6">
        <div className="relative w-1/2">
          <PromptInput
            value={inputText}
            onValueChange={(value) => setInputText(value)}
            onCursorChange={(pos) => setCursorPosition(pos)}
            isLoading={isLoading}
            onSubmit={handleSend}
            className="w-full"
          >
            <PromptInputTextarea placeholder="Type @ to mention a document..." />

            {showAutocomplete && (
              <div className="bg-background absolute bottom-20 left-0 z-50 w-full rounded-lg border shadow-md">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
                      onClick={() => handleSelectDocument(doc)}
                    >
                      {getFileIcon({
                        file: {
                          name: doc.file_name,
                          type: doc.file_type,
                        },
                      })}
                      {doc.file_name}
                    </button>
                  ))
                ) : (
                  <div className="text-muted-foreground px-4 py-2 text-sm">
                    No results found
                  </div>
                )}
              </div>
            )}

            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction
                tooltip={isLoading ? "Stop generation" : "Send message"}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="absolute right-0 h-8 w-8 -translate-y-1/2 rounded-full"
                  onClick={handleSend}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Square className="size-5 fill-current" />
                  ) : (
                    <ArrowUpRight className="size-5" />
                  )}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </footer>
    </div>
  );
}

// Component to render each message
interface ChatMessageProps {
  message: ChatMessage;
  chatRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isStreaming: boolean;
}

function ChatMessage({
  message,
  chatRef,
  isLoading,
  isStreaming,
}: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const shouldStream = isAssistant && isStreaming;

  const { displayedText, startStreaming } = useTextStream({
    textStream: message.content,
    mode: "typewriter",
    speed: 50,
  });

  // Start streaming effect when isStreaming is true
  useEffect(() => {
    if (shouldStream) startStreaming();
  }, [startStreaming, shouldStream]);

  // Scroll to bottom whenever streaming text updates
  useEffect(() => {
    if (shouldStream && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [displayedText, shouldStream, chatRef]);

  return (
    <div
      className={`flex items-start gap-4 ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/static/logo/icon.svg" alt="Assistant" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {isLoading ? (
          <Loader variant="text-shimmer" text="Fetching Documents..." />
        ) : isAssistant ? (
          shouldStream ? (
            <Markdown className="prose">{displayedText}</Markdown>
          ) : (
            <Markdown className="prose">{message.content}</Markdown>
          )
        ) : (
          <Markdown className="text-xs">{message.content}</Markdown>
        )}
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
