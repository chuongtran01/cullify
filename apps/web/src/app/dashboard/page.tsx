"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Images,
  MoreHorizontal,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { UploadDialog } from "@/components/landing/upload-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CreateUploadSessionResponse } from "@/lib/upload/types";

type BatchStatus =
  | "UPLOADING"
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "COMPLETED"
  | "FAILED";

type Batch = {
  id: string;
  name: string;
  status: BatchStatus;
  totalImages: number;
  processedImages: number;
  createdAt: string;
  completedAt?: string;
  aiPicksCount?: number;
  groupsCount?: number;
  reviewedImages?: number;
  keptImages?: number;
  rejectedImages?: number;
  thumbnailUrls: string[];
  errorMessage?: string;
};

type FilterValue =
  | "ALL"
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "COMPLETED"
  | "FAILED";

const mockBatches: Batch[] = [
  {
    id: "batch-001",
    name: "Spring Campaign Selects",
    status: "IN_REVIEW",
    totalImages: 187,
    processedImages: 187,
    createdAt: "2026-05-30T16:20:00Z",
    aiPicksCount: 42,
    groupsCount: 31,
    reviewedImages: 26,
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "batch-002",
    name: "Catalog Product Angles",
    status: "READY_FOR_REVIEW",
    totalImages: 324,
    processedImages: 324,
    createdAt: "2026-05-29T11:10:00Z",
    aiPicksCount: 68,
    groupsCount: 54,
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "batch-003",
    name: "Founder Portrait Session",
    status: "PROCESSING",
    totalImages: 324,
    processedImages: 201,
    createdAt: "2026-05-31T13:05:00Z",
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "batch-004",
    name: "Launch Event Floor",
    status: "COMPLETED",
    totalImages: 612,
    processedImages: 612,
    createdAt: "2026-05-25T19:30:00Z",
    completedAt: "2026-05-26T01:10:00Z",
    keptImages: 144,
    rejectedImages: 468,
    groupsCount: 92,
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "batch-005",
    name: "Studio Lookbook Extras",
    status: "FAILED",
    totalImages: 92,
    processedImages: 18,
    createdAt: "2026-05-21T09:45:00Z",
    errorMessage: "18 photos processed before upload validation failed.",
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=320&q=80",
    ],
  },
];

const filters: Array<{ label: string; value: FilterValue }> = [
  { label: "All", value: "ALL" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Ready for Review", value: "READY_FOR_REVIEW" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];

const statusMeta: Record<
  BatchStatus,
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getProgress(batch: Batch) {
  if (batch.totalImages === 0) {
    return 0;
  }

  return Math.round((batch.processedImages / batch.totalImages) * 100);
}

function ThumbnailCollage({
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

function StatusBadge({ status }: { status: BatchStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <Badge variant="outline" className={cn("gap-1", meta.badgeClassName)}>
      <Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

function getActionLabel(status: BatchStatus) {
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

function BatchMetadata({ batch }: { batch: Batch }) {
  if (batch.status === "PROCESSING" || batch.status === "UPLOADING") {
    return (
      <div className="grid min-w-44 gap-2">
        <Progress value={getProgress(batch)} />
        <p className="text-xs text-body">
          {batch.processedImages} / {batch.totalImages} photos processed
        </p>
      </div>
    );
  }

  if (batch.status === "READY_FOR_REVIEW") {
    return (
      <p className="text-sm text-body">
        {batch.aiPicksCount} AI picks · {batch.groupsCount} groups
      </p>
    );
  }

  if (batch.status === "IN_REVIEW") {
    return (
      <p className="text-sm text-body">
        Reviewed {batch.reviewedImages} / {batch.totalImages}
      </p>
    );
  }

  if (batch.status === "COMPLETED") {
    return (
      <p className="text-sm text-body">
        {batch.keptImages} kept · {batch.rejectedImages} rejected
      </p>
    );
  }

  return (
    <p className="max-w-sm truncate text-sm text-semantic-error">
      {batch.errorMessage}
    </p>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("ALL");
  const [search, setSearch] = useState("");

  const continueBatches = mockBatches.filter((batch) =>
    ["READY_FOR_REVIEW", "IN_REVIEW"].includes(batch.status),
  );

  const filteredBatches = useMemo(() => {
    return mockBatches
      .filter((batch) => {
        const matchesFilter =
          activeFilter === "ALL" || batch.status === activeFilter;
        const matchesSearch = batch.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        return matchesFilter && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [activeFilter, search]);

  const summary = {
    totalBatches: mockBatches.length,
    needsReview: mockBatches.filter((batch) =>
      ["READY_FOR_REVIEW", "IN_REVIEW"].includes(batch.status),
    ).length,
    processing: mockBatches.filter((batch) =>
      ["UPLOADING", "PROCESSING"].includes(batch.status),
    ).length,
    totalPhotos: mockBatches.reduce((total, batch) => total + batch.totalImages, 0),
  };

  function handleUploadSessionCreated(response: CreateUploadSessionResponse) {
    router.push(`/batches/${response.sessionId}/progress`);
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Batches</h1>
            <p className="mt-2 text-sm leading-6 text-body">
              Upload, process, and review your photo collections.
            </p>
          </div>
          <Button className="h-10 self-start" onClick={() => setUploadOpen(true)}>
            <Upload className="size-4" aria-hidden="true" />
            Upload New Batch
          </Button>
        </header>

        {mockBatches.length === 0 ? (
          <section className="rounded-md border border-dashed border-hairline bg-surface-card p-8 text-center">
            <h2 className="text-lg font-semibold text-ink">No batches yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
              Upload your first photo collection and let AI find your best shots
              automatically.
            </p>
            <Button className="mt-5" onClick={() => setUploadOpen(true)}>
              <Upload className="size-4" aria-hidden="true" />
              Upload Photos
            </Button>
          </section>
        ) : (
          <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total Batches", summary.totalBatches],
                ["Needs Review", summary.needsReview],
                ["Processing", summary.processing],
                ["Total Photos", summary.totalPhotos.toLocaleString()],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-hairline bg-surface-card p-4"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
                </div>
              ))}
            </section>

            {continueBatches.length > 0 ? (
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
                  {continueBatches.map((batch) => (
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
            ) : null}

            <section className="grid gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      className={cn(
                        "h-8 rounded-full border border-hairline px-3 text-sm font-medium text-body transition-colors hover:border-ink hover:text-ink",
                        activeFilter === filter.value &&
                          "border-ink bg-ink text-on-primary hover:text-on-primary",
                      )}
                      onClick={() => setActiveFilter(filter.value)}
                      type="button"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                      aria-hidden="true"
                    />
                    <Input
                      className="h-9 w-full pl-9 sm:w-64"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search batches"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-9 justify-between" variant="outline">
                        Newest First
                        <ChevronDown className="size-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40">
                      <DropdownMenuItem>Newest First</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-hairline bg-surface-card">
                {filteredBatches.map((batch, index) => (
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
                        <p className="mt-1 text-xs text-body">
                          {batch.totalImages} photos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-body">
                      {formatDate(batch.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={batch.status} />
                    </div>
                    <div className="flex items-center">
                      <BatchMetadata batch={batch} />
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Button className="h-8" size="sm" variant="outline">
                        {getActionLabel(batch.status)}
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
            </section>
          </>
        )}

        <p className="border-t border-hairline pt-4 text-xs text-muted-foreground">
          Batches are stored permanently. You can review and download results anytime.
        </p>
      </div>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadSessionCreated={handleUploadSessionCreated}
      />
    </>
  );
}
