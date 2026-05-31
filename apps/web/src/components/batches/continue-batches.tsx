import { CalendarDays, ChevronRight, MoreHorizontal, Users } from "lucide-react";

import type { Batch } from "@/components/batches/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContinueBatchesProps = {
  batches: Batch[];
};

function ContinueThumbnailGrid({ batch }: { batch: Batch }) {
  const urls = Array.from({ length: 4 }, (_, index) => {
    return batch.thumbnailUrls[index % batch.thumbnailUrls.length];
  });

  return (
    <div
      className="grid size-40 shrink-0 grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-md bg-surface-stone"
      aria-label={`${batch.name} thumbnails`}
    >
      {urls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="size-full rounded-[4px] bg-cover bg-center"
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
    </div>
  );
}

function ContinueStatusPill({ batch }: { batch: Batch }) {
  const isInReview = batch.status === "IN_REVIEW";

  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit items-center gap-1 rounded-full px-2 text-[11px] font-semibold uppercase",
        isInReview
          ? "bg-action-blue/10 text-action-blue"
          : "border border-coral/20 bg-coral-soft/20 text-ink",
      )}
    >
      {!isInReview ? <span className="size-1.5 rounded-full bg-coral" /> : null}
      {isInReview ? "In Review" : "Ready for Review"}
    </span>
  );
}

function ContinueProgress({ batch }: { batch: Batch }) {
  const isInReview = batch.status === "IN_REVIEW";
  const reviewedImages = batch.reviewedImages ?? 0;
  const progress = isInReview
    ? Math.min(100, Math.round((reviewedImages / batch.totalImages) * 100))
    : Math.min(
      100,
      Math.round(((batch.aiPicksCount ?? 0) / batch.totalImages) * 100),
    );

  return (
    <div className="grid gap-1.5">
      <p className="text-sm text-body">
        {isInReview
          ? `Reviewed ${reviewedImages} / ${batch.totalImages}`
          : `AI picks: ${batch.aiPicksCount ?? 0}`}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-hairline-light">
        <div
          className={cn(
            "h-full rounded-full",
            isInReview ? "bg-action-blue" : "bg-primary",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ContinueBatches({ batches }: ContinueBatchesProps) {
  if (batches.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">
          Continue where you left off
        </h2>
        <button
          className="inline-flex h-8 items-center gap-2 text-sm font-medium text-body transition-colors hover:text-ink"
          type="button"
        >
          View all ({batches.length})
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {batches.map((batch) => (
          <article
            key={batch.id}
            className="flex gap-4 rounded-md border border-hairline-light bg-surface-card p-3"
          >
            <ContinueThumbnailGrid batch={batch} />
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-1">
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-sm font-semibold text-ink">
                    {batch.name}
                  </h3>
                  <button
                    className="grid size-7 shrink-0 place-items-center rounded-md text-body transition-colors hover:bg-surface-stone hover:text-ink"
                    type="button"
                    aria-label={`More actions for ${batch.name}`}
                  >
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-2">
                  <ContinueStatusPill batch={batch} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-body">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {batch.totalImages} photos
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" aria-hidden="true" />
                    {batch.groupsCount ?? 0} groups
                  </span>
                </div>
              </div>
              <ContinueProgress batch={batch} />
              <Button
                className="h-9 justify-between border-hairline bg-surface-card text-ink hover:bg-surface-stone"
                size="sm"
                variant="outline"
              >
                Continue Review
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
