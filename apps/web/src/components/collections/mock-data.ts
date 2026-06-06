import type { Collection, CollectionFilterValue } from "@/components/collections/types";

export const mockCollections: Collection[] = [
  {
    id: "collection-001",
    name: "Spring Campaign Selects",
    status: "IN_REVIEW",
    totalImages: 187,
    processedImages: 187,
    createdAt: "2026-05-30T16:20:00Z",
    reviewedImages: 26,
  },
  {
    id: "collection-002",
    name: "Catalog Product Angles",
    status: "READY_FOR_REVIEW",
    totalImages: 324,
    processedImages: 324,
    createdAt: "2026-05-29T11:10:00Z",
  },
  {
    id: "collection-003",
    name: "Founder Portrait Session",
    status: "PROCESSING",
    totalImages: 324,
    processedImages: 201,
    createdAt: "2026-05-31T13:05:00Z",
  },
  {
    id: "collection-004",
    name: "Launch Event Floor",
    status: "COMPLETED",
    totalImages: 612,
    processedImages: 612,
    createdAt: "2026-05-25T19:30:00Z",
    keptImages: 144,
    rejectedImages: 468,
  },
  {
    id: "collection-005",
    name: "Studio Lookbook Extras",
    status: "FAILED",
    totalImages: 92,
    processedImages: 18,
    createdAt: "2026-05-21T09:45:00Z",
    errorMessage: "18 photos processed before upload validation failed.",
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
