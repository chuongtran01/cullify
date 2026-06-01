"use client";

import {
  CheckCircle2,
  CircleX,
  Clock3,
  Loader2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  formatCollectionDate,
  getCollectionActionLabel,
} from "@/components/collections/collection-ui";
import { EditCollectionDialog } from "@/components/collections/edit-collection-dialog";
import type { Collection, CollectionStatus } from "@/components/collections/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CollectionListProps = {
  collections: Collection[];
};

type CollectionListSkeletonProps = {
  rowCount?: number;
};

const listStatusMeta: Record<
  CollectionStatus,
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

function CollectionStatusBlock({ collection }: { collection: Collection }) {
  const meta = listStatusMeta[collection.status];
  const Icon = meta.icon;
  const isSpinning =
    collection.status === "PROCESSING" || collection.status === "UPLOADING";

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

function CollectionTimeline({ collection }: { collection: Collection }) {
  if (collection.status === "PROCESSING" || collection.status === "UPLOADING") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>Started</span>
        <span>2 min ago</span>
      </div>
    );
  }

  if (collection.status === "READY_FOR_REVIEW") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>Ready</span>
        <span>1 day ago</span>
      </div>
    );
  }

  if (collection.status === "COMPLETED") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>Completed</span>
        <span>{collection.completedAt ? formatCollectionDate(collection.completedAt) : "-"}</span>
      </div>
    );
  }

  if (collection.status === "IN_REVIEW") {
    return (
      <div className="grid gap-1 text-xs text-body">
        <span>In review</span>
        <span>{formatCollectionDate(collection.createdAt)}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-1 text-xs text-body">
      <span>Failed</span>
      <span>{formatCollectionDate(collection.createdAt)}</span>
    </div>
  );
}

function getCollectionActionHref(collection: Collection) {
  if (collection.status === "PROCESSING" || collection.status === "UPLOADING") {
    return `/collections/${collection.id}/progress`;
  }

  if (
    collection.status === "READY_FOR_REVIEW" ||
    collection.status === "IN_REVIEW" ||
    collection.status === "COMPLETED"
  ) {
    return `/collections/${collection.id}/results`;
  }

  return null;
}

function CollectionRowActions({ collection }: { collection: Collection }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="size-8 text-body hover:text-ink"
            size="icon"
            variant="ghost"
            aria-label={`More actions for ${collection.name}`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditCollectionDialog
        collection={collection}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

export function CollectionList({ collections }: CollectionListProps) {
  return (
    <div className="overflow-hidden rounded-md border border-hairline-light bg-surface-card">
      {collections.map((collection, index) => (
        <div
          key={collection.id}
          className={cn(
            "grid gap-4 px-4 py-3 lg:grid-cols-[minmax(220px,1.2fr)_minmax(260px,1fr)_120px_180px_32px] lg:items-center",
            index > 0 && "border-t border-hairline-light",
          )}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{collection.name}</p>
            <p className="mt-1 text-xs text-body">
              {collection.totalImages} photos <span className="px-1">·</span> Created{" "}
              {formatCollectionDate(collection.createdAt)}
            </p>
          </div>
          <CollectionStatusBlock collection={collection} />
          <CollectionTimeline collection={collection} />
          <div className="flex items-center gap-2 lg:justify-end">
            {getCollectionActionHref(collection) ? (
              <Button
                asChild
                className="h-9 min-w-36 border-hairline bg-surface-card text-ink hover:bg-surface-stone hover:text-ink"
                size="sm"
                variant="outline"
              >
                <Link href={getCollectionActionHref(collection)!}>
                  {getCollectionActionLabel(collection.status)}
                </Link>
              </Button>
            ) : (
              <Button
                className="h-9 min-w-36 border-hairline bg-surface-card text-ink hover:bg-surface-stone hover:text-ink"
                size="sm"
                variant="outline"
              >
                {getCollectionActionLabel(collection.status)}
              </Button>
            )}
          </div>
          <CollectionRowActions collection={collection} />
        </div>
      ))}
    </div>
  );
}

export function CollectionListSkeleton({
  rowCount = 5,
}: CollectionListSkeletonProps) {
  return (
    <div
      className="overflow-hidden rounded-md border border-hairline-light bg-surface-card"
      aria-label="Loading collections"
    >
      {Array.from({ length: rowCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "grid gap-4 px-4 py-3 lg:grid-cols-[minmax(220px,1.2fr)_minmax(260px,1fr)_120px_180px_32px] lg:items-center",
            index > 0 && "border-t border-hairline-light",
          )}
        >
          <div className="min-w-0">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-56 max-w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-3.5 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="grid gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-2 lg:justify-end">
            <Skeleton className="h-9 w-36" />
          </div>
          <Skeleton className="size-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}
