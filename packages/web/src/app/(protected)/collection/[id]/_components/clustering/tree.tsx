"use client";

import { useClusterings } from "@/app/(protected)/collection/[id]/_components/clustering/context";

function ClusteringTree() {
  const clustering = useClusterings();

  return <div>ClusteringTree</div>;
}
export default ClusteringTree;
