import React from "react";
import type { ReactNode } from "react";
import { createStore, useStore } from "zustand";
import type { StoreApi } from "zustand";

import { generateGraphNodes } from "@/app/(protected)/collection/[id]/_components/clustering/canvas/generate";
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

export interface GraphNode {
  id: string;
  type?: string;
  data: { label: string };
  position: { x: number; y: number };
  style?: React.CSSProperties;
  parentId?: string;
  extent?: "parent";
}

interface ClusteringActions {
  setClusterings: (clusterings: Clustering[]) => void;
  addClustering: (clustering: Clustering) => void;
  setPending: (isPending: boolean) => void;
  setError: (isError: boolean) => void;
  reset: () => void;
  getClustering: (id: string) => Clustering | undefined;
  getAllClusterings: () => Clustering[];
  clusteringToTree: (clustering: Clustering) => Record<string, Item>;
  clusteringToGraph: (clustering: Clustering) => GraphNode[];
}
// Item interface for tree transformation
export interface Item {
  id: string;
  name: string;
  children?: string[];
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
        clusteringToTree: (clustering) => {
          const items: Record<string, Item> = {
            root: {
              id: "root",
              name: "root",
              children: clustering.topics.map((t) => t.id),
            },
          };

          for (const topic of clustering.topics) {
            items[topic.id] = {
              id: `id-${topic.title}`,
              name: topic.title,
              children:
                topic.documents.length > 0
                  ? topic.documents.map((d) => d.id)
                  : [],
            };

            for (const doc of topic.documents) {
              items[doc.id] = {
                id: doc.id,
                name: doc.file_name || doc.id,
                children: [],
              };
            }
          }
          return items;
        },
        clusteringToGraph: generateGraphNodes,
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
