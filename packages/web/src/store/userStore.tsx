"use client";

import React, { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { components } from "@/lib/api/path";

type UserState = components["schemas"]["UserResponse"];

interface UserActions {
  setUser: (user: UserState) => void;
  reset: () => void;
}

type UserStore = UserState & { actions: UserActions };

const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: UserState;
}

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [store] = useState(() =>
    createStore<UserStore>()(
      persist<UserStore>(
        (set) => ({
          id: initialUser?.id ?? "",
          username: initialUser?.username ?? "",
          email: initialUser?.email ?? "",
          created_at: initialUser?.created_at ?? "",
          actions: {
            setUser: (user) =>
              set({
                id: user.id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
              }),
            reset: () =>
              set({
                id: "",
                username: "",
                email: "",
                created_at: "",
              }),
          },
        }),
        {
          name: "user-storage",
        },
      ),
    ),
  );

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (state: UserStore) => T): T => {
  const store = useContext(UserStoreContext);
  if (!store) {
    throw new Error("Missing UserProvider");
  }
  return useStore(store, selector);
};

export const useUser = () =>
  useUserStore(useShallow(({ actions, ...state }) => ({ ...state })));

export const useUserActions = () => useUserStore((state) => state.actions);
