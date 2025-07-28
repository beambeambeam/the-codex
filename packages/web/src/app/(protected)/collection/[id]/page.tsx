"use client";

import ClusteringCanvas from "@/app/(protected)/collection/[id]/_components/clustering/canvas";
import CollectionIdTabs from "@/app/(protected)/collection/[id]/_components/tabs";

function CollectionIdPage() {
  return (
    <>
      <CollectionIdTabs tab="tab-overview" />
      <div className="h-full w-full border-x p-4">
        <ClusteringCanvas />
      </div>
    </>
  );
}
export default CollectionIdPage;
