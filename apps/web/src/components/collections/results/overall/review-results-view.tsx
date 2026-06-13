"use client";

import { ResultsHeader } from "@/components/collections/results/overall/results-header";
import { ResultsSummary } from "@/components/collections/results/overall/results-summary";
import { ResultsWorkflows } from "@/components/collections/results/overall/results-workflows";
import { useCollectionResultsOverall } from "@/features/collections/hooks";

export function ReviewResultsView({ collectionId }: { collectionId: string }) {
  const overall = useCollectionResultsOverall(collectionId);

  return (
    <div className="flex w-full flex-col gap-5">
      <ResultsHeader
        summary={overall.data?.summary}
        isError={overall.isError}
        isPending={overall.isPending}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <ResultsSummary
          summary={overall.data?.summary}
          isError={overall.isError}
          isPending={overall.isPending}
        />
        <ResultsWorkflows
          collectionId={collectionId}
          lowQuality={overall.data?.lowQuality}
          selected={overall.data?.selected}
          similarGroups={overall.data?.similarGroups}
          isLowQualityError={overall.isError}
          isLowQualityPending={overall.isPending}
          isSelectedError={overall.isError}
          isSelectedPending={overall.isPending}
          isSimilarGroupsError={overall.isError}
          isSimilarGroupsPending={overall.isPending}
        />
      </div>
    </div>
  );
}
