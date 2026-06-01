import type { Collection, CollectionFilterValue } from "@/components/collections/types";

export const mockCollections: Collection[] = [
  {
    id: "collection-001",
    name: "Spring Campaign Selects",
    status: "IN_REVIEW",
    totalImages: 187,
    processedImages: 187,
    createdAt: "2026-05-30T16:20:00Z",
    aiPicksCount: 42,
    groupsCount: 31,
    reviewedImages: 26,
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "collection-002",
    name: "Catalog Product Angles",
    status: "READY_FOR_REVIEW",
    totalImages: 324,
    processedImages: 324,
    createdAt: "2026-05-29T11:10:00Z",
    aiPicksCount: 68,
    groupsCount: 54,
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "collection-003",
    name: "Founder Portrait Session",
    status: "PROCESSING",
    totalImages: 324,
    processedImages: 201,
    createdAt: "2026-05-31T13:05:00Z",
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "collection-004",
    name: "Launch Event Floor",
    status: "COMPLETED",
    totalImages: 612,
    processedImages: 612,
    createdAt: "2026-05-25T19:30:00Z",
    completedAt: "2026-05-26T01:10:00Z",
    keptImages: 144,
    rejectedImages: 468,
    groupsCount: 92,
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=320&q=80",
    ],
  },
  {
    id: "collection-005",
    name: "Studio Lookbook Extras",
    status: "FAILED",
    totalImages: 92,
    processedImages: 18,
    createdAt: "2026-05-21T09:45:00Z",
    errorMessage: "18 photos processed before upload validation failed.",
    thumbnailUrls: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=320&q=80",
    ],
  },
];

export const collectionFilters: Array<{ label: string; value: CollectionFilterValue }> = [
  { label: "All", value: "ALL" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Ready for Review", value: "READY_FOR_REVIEW" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];
