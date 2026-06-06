import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  getCollectionGroup,
  getCollectionLowQualityImages,
  getCollectionResultsSummary,
  getCollectionsSummary,
  listCollections,
  listCollectionGroups,
  updateCollectionGroupRepresentative,
  updateCollectionName,
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

export function useCollectionLowQualityImages(collectionId: string) {
  return useQuery({
    queryKey: queryKeys.collections.lowQualityImages(collectionId),
    queryFn: () => getCollectionLowQualityImages(collectionId),
    enabled: collectionId.length > 0,
  });
}

export function useUpdateCollectionName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, name }: { collectionId: string; name: string }) =>
      updateCollectionName(collectionId, name),
    onSuccess: () => {
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
