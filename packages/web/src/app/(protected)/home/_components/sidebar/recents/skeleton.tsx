import { Skeleton } from "@/components/ui/skeleton";

export function HomeSidebarRecentsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="mb-2 h-4 w-32" />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
