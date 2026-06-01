import { useMutation } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { CollectionUploadProgress } from "@/services/collections";
import { uploadCollection } from "@/services/collections";

export function useUploadCollection() {
  return useMutation({
    mutationKey: queryKeys.collections.upload(),
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[];
      onProgress?: (progress: CollectionUploadProgress) => void;
    }) => uploadCollection(files, { onProgress }),
  });
}
