import { useMutation } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { createUploadSession } from "@/services/upload";

export function useCreateUploadSession() {
  return useMutation({
    mutationKey: queryKeys.upload.sessions(),
    mutationFn: createUploadSession,
  });
}
