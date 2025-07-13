"use client";

import { HomeProvider } from "@/app/(protected)/home/_components/context";
import HomeSidebar from "@/app/(protected)/home/_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeProvider initialCollections={[]}>
      <SidebarProvider>
        <HomeSidebar />
        <SidebarInset>
          <main className="flex h-full shrink-0 items-start justify-start gap-2 p-3">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </HomeProvider>
  );
}
