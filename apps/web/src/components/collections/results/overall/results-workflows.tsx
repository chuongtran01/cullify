"use client";

import { ArrowRight, CircleCheck, ImageOff } from "lucide-react";
import Link from "next/link";

import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  CollectionGroupPreview,
  CollectionGroupPreviewsResponse,
  CollectionLowQualityImage,
  CollectionLowQualityImagesResponse,
  CollectionSelectedImage,
  CollectionSelectedImagesResponse,
} from "@/services/collections";

const PREVIEW_LIMIT = 4;

function WorkflowRow({
  title,
  count,
  description,
  actionLabel,
  href,
  children,
}: {
  title: string;
  count: string;
  description: string;
  actionLabel: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-hairline-strong py-9">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold leading-tight text-ink">
              {title}
            </h2>
            <Badge className="rounded-full border-0 bg-surface-strong px-2.5 py-1 text-xs font-medium text-body shadow-none">
              {count}
            </Badge>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-body">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-body sm:justify-self-end"
        >
          {actionLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PreviewTile({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  return (
    <div className="size-32 overflow-hidden rounded-md bg-surface-strong md:size-36 lg:size-40">
      <PhotoSurface className="size-full" src={src} title={title} />
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="flex gap-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton
          key={index}
          className="size-32 rounded-md md:size-36 lg:size-40"
        />
      ))}
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-body">
      <span className="text-muted" aria-hidden="true">
        {icon}
      </span>
      <span>{message}</span>
    </div>
  );
}

function SimilarGroupsPreview({
  groups,
  isError,
  isPending,
}: {
  groups: CollectionGroupPreview[];
  isError: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return <PreviewSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-body">Unable to load similar groups.</p>
    );
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={<CircleCheck className="size-4" />}
        message="No similar groups found."
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {groups.slice(0, PREVIEW_LIMIT).map((group) => (
        <PreviewTile
          key={group.id}
          src={group.previewImage.imageUrl}
          title={group.previewImage.fileName}
        />
      ))}
    </div>
  );
}

function LowQualityPhotosPreview({
  images,
  isError,
  isPending,
}: {
  images: CollectionLowQualityImage[];
  isError: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return <PreviewSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-body">Unable to load low quality photos.</p>
    );
  }

  if (images.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="size-4" />}
        message="No low quality images found."
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {images.slice(0, PREVIEW_LIMIT).map((image) => (
        <PreviewTile key={image.id} src={image.imageUrl} title={image.fileName} />
      ))}
    </div>
  );
}

function SelectedPhotosPreview({
  images,
  isError,
  isPending,
}: {
  images: CollectionSelectedImage[];
  isError: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return <PreviewSkeleton />;
  }

  if (isError) {
    return <p className="text-sm text-body">Unable to load selected photos.</p>;
  }

  if (images.length === 0) {
    return (
      <EmptyState
        icon={<CircleCheck className="size-4" />}
        message="No selected photos yet."
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {images.slice(0, PREVIEW_LIMIT).map((image) => (
        <PreviewTile key={image.id} src={image.imageUrl} title={image.fileName} />
      ))}
    </div>
  );
}

export function ResultsWorkflows({
  collectionId,
  lowQuality,
  selected,
  similarGroups,
  isLowQualityError,
  isLowQualityPending,
  isSelectedError,
  isSelectedPending,
  isSimilarGroupsError,
  isSimilarGroupsPending,
}: {
  collectionId: string;
  lowQuality?: CollectionLowQualityImagesResponse;
  selected?: CollectionSelectedImagesResponse;
  similarGroups?: CollectionGroupPreviewsResponse;
  isLowQualityError: boolean;
  isLowQualityPending: boolean;
  isSelectedError: boolean;
  isSelectedPending: boolean;
  isSimilarGroupsError: boolean;
  isSimilarGroupsPending: boolean;
}) {
  const similarGroupsCount = similarGroups?.totalSimilarGroups ?? 0;
  const lowQualityCount = lowQuality?.totalLowQualityImages ?? 0;
  const selectedCount = selected?.totalSelectedImages ?? 0;

  return (
    <div>
      <WorkflowRow
        actionLabel="View"
        count={`${selectedCount} photos`}
        description="See every photo currently included in the final set."
        href={`/dashboard/collections/${collectionId}/results/selected`}
        title="Selected Photos"
      >
        <SelectedPhotosPreview
          images={selected?.images ?? []}
          isError={isSelectedError}
          isPending={isSelectedPending}
        />
      </WorkflowRow>

      <WorkflowRow
        actionLabel="Choose"
        count={`${similarGroupsCount} groups`}
        description="Compare visually similar photos and keep the best frame from each set."
        href={`/dashboard/collections/${collectionId}/results/groups`}
        title="Similar Groups"
      >
        <SimilarGroupsPreview
          groups={similarGroups?.groups ?? []}
          isError={isSimilarGroupsError}
          isPending={isSimilarGroupsPending}
        />
      </WorkflowRow>

      <WorkflowRow
        actionLabel="Review"
        count={`${lowQualityCount} photos`}
        description="Check photos flagged for blur, focus issues, closed eyes, poor lighting, or duplication."
        href={`/dashboard/collections/${collectionId}/results/low-quality`}
        title="Low Quality Photos"
      >
        <LowQualityPhotosPreview
          images={lowQuality?.images ?? []}
          isError={isLowQualityError}
          isPending={isLowQualityPending}
        />
      </WorkflowRow>
    </div>
  );
}
