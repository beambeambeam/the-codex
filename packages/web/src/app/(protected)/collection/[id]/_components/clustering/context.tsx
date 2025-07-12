import React from "react";
import type { ReactNode } from "react";
import { createStore, useStore } from "zustand";
import type { StoreApi } from "zustand";

import { Document } from "@/types";

interface TopicCluster {
  id: string;
  title: string;
  documents: Document[];
}

export interface Clustering {
  id: string;
  title: string;
  topics: TopicCluster[];
  documents: Document[];
}

interface ClusteringState {
  clusterings: Clustering[];
  isPending: boolean;
  isEmpty: boolean;
  isError: boolean;
}

interface ClusteringActions {
  setClusterings: (clusterings: Clustering[]) => void;
  addClustering: (clustering: Clustering) => void;
  setPending: (isPending: boolean) => void;
  setError: (isError: boolean) => void;
  reset: () => void;
  getClustering: (id: string) => Clustering | undefined;
  getAllClusterings: () => Clustering[];
}

type ClusteringStore = ClusteringState & { actions: ClusteringActions };

const ClusteringStoreContext =
  React.createContext<StoreApi<ClusteringStore> | null>(null);

interface ClusteringProviderProps {
  children: ReactNode;
  initialClusterings?: Clustering[];
}

export const ClusteringProvider = ({
  children,
  initialClusterings = [],
}: ClusteringProviderProps) => {
  const [store] = React.useState(() =>
    createStore<ClusteringStore>((set, get) => ({
      clusterings: initialClusterings,
      isPending: false,
      isEmpty: initialClusterings.length === 0,
      isError: false,
      actions: {
        setClusterings: (clusterings) =>
          set({
            clusterings,
            isEmpty: clusterings.length === 0,
            isError: false,
          }),
        addClustering: (clustering) =>
          set((state) => {
            const newClusterings = [...state.clusterings, clustering];
            return {
              clusterings: newClusterings,
              isEmpty: newClusterings.length === 0,
            };
          }),
        setPending: (isPending) => set({ isPending }),
        setError: (isError) => set({ isError }),
        reset: () =>
          set({
            clusterings: [],
            isPending: false,
            isEmpty: true,
            isError: false,
          }),
        getClustering: (id) => get().clusterings.find((c) => c.id === id),
        getAllClusterings: () => get().clusterings,
      },
    })),
  );
  return (
    <ClusteringStoreContext.Provider value={store}>
      {children}
    </ClusteringStoreContext.Provider>
  );
};

export const useClusteringStore = <T,>(
  selector: (state: ClusteringStore) => T,
): T => {
  const store = React.useContext(ClusteringStoreContext);
  if (!store) {
    throw new Error("Missing ClusteringProvider");
  }
  return useStore(store, selector);
};

export const useClusterings = () =>
  useClusteringStore((state) => state.clusterings);
export const useClusteringActions = () =>
  useClusteringStore((state) => state.actions);
export const useClusteringStatus = () =>
  useClusteringStore((state) => ({
    isPending: state.isPending,
    isEmpty: state.isEmpty,
    isError: state.isError,
  }));
