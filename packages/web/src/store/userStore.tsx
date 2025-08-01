"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { fetchClient } from "@/lib/api/client";
import { components } from "@/lib/api/path";

type UserState = components["schemas"]["UserResponse"];

interface UserStoreState {
  user: UserState | null;
  isPending: boolean;
  isError: boolean;
  error: string | null;
}

interface UserActions {
  setUser: (user: UserState) => void;
  login: (credentials: {
    username: string;
    password: string;
    remember_me?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    remember_me?: boolean;
  }) => Promise<void>;
  reset: () => void;
  setPending: (isPending: boolean) => void;
  setError: (error: string | null) => void;
}

type UserStore = UserStoreState & { actions: UserActions };

const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: UserState;
}

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [store] = useState(() =>
    createStore<UserStore>()(
      persist(
        (set, get) => ({
          user: initialUser || null,
          isPending: false,
          isError: false,
          error: null,
          actions: {
            setUser: (user) =>
              set({
                user,
                isError: false,
                error: null,
              }),
            login: async (credentials) => {
              const { setPending, setError, setUser } = get().actions;

              setPending(true);
              setError(null);

              try {
                const response = await fetchClient.POST("/auth/login", {
                  body: credentials,
                });

                if (!response.data) {
                  throw new Error("Login failed");
                }

                setUser(response.data.user);
                setPending(false);
              } catch (error) {
                const message =
                  typeof error === "object" &&
                  error !== null &&
                  "detail" in error
                    ? (error as { detail?: string }).detail ||
                      "Login failed. Please try again."
                    : "Login failed. Please try again.";

                setError(message);
                setPending(false);
                throw error;
              }
            },
            logout: async () => {
              const { setPending, setError, reset } = get().actions;

              setPending(true);
              setError(null);

              try {
                await fetchClient.POST("/auth/logout");
                reset();
                setPending(false);
              } catch (error) {
                const message =
                  typeof error === "object" &&
                  error !== null &&
                  "detail" in error
                    ? (error as { detail?: string }).detail ||
                      "Logout failed. Please try again."
                    : "Logout failed. Please try again.";

                setError(message);
                setPending(false);
                throw error;
              }
            },
            register: async (userData) => {
              const { setPending, setError } = get().actions;

              setPending(true);
              setError(null);

              try {
                await fetchClient.POST("/auth/register", {
                  body: userData,
                });

                setPending(false);
              } catch (error) {
                const message =
                  typeof error === "object" &&
                  error !== null &&
                  "detail" in error
                    ? (error as { detail?: string }).detail ||
                      "Registration failed. Please try again."
                    : "Registration failed. Please try again.";

                setError(message);
                setPending(false);
                throw error;
              }
            },
            reset: () =>
              set({
                user: null,
                isError: false,
                error: null,
              }),
            setPending: (isPending) => set({ isPending }),
            setError: (error) => set({ error, isError: !!error }),
          },
        }),
        {
          name: "user-storage",
          partialize: (state) => ({ user: state.user }),
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
  useUserStore(
    useShallow(({ user, isPending, isError, error, actions }) => ({
      user,
      isPending,
      isError,
      error,
      actions,
    })),
  );

export const useUserActions = () => useUserStore((state) => state.actions);

// Hook for login with redirect
export const useLogin = () => {
  const { login } = useUserActions();
  const router = useRouter();

  return {
    login: async (credentials: {
      username: string;
      password: string;
      remember_me?: boolean;
    }) => {
      await login(credentials);
      router.push("/home");
    },
  };
};

// Hook for logout with redirect
export const useLogout = () => {
  const { logout } = useUserActions();
  const router = useRouter();

  return {
    logout: async () => {
      await logout();
      router.push("/sign-in");
    },
  };
};
