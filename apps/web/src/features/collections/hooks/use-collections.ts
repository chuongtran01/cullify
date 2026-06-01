import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  getCollectionsSummary,
  listCollections,
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
