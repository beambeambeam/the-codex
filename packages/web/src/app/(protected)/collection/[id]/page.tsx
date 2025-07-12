"use client";

import { useClusterings } from "@/app/(protected)/collection/[id]/_components/clustering/context";

function CollectionIdPage() {
  const clustering = useClusterings();

  return (
    <div className="h-full w-full border-l p-4">
      {clustering.map((cluster) => cluster.title)}
    </div>
  );
}
export default CollectionIdPage;
