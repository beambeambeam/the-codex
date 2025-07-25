import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";

import { $api } from "@/lib/api/client";
import { components } from "@/lib/api/path";

type Chat = components["schemas"]["CollectionChatResponse"];

interface ChatContextValue {
  chats: Chat[];
  isLoading: boolean;
  isError: boolean;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = (props: ChatProviderProps) => {
  const params = useParams<{ id: string }>();
  const { isPending, isError, data } = $api.useQuery("get", "/chats/", {
    params: {
      query: {
        collection_id: params.id,
      },
    },
  });

  const chats: Chat[] = data ?? [];

  return (
    <ChatContext.Provider
      value={{
        chats,
        isLoading: isPending,
        isError: !!isError,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx)
    throw new Error("useChatContext must be used within a ChatProvider");
  return ctx;
};
