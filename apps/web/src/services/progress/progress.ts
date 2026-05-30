import type { BatchProgressData } from "@/components/progress/types";

import { ProgressServiceError } from "@/services/progress/errors";

export async function getBatchProgress(
  batchId: string,
): Promise<BatchProgressData> {
  const response = await fetch(`/api/batches/${batchId}/progress`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new ProgressServiceError(
      data.error ?? "Failed to load batch progress",
      response.status,
    );
  }

  return response.json() as Promise<BatchProgressData>;
}
