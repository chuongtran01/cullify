import { MoreHorizontal } from "lucide-react";

import {
  BatchMetadata,
  formatBatchDate,
  getBatchActionLabel,
  StatusBadge,
  ThumbnailCollage,
} from "@/components/batches/batch-ui";
import type { Batch } from "@/components/batches/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BatchListProps = {
  batches: Batch[];
};

export function BatchList({ batches }: BatchListProps) {
  return (
    <div className="overflow-hidden rounded-md border border-hairline bg-surface-card">
      {batches.map((batch, index) => (
        <div
          key={batch.id}
          className={cn(
            "grid gap-4 px-4 py-3 lg:grid-cols-[minmax(260px,1.5fr)_140px_150px_minmax(220px,1fr)_auto]",
            index > 0 && "border-t border-hairline",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <ThumbnailCollage
              urls={batch.thumbnailUrls}
              name={batch.name}
              compact
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {batch.name}
              </p>
              <p className="mt-1 text-xs text-body">{batch.totalImages} photos</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-body">
            {formatBatchDate(batch.createdAt)}
          </div>
          <div className="flex items-center">
            <StatusBadge status={batch.status} />
          </div>
          <div className="flex items-center">
            <BatchMetadata batch={batch} />
          </div>
          <div className="flex items-center gap-2 lg:justify-end">
            <Button className="h-8" size="sm" variant="outline">
              {getBatchActionLabel(batch.status)}
            </Button>
            <Button
              className="size-8"
              size="icon"
              variant="ghost"
              aria-label={`More actions for ${batch.name}`}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
