import { Skeleton } from "@/components/ui/skeleton";

export function LowQualityGridSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        <Skeleton className="aspect-[4/3] rounded-md" />
        <div className="mt-4 grid gap-4">
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <div className="min-w-0 border-hairline-strong lg:border-l lg:pl-6">
        <div className="grid gap-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-3 border-b border-hairline py-3"
            >
              <Skeleton className="aspect-[4/3] rounded-md" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LowQualityPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-hairline-strong pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-5/6 max-w-2xl" />
        </div>
        <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <LowQualityGridSkeleton />
    </div>
  );
}
