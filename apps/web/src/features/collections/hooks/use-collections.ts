import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  getCollectionGroup,
  getCollectionLowQualityImages,
  getCollectionResultsSummary,
  getCollectionsSummary,
  listCollections,
  listCollectionGroups,
  updateCollectionImageReview,
  updateCollectionGroupRepresentative,
  updateCollectionName,
} from "@/services/collections";
import type {
  CollectionLowQualityImagesResponse,
  CollectionResultsSummary,
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

export function useCollectionsSummary() {
  return useQuery({
    queryKey: queryKeys.collections.summary(),
    queryFn: getCollectionsSummary,
  });
}

export function useCollectionResultsSummary(collectionId: string) {
  return useQuery({
    queryKey: queryKeys.collections.resultsSummary(collectionId),
    queryFn: () => getCollectionResultsSummary(collectionId),
    enabled: collectionId.length > 0,
  });
}

export function useCollectionGroups(collectionId: string) {
  return useQuery({
    queryKey: queryKeys.collections.groups(collectionId),
    queryFn: () => listCollectionGroups(collectionId),
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
  return useQuery({
    queryKey: queryKeys.collections.lowQualityImages(collectionId, options),
    queryFn: () => getCollectionLowQualityImages(collectionId, options),
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
      queryClient.setQueryData<CollectionLowQualityImagesResponse>(
        queryKeys.collections.lowQualityImages(collectionId, options),
        (data) => {
          if (!data) {
            return data;
          }

          const { imageId, isSelected } = result.review;
          const matchesFilter =
            options.isSelected === undefined ||
            options.isSelected === isSelected;

          if (!matchesFilter) {
            return {
              ...data,
              images: data.images.filter((image) => image.id !== imageId),
              totalLowQualityImages: Math.max(0, data.totalLowQualityImages - 1),
            };
          }

          return {
            ...data,
            images: data.images.map((image) =>
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
          };
        },
      );
    },
  });
}

export function useUpdateCollectionName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, name }: { collectionId: string; name: string }) =>
      updateCollectionName(collectionId, name),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<CollectionResultsSummary>(
        queryKeys.collections.resultsSummary(variables.collectionId),
        (summary) =>
          summary
            ? { ...summary, collectionName: result.collection.name }
            : summary,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.list(),
      });
    },
  });
}

export function useUpdateCollectionGroupRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      groupId,
      representativeImageId,
    }: {
      collectionId: string;
      groupId: string;
      representativeImageId: string | null;
    }) =>
      updateCollectionGroupRepresentative(
        collectionId,
        groupId,
        representativeImageId,
      ),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.groups(variables.collectionId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.group(
          variables.collectionId,
          variables.groupId,
        ),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.collections.list(),
      });
    },
  });
}
