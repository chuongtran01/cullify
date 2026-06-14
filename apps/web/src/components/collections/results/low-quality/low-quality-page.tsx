"use client";

import { useState } from "react";
import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  LowQualityFilters,
  LOW_QUALITY_FILTER_SEARCH_PARAM,
  lowQualityFilterToIsSelected,
  parseLowQualityFilter,
  type LowQualityFilterValue,
} from "@/components/collections/results/low-quality/low-quality-filters";
import { LowQualityGridSkeleton } from "@/components/collections/results/low-quality/low-quality-grid-skeleton";
import { LowQualityHeader } from "@/components/collections/results/low-quality/low-quality-header";
import { LowQualityReviewTray } from "@/components/collections/results/low-quality/low-quality-review-tray";
import { LowQualityState } from "@/components/collections/results/low-quality/low-quality-state";
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
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = parseLowQualityFilter(
    searchParams.get(LOW_QUALITY_FILTER_SEARCH_PARAM),
  );

  function handleFilterChange(filter: LowQualityFilterValue) {
    const params = new URLSearchParams(searchParams.toString());

    if (filter === "ALL") {
      params.delete(LOW_QUALITY_FILTER_SEARCH_PARAM);
    } else {
      params.set(LOW_QUALITY_FILTER_SEARCH_PARAM, filter);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const queryOptions = {
    limit: PAGE_SIZE,
    offset: 0,
    isSelected: lowQualityFilterToIsSelected(activeFilter),
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useCollectionLowQualityImages(collectionId, queryOptions);
  const updateReview = useUpdateCollectionImageReview(collectionId, queryOptions);
  const images = data?.pages.flatMap((page) => page.images) ?? [];
  const total = data?.pages[0]?.totalLowQualityImages ?? 0;
  const activeImage =
    images.find((image) => image.id === activeImageId) ?? images[0] ?? null;
  const loadedNeedsReviewCount = images.filter((image) => !image.isSelected).length;
  const loadedSelectedCount = images.filter((image) => image.isSelected).length;
  const filterCounts = {
    ALL: activeFilter === "ALL" ? total : images.length,
    NEEDS_REVIEW:
      activeFilter === "NEEDS_REVIEW" ? total : loadedNeedsReviewCount,
    SELECTED: activeFilter === "SELECTED" ? total : loadedSelectedCount,
  };

  function getNextImageId(imageId: string) {
    if (images.length <= 1) {
      return null;
    }

    const imageIndex = images.findIndex((image) => image.id === imageId);

    if (imageIndex === -1) {
      return images[0]?.id ?? null;
    }

    return images[imageIndex + 1]?.id ?? images[imageIndex - 1]?.id ?? null;
  }

  function handleSelect(imageId: string) {
    const nextImageId = getNextImageId(imageId);

    updateReview.mutate(
      { imageId, isSelected: true },
      {
        onSuccess: () => setActiveImageId(nextImageId),
      },
    );
  }

  function handleRemove(imageId: string) {
    const nextImageId = getNextImageId(imageId);

    updateReview.mutate(
      { imageId, isSelected: false },
      {
        onSuccess: () => setActiveImageId(nextImageId),
      },
    );
  }

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <LowQualityHeader isPending={isPending} total={total} />
      <LowQualityFilters
        activeFilter={activeFilter}
        counts={filterCounts}
        onFilterChange={handleFilterChange}
      />

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
          title={
            activeFilter === "ALL"
              ? "No low quality photos found"
              : "No photos match this filter"
          }
          description={
            activeFilter === "ALL"
              ? "Nothing in this collection has been flagged by the quality analysis."
              : "Try another review filter to see more photos."
          }
        />
      ) : (
        <>
          {activeImage ? (
            <LowQualityReviewTray
              activeImage={activeImage}
              images={images}
              isFetchingNextPage={isFetchingNextPage}
              isUpdatingActiveImage={
                updateReview.isPending &&
                updateReview.variables?.imageId === activeImage.id
              }
              hasNextPage={hasNextPage}
              onActiveImageChange={setActiveImageId}
              onLoadMore={() => void fetchNextPage()}
              onRemove={handleRemove}
              onSelect={handleSelect}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
