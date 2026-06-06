"use client";

import { AlertTriangle } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import { PhotoSurface } from "@/components/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollectionLowQualityImages } from "@/features/collections/hooks";
import { CollectionsServiceError, isUuid } from "@/services/collections";
import type { CollectionLowQualityImage } from "@/services/collections";

const PAGE_SIZE = 50;

function LowQualityImageCard({ image }: { image: CollectionLowQualityImage }) {
  return (
    <article className="overflow-hidden rounded-md border border-hairline bg-surface-card">
      <PhotoSurface
        className="aspect-[4/3]"
        src={image.imageUrl}
        title={image.fileName}
      />
      <div className="grid gap-3 p-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium text-ink">{image.fileName}</h2>
          <p className="mt-1 text-xs text-muted">Flagged for review</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {image.reasons.map((reason) => (
            <Badge
              key={reason}
              className="rounded-full border-coral-soft bg-coral/90 px-2.5 text-white"
            >
              {reason}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}

function LowQualityGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-md border border-hairline bg-surface-card"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="grid gap-3 p-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LowQualityImagesPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [limit, setLimit] = useState(PAGE_SIZE);

  if (!collectionId || !isUuid(collectionId)) {
    notFound();
  }

  const { data, error, isPending } = useCollectionLowQualityImages(collectionId, {
    limit,
    offset: 0,
  });

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  const images = data?.images ?? [];
  const total = data?.totalLowQualityImages ?? 0;

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-md border border-hairline bg-surface-card p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-muted">
            <AlertTriangle className="size-4" aria-hidden="true" />
            Low quality review
          </div>
          <h1 className="mt-3 text-3xl font-normal leading-tight text-ink">
            Low Quality Photos
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
            Review photos flagged for blur, focus issues, closed eyes, poor lighting,
            or compression artifacts.
          </p>
        </div>
        <Badge variant="outline" className="h-8 rounded-full px-3 text-sm text-body">
          {isPending ? "Loading..." : `${total} photos`}
        </Badge>
      </header>

      {isPending ? (
        <LowQualityGridSkeleton />
      ) : error ? (
        <section className="rounded-md border border-hairline bg-surface-card p-8 text-center">
          <h2 className="text-lg font-normal text-ink">
            Could not load low quality photos
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
            {error instanceof Error ? error.message : "Refresh the page and try again."}
          </p>
        </section>
      ) : images.length === 0 ? (
        <section className="rounded-md border border-hairline bg-surface-card p-8 text-center">
          <h2 className="text-lg font-normal text-ink">
            No low quality photos found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
            Nothing in this collection has been flagged by the quality analysis.
          </p>
        </section>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <LowQualityImageCard key={image.id} image={image} />
            ))}
          </div>
          {data?.hasMore ? (
            <div className="flex justify-center">
              <Button
                className="h-10 rounded-full px-5"
                variant="outline"
                onClick={() => setLimit((currentLimit) => currentLimit + PAGE_SIZE)}
              >
                Load More
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
