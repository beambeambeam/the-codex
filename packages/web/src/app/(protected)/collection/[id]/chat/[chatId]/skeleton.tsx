import { Skeleton } from "@/components/ui/skeleton";

function ChatIdPageSkeleton() {
  return (
    <>
      <div className="h-full w-full">
        <div className="border-b p-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col gap-8 px-8 py-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-1 flex-col justify-end p-10">
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-12 w-full rounded-3xl" />
          <div className="flex justify-end pt-2">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatIdPageSkeleton;
