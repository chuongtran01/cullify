import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { listBatches } from "@/services/batches";

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
