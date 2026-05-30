export const queryKeys = {
  upload: {
    all: ["upload"] as const,
    batch: () => [...queryKeys.upload.all, "batch"] as const,
  },
  batches: {
    all: ["batches"] as const,
    progress: (batchId: string) =>
      [...queryKeys.batches.all, batchId, "progress"] as const,
  },
} as const;
