import type { UseQueryResult } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CollectionResultsSummary } from "@/services/collections";

type ResultsHeaderProps = {
  summary: UseQueryResult<CollectionResultsSummary, Error>;
};

export function ResultsHeader({ summary }: ResultsHeaderProps) {
  const title = summary.data?.collectionName ?? "Results";

  return (
    <header className="flex items-center justify-between gap-4 pb-4">
      <div className="min-w-0">
        {summary.isPending ? (
          <Skeleton className="h-6 w-48" />
        ) : (
          <h1 className="truncate text-base font-medium text-ink">{title}</h1>
        )}
        {summary.isError ? (
          <p className="mt-1 text-xs text-body">
            Unable to refresh collection details.
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-9 shrink-0 rounded-lg px-4"
      >
        Share
      </Button>
    </header>
  );
}
