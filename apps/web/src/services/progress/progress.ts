import type { BatchProgressData } from "@/components/progress/types";

import { ProgressServiceError } from "@/services/progress/errors";

type GetBatchProgressOptions = {
  headers?: Headers;
};

export async function getBatchProgress(
  batchId: string,
  options?: GetBatchProgressOptions,
): Promise<BatchProgressData> {
  const response = await fetch(buildProgressUrl(batchId), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...forwardAuthHeaders(options?.headers),
    },
    cache: "no-store",
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

function buildProgressUrl(batchId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL(`/api/batches/${batchId}/progress`, baseUrl).toString();
}

function forwardAuthHeaders(headers?: Headers): Record<string, string> {
  if (!headers) {
    return {};
  }

  const cookie = headers.get("cookie");

  return cookie ? { cookie } : {};
}
