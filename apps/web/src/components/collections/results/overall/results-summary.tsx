"use client";

import type { UseQueryResult } from "@tanstack/react-query";
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
    <div className="rounded-lg border border-white/10 bg-white/8 p-4">
      <p className="font-mono text-xs uppercase text-white/55">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-16 bg-white/20" />
      ) : (
        <p className="mt-2 text-3xl leading-none font-normal text-white">{value}</p>
      )}
      <p className="mt-2 text-xs leading-5 text-white/55">{helper}</p>
    </div>
  );
}

type ResultsSummaryProps = {
  summary: UseQueryResult<CollectionResultsSummary, Error>;
};

export function ResultsSummary({ summary }: ResultsSummaryProps) {
  const isLoading = summary.isPending;
  const totalPhotos = summary.data?.totalPhotos ?? 0;
  const similarGroups = summary.data?.similarGroups ?? 0;
  const lowQualityImages = summary.data?.lowQualityImages ?? 0;

  return (
    <section className="grid gap-5 rounded-3xl bg-deep-green p-5 text-white">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs uppercase text-white/60">
          <Sparkles className="size-4" />
          Analysis complete
        </div>
        <h2 className="mt-3 text-2xl leading-tight font-normal text-white">
          Review summary
        </h2>
        {summary.isError ? (
          <p className="mt-3 text-sm text-white/70">
            Unable to refresh the latest result totals.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryStat
          helper="Visually similar sets"
          label="Similar Groups"
          value={similarGroups}
          isLoading={isLoading}
        />
        <SummaryStat
          helper="Flagged for human review"
          label="Photos To Review"
          value={lowQualityImages}
          isLoading={isLoading}
        />
        <SummaryStat
          helper="Uploaded photos"
          label="Total Photos"
          value={totalPhotos}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
