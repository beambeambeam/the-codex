"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { fetchClient } from "@/lib/api/client";
import { components } from "@/lib/api/path";

interface HomeState {
  collections: components["schemas"]["CollectionResponse"][];
  isPending: boolean;
  isError: boolean;
}

interface HomeAction {
  addCollections: (
    collections: components["schemas"]["CollectionResponse"][],
  ) => void;
  setCollections: (
    collections: components["schemas"]["CollectionResponse"][],
  ) => void;
  resetCollections: () => void;
  fetch: () => Promise<void>;
}

type HomeStore = HomeState & { actions: HomeAction };

const HomeStoreContext = createContext<StoreApi<HomeStore> | null>(null);

interface HomeProviderProps {
  children: React.ReactNode;
  initialCollections?: components["schemas"]["CollectionResponse"][];
}

export const HomeProvider = ({
  children,
  initialCollections = [],
}: HomeProviderProps) => {
  const [store] = useState(() =>
    createStore<HomeStore>()((set) => ({
      collections: initialCollections,
      isPending: true,
      isError: false,
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
        fetch: async () => {
          set({
            isPending: true,
          });

          const response = await fetchClient.GET("/collections/");

          set({
            collections: response?.data ?? [],
            isPending: false,
          });
        },
      },
    })),
  );

  useEffect(() => {
    store.getState().actions.fetch();
  }, [store]);

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
  useHomeStore(useShallow(({ actions, ...state }) => state));

export const useHomeActions = () => useHomeStore((state) => state.actions);
