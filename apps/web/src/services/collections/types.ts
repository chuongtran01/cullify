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
  representativeImageId: string | null;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionGroupsResponse = {
  groups: CollectionGroupSummary[];
  totalGroups: number;
  totalImages: number;
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

export type CollectionLowQualityImage = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  imageUrl: string;
  reasons: string[];
  createdAt: string;
};

export type CollectionLowQualityImagesResponse = {
  images: CollectionLowQualityImage[];
  totalLowQualityImages: number;
};
