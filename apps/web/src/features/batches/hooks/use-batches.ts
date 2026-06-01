import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  getBatchesSummary,
  listBatches,
  updateBatchName,
} from "@/services/batches";

const ACTIVE_STATUSES = new Set(["UPLOADING", "PROCESSING"]);
const POLL_INTERVAL_MS = 3_000;

export function useBatches() {
  return useQuery({
    queryKey: queryKeys.batches.list(),
    queryFn: listBatches,
    refetchInterval: (query) => {
      const batches = query.state.data?.batches ?? [];
      const hasActiveBatch = batches.some((batch) =>
        ACTIVE_STATUSES.has(batch.status),
      );

      return hasActiveBatch ? POLL_INTERVAL_MS : false;
    },
  });
}

export function useBatchesSummary() {
  return useQuery({
    queryKey: queryKeys.batches.summary(),
    queryFn: getBatchesSummary,
  });
}

export function useUpdateBatchName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, name }: { batchId: string; name: string }) =>
      updateBatchName(batchId, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.batches.list(),
      });
    },
  });
}
