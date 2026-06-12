"use client";

import { notFound } from "next/navigation";

import { SelectedGridSkeleton } from "@/components/collections/results/selected/selected-grid-skeleton";
import { SelectedHeader } from "@/components/collections/results/selected/selected-header";
import { SelectedImageCard } from "@/components/collections/results/selected/selected-image-card";
import { SelectedState } from "@/components/collections/results/selected/selected-state";
import { Button } from "@/components/ui/button";
import { useCollectionSelectedImages } from "@/features/collections/hooks";
import { CollectionsServiceError } from "@/services/collections";

const PAGE_SIZE = 50;

type SelectedPageProps = {
  collectionId: string;
};

export function SelectedPage({ collectionId }: SelectedPageProps) {
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
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <SelectedImageCard key={image.id} image={image} />
            ))}
          </div>
          {hasNextPage ? (
            <div className="flex justify-center">
              <Button
                className="h-10 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
                variant="outline"
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
