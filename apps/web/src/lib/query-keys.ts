export const queryKeys = {
  batches: {
    all: ["batches"] as const,
    list: () => [...queryKeys.batches.all, "list"] as const,
    summary: () => [...queryKeys.batches.all, "summary"] as const,
    upload: () => [...queryKeys.batches.all, "upload"] as const,
    progress: (batchId: string) =>
      [...queryKeys.batches.all, batchId, "progress"] as const,
  },
} as const;
