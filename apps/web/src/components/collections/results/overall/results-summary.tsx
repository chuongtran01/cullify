"use client";

import { Sparkles } from "lucide-react";

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
    <div className="rounded-lg border border-hairline-strong bg-surface-dark-elevated p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-on-dark-soft">
        {label}
      </p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-16 bg-on-dark/20" />
      ) : (
        <p className="mt-2 text-2xl font-semibold leading-none text-on-dark">
          {value}
        </p>
      )}
      <p className="mt-2 text-xs leading-5 text-on-dark-soft">{helper}</p>
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
    <section className="grid gap-5 rounded-lg bg-surface-dark p-5 text-on-dark">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-on-dark-soft">
          <Sparkles className="size-4" />
          Analysis complete
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-on-dark">
          Review summary
        </h2>
        {isError ? (
          <p className="mt-3 text-sm text-on-dark-soft">
            Unable to refresh the latest result totals.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryStat
          helper="Visually similar sets"
          label="Similar Groups"
          value={similarGroups}
          isLoading={isPending}
        />
        <SummaryStat
          helper="Flagged for human review"
          label="Photos To Review"
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
    </section>
  );
}
