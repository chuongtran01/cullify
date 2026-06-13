import { Skeleton } from "@/components/ui/skeleton";

export function SelectedGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[4/3] rounded-md" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SelectedPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-hairline-strong pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
      </div>
      <SelectedGridSkeleton />
    </div>
  );
}
