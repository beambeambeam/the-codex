import CollectionIdSidebar from "@/app/(protected)/collection/[id]/_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CollectionIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <CollectionIdSidebar
        title={"LLM with SQL."}
        description={
          "Large Language Models (LLMs)—like ChatGPT, GPT-4, Claude, or others—in combination with Structured Query Language (SQL)."
        }
      />
      <SidebarInset>
        <main className="flex h-full shrink-0 items-start justify-start gap-2 p-3">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
