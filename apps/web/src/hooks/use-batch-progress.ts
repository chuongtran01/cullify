import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { getBatchProgress } from "@/services/progress";

const TERMINAL_STATUSES = new Set(["COMPLETED", "FAILED"]);
const POLL_INTERVAL_MS = 3_000;

export function useBatchProgress(batchId: string) {
  return useQuery({
    queryKey: queryKeys.batches.progress(batchId),
    queryFn: () => getBatchProgress(batchId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (!status || TERMINAL_STATUSES.has(status)) {
        return false;
      }

      return POLL_INTERVAL_MS;
    },
  });
}
