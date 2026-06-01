import { useMutation } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { BatchUploadProgress } from "@/services/batches";
import { uploadBatch } from "@/services/batches";

export function useUploadBatch() {
  return useMutation({
    mutationKey: queryKeys.batches.upload(),
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[];
      onProgress?: (progress: BatchUploadProgress) => void;
    }) => uploadBatch(files, { onProgress }),
  });
}
