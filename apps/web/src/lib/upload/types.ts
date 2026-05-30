export type UploadFileInput = {
  name: string;
  type: string;
  size: number;
};

export type CreateUploadSessionRequest = {
  files: UploadFileInput[];
};

export type PresignedUpload = {
  fileId: string;
  url: string;
  method: "PUT";
  headers: {
    "Content-Type": string;
  };
};

export type CreateUploadSessionResponse = {
  sessionId: string;
  expiresIn: number;
  uploads: PresignedUpload[];
};

export type UploadProgress = {
  completed: number;
  total: number;
  fileName: string;
};
