import { ReactNode } from "react";

import CollectionIdTabs from "@/app/(protected)/collection/[id]/_components/tabs";

function CollectionIdFileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CollectionIdTabs tab="tab-docs" />
      <div className="flex h-full w-full flex-col gap-6 border-x">
        {children}
      </div>
    </>
  );
}
export default CollectionIdFileLayout;
