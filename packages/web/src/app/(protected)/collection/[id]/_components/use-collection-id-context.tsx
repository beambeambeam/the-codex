"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

interface CollectionIdContextProps {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

const CollectionIdContext = createContext<CollectionIdContextProps | undefined>(
  undefined,
);

export function CollectionIdProvider({
  initialTitle = "",
  initialDescription,
  children,
}: {
  initialTitle?: string;
  initialDescription?: string;
  children: ReactNode;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(
    initialDescription ?? "No description yet!",
  );

  return (
    <CollectionIdContext.Provider
      value={{ title, description, setTitle, setDescription }}
    >
      {children}
    </CollectionIdContext.Provider>
  );
}

export function useCollectionIdContext() {
  const context = useContext(CollectionIdContext);
  if (!context) {
    throw new Error(
      "useCollectionIdContext must be used within a CollectionIdProvider",
    );
  }
  return context;
}
