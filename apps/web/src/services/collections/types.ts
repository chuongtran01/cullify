import type { CollectionStatus } from "@/components/collections/types";

export type CollectionUploadFileInput = {
  name: string;
  type: string;
  size: number;
};

export type CreateCollectionUploadRequest = {
  files: CollectionUploadFileInput[];
};

export type PresignedCollectionUpload = {
  fileId: string;
  url: string;
  method: "PUT";
  headers: {
    "Content-Type": string;
  };
};

export type CreateCollectionUploadResponse = {
  collectionId: string;
  expiresIn: number;
  uploads: PresignedCollectionUpload[];
};

export type CollectionUploadProgress = {
  completed: number;
  total: number;
  fileName: string;
};

export type CollectionGroupSummary = {
  id: string;
  collectionId: string;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionGroupImage = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  createdAt: string;
  imageUrl: string;
};

export type CollectionGroupDetail = CollectionGroupSummary & {
  images: CollectionGroupImage[];
};

export type CollectionGroupSelectionStatus = "SELECTED" | "NEEDS_SELECTION";

export type CollectionGroupPreview = CollectionGroupSummary & {
  previewImage: CollectionGroupImage;
  selectionStatus: CollectionGroupSelectionStatus;
};

export type CollectionGroupPreviewsResponse = {
  groups: CollectionGroupPreview[];
  totalSimilarGroups: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type CollectionGroupsResponse = CollectionGroupPreviewsResponse;

export type CollectionLowQualityImage = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  imageUrl: string;
  isSelected: boolean;
  decisionSource: string | null;
  decisionReason: string | null;
  reviewedAt: string | null;
  reasons: string[];
  createdAt: string;
};

export type CollectionLowQualityImagesResponse = {
  images: CollectionLowQualityImage[];
  totalLowQualityImages: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type CollectionImageReviewState = {
  imageId: string;
  isSelected: boolean;
  decisionSource: string;
  decisionReason: string;
  reviewedAt: string;
};

export type UpdateCollectionImageReviewResponse = {
  review: CollectionImageReviewState;
};

export type CollectionResultsSummary = {
  collectionId: string;
  collectionName: string;
  status: CollectionStatus;
  createdAt: string;
  totalPhotos: number;
  similarGroups: number;
  lowQualityImages: number;
};

export type CollectionResultsOverall = {
  summary: CollectionResultsSummary;
  similarGroups: CollectionGroupPreviewsResponse;
  lowQuality: CollectionLowQualityImagesResponse;
};
