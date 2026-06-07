"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  CollectionGroupPreview,
  CollectionGroupPreviewsResponse,
  CollectionLowQualityImage,
  CollectionLowQualityImagesResponse,
} from "@/services/collections";

function WorkflowSection({
  title,
  count,
  description,
  children,
  href,
}: {
  title: string;
  count: string;
  description: string;
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-hairline-strong bg-surface-card p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold leading-tight text-ink">{title}</h2>
            <Badge variant="outline" className="h-7 rounded-full px-3 text-xs text-body">
              {count}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body">{description}</p>
        </div>
        {href ? (
          <Button
            asChild
            variant="outline"
            className="h-10 gap-2 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink hover:cursor-pointer sm:shrink-0"
          >
            <Link href={href}>
              Review
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover/button:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink hover:cursor-pointer sm:shrink-0"
          >
            Review
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover/button:translate-x-1"
              aria-hidden="true"
            />
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}

function SimilarGroupCard({ group }: { group: CollectionGroupPreview }) {
  return (
    <article className="min-w-60 overflow-hidden rounded-lg border border-hairline-strong bg-surface-card">
      <PhotoSurface
        className="aspect-[4/3]"
        src={group.previewImage.imageUrl}
        title={group.previewImage.fileName}
      />
    </article>
  );
}

function WorkflowImageStripSkeleton() {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="min-w-60 overflow-hidden rounded-lg border border-hairline-strong bg-surface-card"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
        </div>
      ))}
    </div>
  );
}

function SimilarGroupsStrip({
  groups,
  isError,
  isPending,
}: {
  groups: CollectionGroupPreview[];
  isError: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return <WorkflowImageStripSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-hairline-strong bg-surface-card p-5 text-sm text-body">
        Unable to load similar groups.
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-hairline-strong bg-surface-card p-5 text-sm text-body">
        No similar groups found.
      </div>
    );
  }

  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
      {groups.map((group) => (
        <SimilarGroupCard group={group} key={group.id} />
      ))}
    </div>
  );
}

function LowQualityPhotoCard({ image }: { image: CollectionLowQualityImage }) {
  const reason = image.reasons[0] ?? "Low Quality";

  return (
    <article className="min-w-48 overflow-hidden rounded-lg border border-hairline-strong bg-surface-card">
      <div className="relative">
        <PhotoSurface
          className="aspect-[4/3]"
          src={image.imageUrl}
          title={image.fileName}
        />
        <Badge className="absolute top-3 left-3 h-7 rounded-full border-semantic-error/20 bg-semantic-error/10 px-3 text-semantic-error">
          {reason}
        </Badge>
      </div>
    </article>
  );
}

function LowQualityPhotosStrip({
  images,
  isError,
  isPending,
}: {
  images: CollectionLowQualityImage[];
  isError: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return <WorkflowImageStripSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-hairline-strong bg-surface-card p-5 text-sm text-body">
        Unable to load low quality photos.
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-hairline-strong bg-surface-card p-5 text-sm text-body">
        No low quality images found.
      </div>
    );
  }

  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
      {images.map((image) => (
        <LowQualityPhotoCard key={image.id} image={image} />
      ))}
    </div>
  );
}

export function ResultsWorkflows({
  collectionId,
  lowQuality,
  similarGroups,
  isLowQualityError,
  isLowQualityPending,
  isSimilarGroupsError,
  isSimilarGroupsPending,
}: {
  collectionId: string;
  lowQuality?: CollectionLowQualityImagesResponse;
  similarGroups?: CollectionGroupPreviewsResponse;
  isLowQualityError: boolean;
  isLowQualityPending: boolean;
  isSimilarGroupsError: boolean;
  isSimilarGroupsPending: boolean;
}) {
  const similarGroupsCount = similarGroups?.totalSimilarGroups ?? 0;
  const lowQualityCount = lowQuality?.totalLowQualityImages ?? 0;

  return (
    <div className="grid min-w-0 gap-5">
      <WorkflowSection
        count={`${similarGroupsCount} groups`}
        description="Compare visually similar photos and keep the best frame from each set."
        href={`/dashboard/collections/${collectionId}/results/groups`}
        title="Similar Groups"
      >
        <SimilarGroupsStrip
          groups={similarGroups?.groups ?? []}
          isError={isSimilarGroupsError}
          isPending={isSimilarGroupsPending}
        />
      </WorkflowSection>

      <WorkflowSection
        count={`${lowQualityCount} photos`}
        description="Check photos flagged for blur, focus issues, closed eyes, poor lighting, or duplication."
        href={`/dashboard/collections/${collectionId}/results/low-quality`}
        title="Low Quality Photos"
      >
        <LowQualityPhotosStrip
          images={lowQuality?.images ?? []}
          isError={isLowQualityError}
          isPending={isLowQualityPending}
        />
      </WorkflowSection>
    </div>
  );
}
