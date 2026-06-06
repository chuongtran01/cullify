export const queryKeys = {
  collections: {
    all: ["collections"] as const,
    list: () => [...queryKeys.collections.all, "list"] as const,
    summary: () => [...queryKeys.collections.all, "summary"] as const,
    upload: () => [...queryKeys.collections.all, "upload"] as const,
    progress: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "progress"] as const,
    groups: (collectionId: string) =>
      [...queryKeys.collections.all, collectionId, "groups"] as const,
    group: (collectionId: string, groupId: string) =>
      [...queryKeys.collections.groups(collectionId), groupId] as const,
  },
} as const;
