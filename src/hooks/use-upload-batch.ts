import { useMutation } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { UploadProgress } from "@/lib/upload/types";
import { uploadBatch } from "@/services/upload";

type UploadBatchVariables = {
  files: File[];
  onProgress?: (progress: UploadProgress) => void;
};

export function useUploadBatch() {
  return useMutation({
    mutationKey: queryKeys.upload.batch(),
    mutationFn: ({ files, onProgress }: UploadBatchVariables) =>
      uploadBatch(files, { onProgress }),
  });
}
