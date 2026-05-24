export const queryKeys = {
  upload: {
    all: ["upload"] as const,
    batch: () => [...queryKeys.upload.all, "batch"] as const,
  },
} as const;
