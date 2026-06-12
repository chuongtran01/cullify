import { Skeleton } from "@/components/ui/skeleton";

export function GroupDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-surface-card p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
