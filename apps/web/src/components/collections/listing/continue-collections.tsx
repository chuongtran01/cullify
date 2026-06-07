import { CalendarDays, ChevronRight, MoreHorizontal } from "lucide-react";

import type { Collection } from "@/components/collections/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContinueCollectionsProps = {
  collections: Collection[];
};

function ContinueThumbnailGrid({ name }: { name: string }) {
  return (
    <div
      className="grid size-40 shrink-0 grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-md bg-surface-strong"
      aria-label={`${name} thumbnails`}
    >
      <div className="row-span-2 rounded-sm bg-surface-card" />
      <div className="rounded-sm bg-hairline-soft" />
      <div className="rounded-sm bg-surface-card" />
    </div>
  );
}

function ContinueStatusPill({ collection }: { collection: Collection }) {
  const isInReview = collection.status === "IN_REVIEW";

  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit items-center gap-1 rounded-full px-2 text-xs font-semibold uppercase tracking-wide",
        isInReview
          ? "bg-surface-strong text-text-link"
          : "border border-hairline-strong bg-surface-strong text-ink",
      )}
    >
      {!isInReview ? <span className="size-1.5 rounded-full bg-accent-preview" /> : null}
      {isInReview ? "In Review" : "Ready for Review"}
    </span>
  );
}

function ContinueProgress({ collection }: { collection: Collection }) {
  const isInReview = collection.status === "IN_REVIEW";
  const reviewedImages = collection.reviewedImages ?? 0;
  const progress = isInReview
    ? Math.min(100, Math.round((reviewedImages / collection.totalImages) * 100))
    : 0;

  return (
    <div className="grid gap-1.5">
      <p className="text-sm text-body">
        {isInReview
          ? `Reviewed ${reviewedImages} / ${collection.totalImages}`
          : `${collection.totalImages} photos ready`}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-hairline-soft">
        <div
          className={cn(
            "h-full rounded-full",
            isInReview ? "bg-text-link" : "bg-primary",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ContinueCollections({ collections }: ContinueCollectionsProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">
          Continue where you left off
        </h2>
        <button
          className="inline-flex h-8 items-center gap-2 text-sm font-medium text-body transition-colors hover:text-ink"
          type="button"
        >
          View all ({collections.length})
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {collections.map((collection) => (
          <article
            key={collection.id}
            className="flex gap-4 rounded-lg border border-hairline-strong bg-surface-card p-3"
          >
            <ContinueThumbnailGrid name={collection.name} />
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-1">
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-base font-semibold text-ink">
                    {collection.name}
                  </h3>
                  <button
                    className="grid size-7 shrink-0 place-items-center rounded-md text-body transition-colors hover:bg-surface-strong hover:text-ink"
                    type="button"
                    aria-label={`More actions for ${collection.name}`}
                  >
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-2">
                  <ContinueStatusPill collection={collection} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-body">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {collection.totalImages} photos
                  </span>
                </div>
              </div>
              <ContinueProgress collection={collection} />
              <Button
                className="h-10 justify-between rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink hover:bg-surface-strong"
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
