"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import type {
  ReviewResultsData,
  SimilarGroup,
} from "@/components/collections/results/overall/mock-data";
import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollectionLowQualityImages } from "@/features/collections/hooks";
import type { CollectionLowQualityImage } from "@/services/collections";

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
    <section className="min-w-0 overflow-hidden rounded-3xl border border-hairline bg-canvas p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl leading-tight font-normal text-ink">{title}</h2>
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
            className="h-10 gap-2 rounded-full border-hairline bg-surface-card px-4 hover:bg-surface-stone hover:cursor-pointer sm:shrink-0"
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
            className="h-10 gap-2 rounded-full border-hairline bg-surface-card px-4 hover:bg-surface-stone hover:cursor-pointer sm:shrink-0"
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

function SimilarGroupCard({ group }: { group: SimilarGroup }) {
  return (
    <article className="min-w-60 overflow-hidden rounded-2xl border border-hairline bg-surface-card">
      <div className="relative">
        <PhotoSurface className="aspect-[4/3]" src={group.src} title={group.name} />
        <Badge className="absolute top-3 left-3 h-7 rounded-full bg-primary px-3 text-on-primary">
          AI Pick
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium text-ink">{group.name}</h3>
        <p className="mt-1 text-sm text-body">{group.photoCount} photos in group</p>
      </div>
    </article>
  );
}

function LowQualityPhotoCard({ image }: { image: CollectionLowQualityImage }) {
  const reason = image.reasons[0] ?? "Low Quality";

  return (
    <article className="min-w-48 overflow-hidden rounded-2xl border border-hairline bg-surface-card">
      <div className="relative">
        <PhotoSurface
          className="aspect-[4/3]"
          src={image.imageUrl}
          title={image.fileName}
        />
        <Badge className="absolute top-3 left-3 h-7 rounded-full border-coral-soft bg-coral/90 px-3 text-white">
          {reason}
        </Badge>
      </div>
    </article>
  );
}

function LowQualityPhotosStrip({
  images,
  isPending,
}: {
  images: CollectionLowQualityImage[];
  isPending: boolean;
}) {
  if (isPending) {
    return (
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="min-w-48 overflow-hidden rounded-2xl border border-hairline bg-surface-card"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-hairline bg-surface-card p-5 text-sm text-body">
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
  data,
}: {
  data: Pick<ReviewResultsData, "similarGroups">;
}) {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId ?? "";
  const lowQualityImages = useCollectionLowQualityImages(collectionId, {
    limit: 5,
    isSelected: false,
  });
  const lowQualityCount =
    lowQualityImages.data?.totalLowQualityImages ??
    (lowQualityImages.isPending ? 0 : 0);

  return (
    <div className="grid min-w-0 gap-5">
      <WorkflowSection
        count={`${data.similarGroups.length} groups`}
        description="Compare visually similar photos and keep the best frame from each set."
        title="Similar Groups"
      >
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {data.similarGroups.map((group) => (
            <SimilarGroupCard group={group} key={group.id} />
          ))}
        </div>
      </WorkflowSection>

      <WorkflowSection
        count={`${lowQualityCount} photos`}
        description="Check photos flagged for blur, focus issues, closed eyes, poor lighting, or duplication."
        href={`/dashboard/collections/${collectionId}/results/low-quality`}
        title="Low Quality Photos"
      >
        <LowQualityPhotosStrip
          images={lowQualityImages.data?.images ?? []}
          isPending={lowQualityImages.isPending}
        />
      </WorkflowSection>
    </div>
  );
}
