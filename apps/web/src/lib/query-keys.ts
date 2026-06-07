export const queryKeys = {
  collections: {
    all: ["collections"] as const,
    list: () => [...queryKeys.collections.all, "list"] as const,
    summary: () => [...queryKeys.collections.all, "summary"] as const,
    resultsOverall: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "results", "overall"] as const,
    upload: () => [...queryKeys.collections.all, "upload"] as const,
    progress: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "progress"] as const,
    groups: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "groups"] as const,
    group: (collectionId: string, groupId: string) =>
      [...queryKeys.collections.groups(collectionId), groupId] as const,
    lowQualityImages: (
      collectionId: string,
      options?: { limit?: number; offset?: number; isSelected?: boolean },
    ) =>
      [
        ...queryKeys.collections.all,
        collectionId,
        "low-quality",
        options?.limit ?? null,
        options?.offset ?? null,
        options?.isSelected ?? null,
      ] as const,
  },
} as const;
