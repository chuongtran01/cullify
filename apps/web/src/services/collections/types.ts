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
