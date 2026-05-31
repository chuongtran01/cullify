export type BatchStatus =
  | "UPLOADING"
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "COMPLETED"
  | "FAILED";

export type Batch = {
  id: string;
  name: string;
  status: BatchStatus;
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

export type BatchFilterValue =
  | "ALL"
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "COMPLETED"
  | "FAILED";
