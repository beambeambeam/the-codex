import CollectionIdTabs from "@/app/(protected)/collection/[id]/_components/tabs";

function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CollectionIdTabs tab="tab-chat" />
      <div className="bg-background flex h-full w-full flex-col border-x">
        {children}
      </div>
    </>
  );
}
export default ChatLayout;
