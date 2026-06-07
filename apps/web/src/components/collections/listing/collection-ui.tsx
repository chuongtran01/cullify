import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Images,
  Sparkles,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Collection, CollectionStatus } from "@/components/collections/types";

const statusMeta: Record<
  CollectionStatus,
  {
    label: string;
    badgeClassName: string;
    icon: typeof Clock3;
  }
> = {
  UPLOADING: {
    label: "Uploading",
    badgeClassName: "border-hairline-strong bg-canvas-soft text-text-link",
    icon: Upload,
  },
  PROCESSING: {
    label: "Processing",
    badgeClassName: "border-hairline-strong bg-canvas-soft text-text-link",
    icon: Clock3,
  },
  READY_FOR_REVIEW: {
    label: "Ready for Review",
    badgeClassName: "border-hairline-strong bg-canvas-soft text-accent-preview",
    icon: Sparkles,
  },
  IN_REVIEW: {
    label: "In Review",
    badgeClassName: "border-hairline-strong bg-surface-strong text-ink",
    icon: Images,
  },
  COMPLETED: {
    label: "Completed",
    badgeClassName: "border-hairline-strong bg-surface-card text-semantic-success",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Failed",
    badgeClassName: "border-semantic-error/20 bg-semantic-error/10 text-semantic-error",
    icon: AlertCircle,
  },
};

export function formatCollectionDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getCollectionProgress(collection: Collection) {
  if (collection.totalImages === 0) {
    return 0;
  }

  return Math.round((collection.processedImages / collection.totalImages) * 100);
}

export function getCollectionActionLabel(status: CollectionStatus) {
  switch (status) {
    case "PROCESSING":
    case "UPLOADING":
      return "View Progress";
    case "READY_FOR_REVIEW":
    case "IN_REVIEW":
      return "Continue Review";
    case "COMPLETED":
      return "View Results";
    case "FAILED":
      return "Retry";
  }
}

export function ThumbnailCollage({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 grid-cols-2 grid-rows-2 overflow-hidden rounded-md bg-surface-strong",
        compact ? "size-14" : "h-20 w-28",
      )}
      aria-label={`${name} thumbnails`}
    >
      <div className="row-span-2 bg-surface-card" />
      <div className="col-start-2 bg-hairline-soft" />
      <div className="col-start-2 bg-surface-card" />
    </div>
  );
}

export function StatusBadge({ status }: { status: CollectionStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px]", meta.badgeClassName)}>
      <Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

export function CollectionMetadata({ collection }: { collection: Collection }) {
  if (collection.status === "PROCESSING" || collection.status === "UPLOADING") {
    return (
      <div className="grid min-w-44 gap-2">
        <Progress value={getCollectionProgress(collection)} />
        <p className="text-xs text-body">
          {collection.processedImages} / {collection.totalImages} photos processed
        </p>
      </div>
    );
  }

  if (collection.status === "READY_FOR_REVIEW") {
    return (
      <p className="text-sm text-body">
        Ready to review {collection.totalImages} photos
      </p>
    );
  }

  if (collection.status === "IN_REVIEW") {
    return (
      <p className="text-sm text-body">
        Reviewed {collection.reviewedImages} / {collection.totalImages}
      </p>
    );
  }

  if (collection.status === "COMPLETED") {
    return (
      <p className="text-sm text-body">
        {collection.keptImages} kept · {collection.rejectedImages} rejected
      </p>
    );
  }

  return (
    <p className="max-w-sm truncate text-sm text-semantic-error">
      {collection.errorMessage}
    </p>
  );
}
