"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

import type {
  ReviewProgressItem,
  ReviewResultsData,
} from "@/components/collections/results/overall/mock-data";
import { Progress } from "@/components/ui/progress";
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

function ProgressRing({ percent }: { percent: number }) {
  const value = Math.min(Math.max(percent, 0), 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative grid size-28 shrink-0 place-items-center"
      role="img"
      aria-label={`${value}% review complete`}
    >
      <svg
        aria-hidden
        className="absolute inset-0 size-28 -rotate-90"
        viewBox="0 0 112 112"
      >
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="9"
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="9"
        />
      </svg>
      <div className="text-center">
        <div className="text-2xl leading-none font-normal text-white">{value}%</div>
        <div className="mt-1 text-xs text-white/55">reviewed</div>
      </div>
    </div>
  );
}

function ProgressRow({ item }: { item: ReviewProgressItem }) {
  const value = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-white/80">{item.label}</span>
        <span className="text-white/55">
          {item.completed}/{item.total}
        </span>
      </div>
      <Progress
        value={value}
        className="h-1.5 bg-white/15 [&_[data-slot=progress-indicator]]:bg-white"
      />
    </div>
  );
}

function ReviewProgress({ progress }: { progress: ReviewResultsData["progress"] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/8 p-4">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProgressRing percent={progress.percent} />
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="font-mono text-xs uppercase text-white/55">
              Review Progress
            </p>
            <h3 className="mt-2 text-2xl leading-tight font-normal text-white">
              {progress.percent}% reviewed
            </h3>
          </div>
          <div className="space-y-3">
            {progress.items.map((item) => (
              <ProgressRow item={item} key={item.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type ResultsSummaryProps = {
  summary: UseQueryResult<CollectionResultsSummary, Error>;
  progress: ReviewResultsData["progress"];
};

export function ResultsSummary({ summary, progress }: ResultsSummaryProps) {
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
      <ReviewProgress progress={progress} />
    </section>
  );
}
