export const queryKeys = {
  collections: {
    all: ["collections"] as const,
    list: () => [...queryKeys.collections.all, "list"] as const,
    resultsOverall: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "results", "overall"] as const,
    upload: () => [...queryKeys.collections.all, "upload"] as const,
    progress: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "progress"] as const,
    groupsRoot: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "groups"] as const,
    groups: (
      collectionId: string,
      options?: { limit?: number; offset?: number; selectionStatus?: string },
    ) =>
      [
        ...queryKeys.collections.groupsRoot(collectionId),
        options?.limit ?? null,
        options?.offset ?? null,
        options?.selectionStatus ?? null,
      ] as const,
    group: (collectionId: string, groupId: string) =>
      [...queryKeys.collections.groupsRoot(collectionId), "detail", groupId] as const,
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
    lowQualityImagesRoot: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "low-quality"] as const,
    selectedImages: (
      collectionId: string,
      options?: { limit?: number; offset?: number },
    ) =>
      [
        ...queryKeys.collections.selectedImagesRoot(collectionId),
        options?.limit ?? null,
        options?.offset ?? null,
      ] as const,
    selectedImagesRoot: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "selected"] as const,
  },
} as const;
