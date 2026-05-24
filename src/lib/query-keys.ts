export const queryKeys = {
  upload: {
    all: ["upload"] as const,
    sessions: () => [...queryKeys.upload.all, "session"] as const,
  },
} as const;
