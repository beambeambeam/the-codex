import { NuqsAdapter } from "nuqs/adapters/next/app";

import { BreakpointIndicator } from "@/components/breakpoint-indicator";
import { ThemeProvider } from "@/provider/themes";

import "./global.css";

import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/provider/query";
import { UserProvider } from "@/store/userStore";

export const metadata = {
  title: "The Codex",
  description: "Your personal Librarian that handle every file for you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background h-full min-h-screen w-full antialiased">
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark"]}
          >
            <QueryProvider>
              <UserProvider
                initialUser={{
                  username: "User Alpha",
                  created_at: "2001-09-11T00:00:00.000Z",
                  email: "UserAlpha@Codex.com",
                  id: "7a94c97f-3496-4d06-891f-af8921d368a6",
                }}
              >
                {children}
                <Toaster expand position="top-center" richColors />
                <BreakpointIndicator />
              </UserProvider>
            </QueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
