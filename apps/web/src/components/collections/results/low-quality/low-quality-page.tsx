"use client";

import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LowQualityFilters,
  LOW_QUALITY_FILTER_SEARCH_PARAM,
  lowQualityFilterToIsSelected,
  parseLowQualityFilter,
  type LowQualityFilterValue,
} from "@/components/collections/results/low-quality/low-quality-filters";
import { LowQualityGridSkeleton } from "@/components/collections/results/low-quality/low-quality-grid-skeleton";
import { LowQualityHeader } from "@/components/collections/results/low-quality/low-quality-header";
import { LowQualityImageCard } from "@/components/collections/results/low-quality/low-quality-image-card";
import { LowQualityState } from "@/components/collections/results/low-quality/low-quality-state";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const activeFilter = parseLowQualityFilter(
    searchParams.get(LOW_QUALITY_FILTER_SEARCH_PARAM),
  );

  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [activeFilter]);

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
    limit,
    offset: 0,
    isSelected: lowQualityFilterToIsSelected(activeFilter),
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
      <LowQualityFilters
        activeFilter={activeFilter}
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
