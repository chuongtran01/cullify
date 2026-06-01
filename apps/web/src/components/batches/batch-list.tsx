import {
  CheckCircle2,
  CircleX,
  Clock3,
  Loader2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import {
  formatBatchDate,
  getBatchActionLabel,
} from "@/components/batches/batch-ui";
import type { Batch, BatchStatus } from "@/components/batches/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BatchListProps = {
  batches: Batch[];
};

const listStatusMeta: Record<
  BatchStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  UPLOADING: {
    label: "Uploading",
    icon: Loader2,
    className: "text-action-blue",
  },
  PROCESSING: {
    label: "Processing",
    icon: Loader2,
    className: "text-semantic-success",
  },
  READY_FOR_REVIEW: {
    label: "Ready for Review",
    icon: Sparkles,
    className: "text-coral",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: Clock3,
    className: "text-action-blue",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-semantic-success",
  },
  FAILED: {
    label: "Failed",
    icon: CircleX,
    className: "text-semantic-error",
  },
};

function BatchStatusBlock({ batch }: { batch: Batch }) {
  const meta = listStatusMeta[batch.status];
  const Icon = meta.icon;
  const isSpinning =
    batch.status === "PROCESSING" || batch.status === "UPLOADING";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide",
        meta.className,
      )}
    >
      <Icon
        className={cn("size-3.5", isSpinning && "animate-spin")}
        aria-hidden="true"
      />
      {meta.label}
    </div>
  );
}

function BatchTimeline({ batch }: { batch: Batch }) {
  if (batch.status === "PROCESSING" || batch.status === "UPLOADING") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>Started</span>
        <span>2 min ago</span>
      </div>
    );
  }

  if (batch.status === "READY_FOR_REVIEW") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>Ready</span>
        <span>1 day ago</span>
      </div>
    );
  }

  if (batch.status === "COMPLETED") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>Completed</span>
        <span>{batch.completedAt ? formatBatchDate(batch.completedAt) : "-"}</span>
      </div>
    );
  }

  if (batch.status === "IN_REVIEW") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>In review</span>
        <span>{formatBatchDate(batch.createdAt)}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-1 text-xs text-body">
      <span>Failed</span>
      <span>{formatBatchDate(batch.createdAt)}</span>
    </div>
  );
}

function getBatchActionHref(batch: Batch) {
  if (batch.status === "PROCESSING" || batch.status === "UPLOADING") {
    return `/batches/${batch.id}/progress`;
  }

  if (
    batch.status === "READY_FOR_REVIEW" ||
    batch.status === "IN_REVIEW" ||
    batch.status === "COMPLETED"
  ) {
    return `/batches/${batch.id}/results`;
  }

  return null;
}

export function BatchList({ batches }: BatchListProps) {
  return (
    <div className="overflow-hidden rounded-md border border-hairline-light bg-surface-card">
      {batches.map((batch, index) => (
        <div
          key={batch.id}
          className={cn(
            "grid gap-4 px-4 py-3 lg:grid-cols-[minmax(220px,1.2fr)_minmax(260px,1fr)_120px_180px_32px] lg:items-center",
            index > 0 && "border-t border-hairline-light",
          )}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{batch.name}</p>
            <p className="mt-1 text-xs text-body">
              {batch.totalImages} photos <span className="px-1">·</span> Created{" "}
              {formatBatchDate(batch.createdAt)}
            </p>
          </div>
          <BatchStatusBlock batch={batch} />
          <BatchTimeline batch={batch} />
          <div className="flex items-center gap-2 lg:justify-end">
            {getBatchActionHref(batch) ? (
              <Button
                asChild
                className="h-9 min-w-36 border-hairline bg-surface-card text-ink hover:bg-surface-stone hover:text-ink"
                size="sm"
                variant="outline"
              >
                <Link href={getBatchActionHref(batch)!}>
                  {getBatchActionLabel(batch.status)}
                </Link>
              </Button>
            ) : (
              <Button
                className="h-9 min-w-36 border-hairline bg-surface-card text-ink hover:bg-surface-stone hover:text-ink"
                size="sm"
                variant="outline"
              >
                {getBatchActionLabel(batch.status)}
              </Button>
            )}
          </div>
          <Button
            className="size-8 text-body"
            size="icon"
            variant="ghost"
            aria-label={`More actions for ${batch.name}`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </div>
      ))}
    </div>
  );
}
