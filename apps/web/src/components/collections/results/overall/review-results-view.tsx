"use client";

import type { ReviewResultsData } from "@/components/collections/results/overall/mock-data";
import { ResultsHeader } from "@/components/collections/results/overall/results-header";
import { ResultsSummary } from "@/components/collections/results/overall/results-summary";
import { ResultsWorkflows } from "@/components/collections/results/overall/results-workflows";
import { useCollectionResultsSummary } from "@/features/collections/hooks";

export function ReviewResultsView({ data }: { data: ReviewResultsData }) {
  const summary = useCollectionResultsSummary(data.collectionId);

  return (
    <div className="flex w-full flex-col gap-5">
      <ResultsHeader summary={summary} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <ResultsSummary summary={summary} progress={data.progress} />
        <ResultsWorkflows data={data} />
      </div>
    </div>
  );
}
