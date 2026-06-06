"use client";

import type { ReviewResultsData } from "@/components/results/overall/mock-data";
import { ResultsHeader } from "@/components/results/overall/results-header";
import { ResultsSidebar } from "@/components/results/overall/results-sidebar";
import { ResultsSummary } from "@/components/results/overall/results-summary";
import { ResultsWorkflows } from "@/components/results/overall/results-workflows";
import { useCollectionResultsSummary } from "@/features/collections/hooks";

export function ReviewResultsView({ data }: { data: ReviewResultsData }) {
  const summary = useCollectionResultsSummary(data.collectionId);

  return (
    <div className="flex w-full flex-col gap-5">
      <ResultsHeader summary={summary} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <ResultsSummary summary={summary} />
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ResultsWorkflows data={data} />
          <ResultsSidebar progress={data.progress} />
        </div>
      </div>
    </div>
  );
}
