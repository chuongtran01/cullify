import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  getCollectionGroup,
  getCollectionLowQualityImages,
  getCollectionResultsOverall,
  getCollectionSelectedImages,
  listCollections,
  listCollectionGroups,
  updateCollectionGroupSelection,
  updateCollectionImageReview,
  updateCollectionName,
} from "@/services/collections";
import type {
  CollectionGroupDetail,
  CollectionGroupSelectionStatus,
  CollectionLowQualityImagesResponse,
  CollectionResultsOverall,
} from "@/services/collections";

const ACTIVE_STATUSES = new Set(["UPLOADING", "PROCESSING"]);
const POLL_INTERVAL_MS = 3_000;

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections.list(),
    queryFn: listCollections,
    refetchInterval: (query) => {
      const collections = query.state.data?.collections ?? [];
      const hasActiveCollection = collections.some((collection) =>
        ACTIVE_STATUSES.has(collection.status),
      );

      return hasActiveCollection ? POLL_INTERVAL_MS : false;
    },
  });
}

export function useCollectionResultsOverall(collectionId: string) {
  return useQuery({
    queryKey: queryKeys.collections.resultsOverall(collectionId),
    queryFn: () => getCollectionResultsOverall(collectionId),
    enabled: collectionId.length > 0,
  });
}

export function useCollectionGroups(
  collectionId: string,
  options: {
    limit?: number;
    offset?: number;
    selectionStatus?: CollectionGroupSelectionStatus;
  } = {},
) {
  const limit = options.limit;
  const selectionStatus = options.selectionStatus;
  const initialOffset = options.offset ?? 0;

  return useInfiniteQuery({
    queryKey: queryKeys.collections.groups(collectionId, options),
    queryFn: ({ pageParam }) =>
      listCollectionGroups(collectionId, {
        limit,
        offset: pageParam,
        selectionStatus,
      }),
    initialPageParam: initialOffset,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
    enabled: collectionId.length > 0,
  });
}

export function useCollectionGroup(collectionId: string, groupId: string) {
  return useQuery({
    queryKey: queryKeys.collections.group(collectionId, groupId),
    queryFn: () => getCollectionGroup(collectionId, groupId),
    enabled: collectionId.length > 0 && groupId.length > 0,
  });
}

export function useCollectionLowQualityImages(
  collectionId: string,
  options: { limit?: number; offset?: number; isSelected?: boolean } = {},
) {
  const { isSelected, limit } = options;
  const initialOffset = options.offset ?? 0;

  return useInfiniteQuery({
    queryKey: queryKeys.collections.lowQualityImages(collectionId, options),
    queryFn: ({ pageParam }) =>
      getCollectionLowQualityImages(collectionId, {
        isSelected,
        limit,
        offset: pageParam,
      }),
    initialPageParam: initialOffset,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
    enabled: collectionId.length > 0,
  });
}

export function useCollectionSelectedImages(
  collectionId: string,
  options: { limit?: number; offset?: number } = {},
) {
  const limit = options.limit;
  const initialOffset = options.offset ?? 0;

  return useInfiniteQuery({
    queryKey: queryKeys.collections.selectedImages(collectionId, options),
    queryFn: ({ pageParam }) =>
      getCollectionSelectedImages(collectionId, {
        limit,
        offset: pageParam,
      }),
    initialPageParam: initialOffset,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
    enabled: collectionId.length > 0,
  });
}

export function useUpdateCollectionImageReview(
  collectionId: string,
  options: { limit?: number; offset?: number; isSelected?: boolean } = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageId,
      isSelected,
    }: {
      imageId: string;
      isSelected: boolean;
    }) => updateCollectionImageReview(collectionId, imageId, isSelected),
    onSuccess: (result) => {
      queryClient.setQueryData<InfiniteData<CollectionLowQualityImagesResponse>>(
        queryKeys.collections.lowQualityImages(collectionId, options),
        (data) => {
          if (!data) {
            return data;
          }

          const { imageId, isSelected } = result.review;
          const previousImage = data.pages
            .flatMap((page) => page.images)
            .find((image) => image.id === imageId);
          const selectedDelta =
            previousImage && previousImage.isSelected !== isSelected
              ? isSelected
                ? 1
                : -1
              : 0;
          const counts = {
            needsReview: Math.max(
              0,
              (data.pages[0]?.counts.needsReview ?? 0) - selectedDelta,
            ),
            selected: Math.max(
              0,
              (data.pages[0]?.counts.selected ?? 0) + selectedDelta,
            ),
          };
          const totalImages = options.isSelected
            ? counts.selected
            : counts.needsReview;
          const matchesFilter = options.isSelected === isSelected;

          if (!matchesFilter) {
            return {
              ...data,
              pages: data.pages.map((page) => {
                const images = page.images.filter((image) => image.id !== imageId);

                return {
                  ...page,
                  counts,
                  images,
                  totalImages,
                  hasMore: page.offset + images.length < totalImages,
                };
              }),
            };
          }

          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              counts,
              totalImages,
              images: page.images.map((image) =>
                image.id === imageId
                  ? {
                      ...image,
                      isSelected: result.review.isSelected,
                      decisionSource: result.review.decisionSource,
                      decisionReason: result.review.decisionReason,
                      reviewedAt: result.review.reviewedAt,
                    }
                  : image,
              ),
              hasMore: page.offset + page.images.length < totalImages,
            })),
          };
        },
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.lowQualityImagesRoot(collectionId),
        refetchType: "none",
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.selectedImagesRoot(collectionId),
        refetchType: "none",
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.resultsOverall(collectionId),
        refetchType: "none",
      });
    },
  });
}

export function useUpdateCollectionGroupSelection(
  collectionId: string,
  groupId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId }: { imageId: string | null }) =>
      updateCollectionGroupSelection(collectionId, groupId, imageId),
    onSuccess: (result) => {
      queryClient.setQueryData<CollectionGroupDetail>(
        queryKeys.collections.group(collectionId, groupId),
        (group) =>
          group
            ? {
                ...group,
                images: group.images.map((image) => ({
                  ...image,
                  isSelected: image.id === result.selectedImageId,
                  decisionSource: result.decisionSource,
                  decisionReason: result.decisionReason,
                  reviewedAt: result.reviewedAt,
                })),
              }
            : group,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.groupsRoot(collectionId),
        refetchType: "none",
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.selectedImagesRoot(collectionId),
        refetchType: "none",
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.resultsOverall(collectionId),
        refetchType: "none",
      });
    },
  });
}

export function useUpdateCollectionName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, name }: { collectionId: string; name: string }) =>
      updateCollectionName(collectionId, name),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<CollectionResultsOverall>(
        queryKeys.collections.resultsOverall(variables.collectionId),
        (overall) =>
          overall
            ? {
                ...overall,
                summary: {
                  ...overall.summary,
                  collectionName: result.collection.name,
                },
              }
            : overall,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.list(),
      });
    },
  });
}
