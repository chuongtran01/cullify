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
    badgeClassName: "border-action-blue/20 bg-surface-blue-wash text-action-blue",
    icon: Upload,
  },
  PROCESSING: {
    label: "Processing",
    badgeClassName: "border-action-blue/20 bg-surface-blue-wash text-action-blue",
    icon: Clock3,
  },
  READY_FOR_REVIEW: {
    label: "Ready for Review",
    badgeClassName: "border-deep-green/15 bg-surface-green-wash text-deep-green",
    icon: Sparkles,
  },
  IN_REVIEW: {
    label: "In Review",
    badgeClassName: "border-coral/25 bg-coral-soft/20 text-ink",
    icon: Images,
  },
  COMPLETED: {
    label: "Completed",
    badgeClassName: "border-deep-green/15 bg-white text-deep-green",
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
  urls,
  name,
  compact = false,
}: {
  urls: string[];
  name: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 grid-cols-2 grid-rows-2 overflow-hidden rounded-md bg-surface-stone",
        compact ? "size-14" : "h-20 w-28",
      )}
      aria-label={`${name} thumbnails`}
    >
      {urls.slice(0, 3).map((url, index) => (
        <div
          key={url}
          className={cn(
            "size-full bg-cover bg-center",
            index === 0 && "row-span-2",
            index > 0 && "col-start-2",
          )}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: CollectionStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <Badge variant="outline" className={cn("gap-1", meta.badgeClassName)}>
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
        {collection.aiPicksCount} AI picks · {collection.groupsCount} groups
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
