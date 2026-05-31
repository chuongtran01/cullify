import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

import {
  formatBatchDate,
  getBatchActionLabel,
  getBatchProgress,
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
    className: "text-[#27A365]",
  },
  READY_FOR_REVIEW: {
    label: "Ready for Review",
    icon: Sparkles,
    className: "text-[#E1842E]",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: Clock3,
    className: "text-action-blue",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-[#35A968]",
  },
  FAILED: {
    label: "Failed",
    icon: AlertCircle,
    className: "text-semantic-error",
  },
};

function BatchRowThumbnail({ batch }: { batch: Batch }) {
  return (
    <div
      className="h-[52px] w-40 shrink-0 rounded-md bg-surface-stone bg-cover bg-center"
      style={{ backgroundImage: `url(${batch.thumbnailUrls[0]})` }}
      aria-label={`${batch.name} thumbnail`}
    />
  );
}

function BatchStatusBlock({ batch }: { batch: Batch }) {
  const meta = listStatusMeta[batch.status];
  const Icon = meta.icon;
  const isSpinning =
    batch.status === "PROCESSING" || batch.status === "UPLOADING";

  return (
    <div className="grid gap-2">
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
      <BatchStatusDetail batch={batch} />
    </div>
  );
}

function BatchStatusDetail({ batch }: { batch: Batch }) {
  if (batch.status === "PROCESSING" || batch.status === "UPLOADING") {
    return (
      <div className="grid max-w-60 gap-1.5">
        <p className="text-xs text-body">
          {batch.processedImages} / {batch.totalImages} photos processed
        </p>
        <div className="h-1 overflow-hidden rounded-full bg-hairline-light">
          <div
            className="h-full rounded-full bg-[#27A365]"
            style={{ width: `${getBatchProgress(batch)}%` }}
          />
        </div>
      </div>
    );
  }

  if (batch.status === "READY_FOR_REVIEW") {
    return (
      <p className="text-xs text-body">
        AI picks: {batch.aiPicksCount} <span className="px-1">·</span> Groups:{" "}
        {batch.groupsCount}
      </p>
    );
  }

  if (batch.status === "IN_REVIEW") {
    return (
      <p className="text-xs text-body">
        Reviewed {batch.reviewedImages} / {batch.totalImages}
      </p>
    );
  }

  if (batch.status === "COMPLETED") {
    return (
      <p className="text-xs text-body">
        Kept: {batch.keptImages} <span className="px-1">·</span> Rejected:{" "}
        {batch.rejectedImages}
      </p>
    );
  }

  return <p className="text-xs text-body">Processing failed</p>;
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

export function BatchList({ batches }: BatchListProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-surface-card">
      {batches.map((batch, index) => (
        <div
          key={batch.id}
          className={cn(
            "grid gap-4 px-4 py-3 lg:grid-cols-[minmax(360px,1.45fr)_minmax(260px,1fr)_120px_180px_32px] lg:items-center",
            index > 0 && "border-t border-hairline",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <BatchRowThumbnail batch={batch} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {batch.name}
              </p>
              <p className="mt-1 text-xs text-body">
                {batch.totalImages} photos <span className="px-1">·</span> Created{" "}
                {formatBatchDate(batch.createdAt)}
              </p>
            </div>
          </div>
          <BatchStatusBlock batch={batch} />
          <BatchTimeline batch={batch} />
          <div className="flex items-center gap-2 lg:justify-end">
            <Button
              className="h-9 min-w-36 border-hairline bg-surface-card text-[#6D3C28] hover:bg-surface-stone hover:text-[#6D3C28]"
              size="sm"
              variant="outline"
            >
              {getBatchActionLabel(batch.status)}
            </Button>
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
