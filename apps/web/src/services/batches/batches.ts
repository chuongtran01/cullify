import type { Batch } from "@/components/batches/types";

import { BatchesServiceError } from "@/services/batches/errors";

type ListBatchesResponse = {
  batches: Batch[];
};

export async function listBatches(): Promise<ListBatchesResponse> {
  const response = await fetch("/api/batches", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new BatchesServiceError(
      data.error ?? "Failed to load batches",
      response.status,
    );
  }

  return response.json() as Promise<ListBatchesResponse>;
}
