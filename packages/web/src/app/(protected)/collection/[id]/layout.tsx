import CollectionIdSidebar from "@/app/(protected)/collection/[id]/_components/sidebar";

export default function CollectionIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <CollectionIdSidebar
        title={"LLM with SQL."}
        description={
          "Large Language Models (LLMs)—like ChatGPT, GPT-4, Claude, or others—in combination with Structured Query Language (SQL)."
        }
      />
      <main className="flex h-full shrink-0 items-start justify-start gap-2 p-3">
        {children}
      </main>
    </div>
  );
}
