"use client";

import React, { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { components } from "@/lib/api/path";

interface HomeState {
  collections: components["schemas"]["CollectionResponse"][];
  isPending: boolean;
}

interface HomeAction {
  addCollections: (
    collections: components["schemas"]["CollectionResponse"][],
  ) => void;
  setCollections: (
    collections: components["schemas"]["CollectionResponse"][],
  ) => void;
  resetCollections: () => void;
  setIsPending: (value: boolean) => void;
}

type HomeStore = HomeState & { actions: HomeAction };

const HomeStoreContext = createContext<StoreApi<HomeStore> | null>(null);

interface HomeProviderProps {
  children: React.ReactNode;
  initialCollections?: components["schemas"]["CollectionResponse"][];
  initialIsPending?: boolean;
}

export const HomeProvider = ({
  children,
  initialCollections = [],
  initialIsPending = true,
}: HomeProviderProps) => {
  const [store] = useState(() =>
    createStore<HomeStore>()((set) => ({
      collections: initialCollections,
      isPending: initialIsPending,
      actions: {
        addCollections: (collections) =>
          set((state) => ({
            collections: [...state.collections, ...collections],
          })),
        setCollections: (collections) =>
          set({
            collections: Array.isArray(collections)
              ? collections
              : [collections],
          }),
        resetCollections: () => set({ collections: [] }),
        setIsPending: (value: boolean) => set({ isPending: value }),
      },
    })),
  );

  return (
    <HomeStoreContext.Provider value={store}>
      {children}
    </HomeStoreContext.Provider>
  );
};

export const useHomeStore = <T,>(selector: (state: HomeStore) => T): T => {
  const store = useContext(HomeStoreContext);
  if (!store) {
    throw new Error("Missing HomeProvider");
  }
  return useStore(store, selector);
};

export const useHome = () =>
  useHomeStore(useShallow((state) => ({ ...state })));

export const useHomeActions = () => useHomeStore((state) => state.actions);
