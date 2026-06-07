import { Skeleton } from "@/components/ui/skeleton";

export function GroupGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-hairline-strong bg-surface-card"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="grid gap-3 p-3">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GroupsPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-surface-card p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-5/6 max-w-2xl" />
        </div>
        <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
      </div>
      <GroupGridSkeleton />
    </div>
  );
}
