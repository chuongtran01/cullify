export type CollectionStatus =
  | "UPLOADING"
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "COMPLETED"
  | "FAILED";

export type Collection = {
  id: string;
  name: string;
  status: CollectionStatus;
  totalImages: number;
  processedImages: number;
  createdAt: string;
  completedAt?: string;
  aiPicksCount?: number;
  groupsCount?: number;
  reviewedImages?: number;
  keptImages?: number;
  rejectedImages?: number;
  thumbnailUrls: string[];
  errorMessage?: string;
};

export type CollectionsSummary = {
  totalCollections: number;
  needsReview: number;
  processing: number;
  totalPhotos: number;
};

export type CollectionFilterValue =
  | "ALL"
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "COMPLETED"
  | "FAILED";
