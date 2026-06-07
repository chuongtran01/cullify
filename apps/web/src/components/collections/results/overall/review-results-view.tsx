"use client";

import type { ReviewResultsData } from "@/components/collections/results/overall/mock-data";
import { ResultsHeader } from "@/components/collections/results/overall/results-header";
import { ResultsSummary } from "@/components/collections/results/overall/results-summary";
import { ResultsWorkflows } from "@/components/collections/results/overall/results-workflows";
import { useCollectionResultsOverall } from "@/features/collections/hooks";

export function ReviewResultsView({ data }: { data: ReviewResultsData }) {
  const overall = useCollectionResultsOverall(data.collectionId);

  return (
    <div className="flex w-full flex-col gap-5">
      <ResultsHeader
        summary={overall.data?.summary}
        isError={overall.isError}
        isPending={overall.isPending}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <ResultsSummary
          summary={overall.data?.summary}
          isError={overall.isError}
          isPending={overall.isPending}
        />
        <ResultsWorkflows
          data={data}
          lowQuality={overall.data?.lowQuality}
          isLowQualityError={overall.isError}
          isLowQualityPending={overall.isPending}
        />
      </div>
    </div>
  );
}
