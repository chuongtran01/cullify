"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

import { SelectedGridSkeleton } from "@/components/collections/results/selected/selected-grid-skeleton";
import { SelectedHeader } from "@/components/collections/results/selected/selected-header";
import { SelectedReviewTray } from "@/components/collections/results/selected/selected-review-tray";
import { SelectedState } from "@/components/collections/results/selected/selected-state";
import { useCollectionSelectedImages } from "@/features/collections/hooks";
import { CollectionsServiceError } from "@/services/collections";

const PAGE_SIZE = 50;

type SelectedPageProps = {
  collectionId: string;
};

export function SelectedPage({ collectionId }: SelectedPageProps) {
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useCollectionSelectedImages(collectionId, {
    limit: PAGE_SIZE,
    offset: 0,
  });
  const images = data?.pages.flatMap((page) => page.images) ?? [];
  const total = data?.pages[0]?.totalSelectedImages ?? 0;
  const activeImage =
    images.find((image) => image.id === activeImageId) ?? images[0] ?? null;

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <SelectedHeader isPending={isPending} total={total} />

      {isPending ? (
        <SelectedGridSkeleton />
      ) : error ? (
        <SelectedState
          title="Could not load selected photos"
          description={
            error instanceof Error ? error.message : "Refresh the page and try again."
          }
        />
      ) : images.length === 0 ? (
        <SelectedState
          title="No selected photos yet"
          description="Choose photos from similar groups or keep low-quality exceptions to build the final set."
        />
      ) : (
        activeImage ? (
          <SelectedReviewTray
            activeImage={activeImage}
            images={images}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onActiveImageChange={setActiveImageId}
            onLoadMore={() => void fetchNextPage()}
          />
        ) : null
      )}
    </div>
  );
}
