import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CollectionIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <main className="flex h-full shrink-0 items-start justify-start gap-2 p-3">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
