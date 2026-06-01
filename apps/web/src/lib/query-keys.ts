export const queryKeys = {
  collections: {
    all: ["collections"] as const,
    list: () => [...queryKeys.collections.all, "list"] as const,
    summary: () => [...queryKeys.collections.all, "summary"] as const,
    upload: () => [...queryKeys.collections.all, "upload"] as const,
    progress: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "progress"] as const,
  },
} as const;
