type BatchesSummaryProps = {
  totalBatches: number;
  needsReview: number;
  processing: number;
  totalPhotos: number;
};

export function BatchesSummary({
  totalBatches,
  needsReview,
  processing,
  totalPhotos,
}: BatchesSummaryProps) {
  const stats = [
    ["Total Batches", totalBatches],
    ["Needs Review", needsReview],
    ["Processing", processing],
    ["Total Photos", totalPhotos.toLocaleString()],
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(([label, value]) => (
        <div
          key={label}
          className="rounded-md border border-hairline bg-surface-card p-4"
        >
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
        </div>
      ))}
    </section>
  );
}
