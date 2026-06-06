"use client";

import { notFound } from "next/navigation";
import { useState } from "react";

import { LowQualityGridSkeleton } from "@/components/results/low-quality/low-quality-grid-skeleton";
import { LowQualityHeader } from "@/components/results/low-quality/low-quality-header";
import { LowQualityImageCard } from "@/components/results/low-quality/low-quality-image-card";
import { LowQualityState } from "@/components/results/low-quality/low-quality-state";
import { Button } from "@/components/ui/button";
import {
  useCollectionLowQualityImages,
  useUpdateCollectionImageReview,
} from "@/features/collections/hooks";
import { CollectionsServiceError } from "@/services/collections";

const PAGE_SIZE = 50;

type LowQualityPageProps = {
  collectionId: string;
};

export function LowQualityPage({ collectionId }: LowQualityPageProps) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const queryOptions = {
    limit,
    offset: 0,
  };
  const { data, error, isPending } = useCollectionLowQualityImages(
    collectionId,
    queryOptions,
  );
  const updateReview = useUpdateCollectionImageReview(collectionId, queryOptions);
  const images = data?.images ?? [];
  const total = data?.totalLowQualityImages ?? 0;

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <LowQualityHeader isPending={isPending} total={total} />

      {isPending ? (
        <LowQualityGridSkeleton />
      ) : error ? (
        <LowQualityState
          title="Could not load low quality photos"
          description={
            error instanceof Error ? error.message : "Refresh the page and try again."
          }
        />
      ) : images.length === 0 ? (
        <LowQualityState
          title="No low quality photos found"
          description="Nothing in this collection has been flagged by the quality analysis."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <LowQualityImageCard
                key={image.id}
                image={image}
                isSelecting={
                  updateReview.isPending &&
                  updateReview.variables?.imageId === image.id
                }
                onSelect={(imageId) =>
                  updateReview.mutate({ imageId, isSelected: true })
                }
              />
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
