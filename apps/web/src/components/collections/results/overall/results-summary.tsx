import { Skeleton } from "@/components/ui/skeleton";
import type { CollectionResultsSummary } from "@/services/collections";

function SummaryStat({
  label,
  value,
  helper,
  isLoading = false,
}: {
  label: string;
  value: string | number;
  helper: string;
  isLoading?: boolean;
}) {
  return (
    <div className="border-t border-hairline-strong py-5 md:border-l md:first:border-l-0 md:px-6 md:first:pl-0">
      <p className="text-xs font-medium uppercase tracking-wide text-body">
        {label}
      </p>
      {isLoading ? (
        <Skeleton className="mt-3 h-9 w-14" />
      ) : (
        <p className="mt-3 text-4xl font-semibold leading-none text-ink">
          {value}
        </p>
      )}
      <p className="mt-2 text-sm leading-5 text-body">{helper}</p>
    </div>
  );
}

type ResultsSummaryProps = {
  summary?: CollectionResultsSummary;
  isPending: boolean;
  isError: boolean;
};

export function ResultsSummary({
  summary,
  isPending,
  isError,
}: ResultsSummaryProps) {
  const totalPhotos = summary?.totalPhotos ?? 0;
  const similarGroups = summary?.similarGroups ?? 0;
  const lowQualityImages = summary?.lowQualityImages ?? 0;

  return (
    <section>
      <div className="grid md:grid-cols-3">
        <SummaryStat
          helper="Visually similar sets"
          label="Similar Groups"
          value={similarGroups}
          isLoading={isPending}
        />
        <SummaryStat
          helper="Flagged for review"
          label="Low Quality"
          value={lowQualityImages}
          isLoading={isPending}
        />
        <SummaryStat
          helper="Uploaded photos"
          label="Total Photos"
          value={totalPhotos}
          isLoading={isPending}
        />
      </div>
      {isError ? (
        <p className="mt-3 text-sm text-body">
          Unable to refresh the latest result totals.
        </p>
      ) : null}
    </section>
  );
}
