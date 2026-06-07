import { Skeleton } from "@/components/ui/skeleton";

type CollectionsSummaryProps = {
  totalCollections: number;
  needsReview: number;
  processing: number;
  totalPhotos: number;
};

export function CollectionsSummary({
  totalCollections,
  needsReview,
  processing,
  totalPhotos,
}: CollectionsSummaryProps) {
  const stats = [
    ["Total Collections", totalCollections],
    ["Needs Review", needsReview],
    ["Processing", processing],
    ["Total Photos", totalPhotos.toLocaleString()],
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(([label, value]) => (
        <div
          key={label}
          className="rounded-lg border border-hairline-strong bg-surface-card p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
        </div>
      ))}
    </section>
  );
}

export function CollectionsSummarySkeleton() {
  return (
    <section
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Loading collection summary"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-hairline-strong bg-surface-card p-4"
        >
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-8 w-12" />
        </div>
      ))}
    </section>
  );
}
