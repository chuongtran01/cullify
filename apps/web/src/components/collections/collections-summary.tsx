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
          className="rounded-md border border-hairline-light bg-surface-card p-4"
        >
          <p className="font-mono text-xs font-normal uppercase tracking-wide text-slate">
            {label}
          </p>
          <p className="mt-3 text-2xl font-normal text-ink">{value}</p>
        </div>
      ))}
    </section>
  );
}
