export type BatchUploadFileInput = {
  name: string;
  type: string;
  size: number;
};

export type CreateBatchUploadRequest = {
  files: BatchUploadFileInput[];
};

export type PresignedBatchUpload = {
  fileId: string;
  url: string;
  method: "PUT";
  headers: {
    "Content-Type": string;
  };
};

export type CreateBatchUploadResponse = {
  batchId: string;
  expiresIn: number;
  uploads: PresignedBatchUpload[];
};

export type BatchUploadProgress = {
  completed: number;
  total: number;
  fileName: string;
};
