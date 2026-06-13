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
  reviewedImages?: number;
  keptImages?: number;
  rejectedImages?: number;
  errorMessage?: string;
};

export type CollectionFilterValue =
  | "ALL"
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "COMPLETED"
  | "FAILED";
