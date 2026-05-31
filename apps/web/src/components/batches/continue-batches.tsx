import { Button } from "@/components/ui/button";
import {
  StatusBadge,
  ThumbnailCollage,
} from "@/components/batches/batch-ui";
import type { Batch } from "@/components/batches/types";

type ContinueBatchesProps = {
  batches: Batch[];
};

export function ContinueBatches({ batches }: ContinueBatchesProps) {
  if (batches.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Continue Where You Left Off
          </h2>
          <p className="mt-1 text-sm text-body">
            Pick up active review work without digging through every batch.
          </p>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {batches.map((batch) => (
          <article
            key={batch.id}
            className="flex gap-4 rounded-md border border-hairline bg-surface-card p-3"
          >
            <ThumbnailCollage urls={batch.thumbnailUrls} name={batch.name} />
            <div className="grid min-w-0 flex-1 gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-ink">
                    {batch.name}
                  </h3>
                  <StatusBadge status={batch.status} />
                </div>
                <p className="mt-2 text-sm text-body">
                  {batch.totalImages} photos · {batch.groupsCount} groups
                </p>
                <p className="mt-1 text-sm text-body">
                  {batch.status === "IN_REVIEW"
                    ? `Reviewed ${batch.reviewedImages} / ${batch.totalImages}`
                    : `${batch.aiPicksCount} AI picks ready`}
                </p>
              </div>
              <Button className="h-8 w-fit" size="sm">
                Continue Review
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
