import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionIdSkeleton() {
  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-row items-center justify-between p-4">
            <Skeleton className="h-10 w-20 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </SidebarHeader>
          <SidebarSeparator />
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-4 group-data-[collapsible=icon]:overflow-hidden">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-4 w-40" />
            <SidebarSeparator />
            <div className="flex w-full gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-9" />
            </div>
            <SidebarGroup className="flex flex-col gap-2 p-0">
              {/* Simulate tree or chat history skeletons */}
              {Array.from({ length: 6 }).map((_, i) => (
                <SidebarMenuSkeleton key={i} showIcon />
              ))}
            </SidebarGroup>
          </div>
        </Sidebar>
        <SidebarInset>
          <main className="flex h-full w-full shrink-0 flex-col items-start justify-start px-3 pt-3">
            <div className="mb-2 flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="mb-4 flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="h-[500px] w-full border-l p-4">
              <Skeleton className="h-full w-full" />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
