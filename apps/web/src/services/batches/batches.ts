import type { Batch, BatchesSummary } from "@/components/batches/types";
import type { BatchProgressData } from "@/components/progress/types";

import {
  BatchUploadError,
  BatchUploadStorageError,
  BatchesServiceError,
} from "@/services/batches/errors";
import type {
  BatchUploadProgress,
  CreateBatchUploadRequest,
  CreateBatchUploadResponse,
} from "@/services/batches/types";

type ListBatchesResponse = {
  batches: Batch[];
};

type BatchUploadProgressOptions = {
  onProgress?: (progress: BatchUploadProgress) => void;
};

export async function listBatches(): Promise<ListBatchesResponse> {
  const response = await fetch("/api/batches", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new BatchesServiceError(
      data.error ?? "Failed to load batches",
      response.status,
    );
  }

  return response.json() as Promise<ListBatchesResponse>;
}

export async function getBatchesSummary(): Promise<BatchesSummary> {
  const response = await fetch("/api/batches/summary", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new BatchesServiceError(
      data.error ?? "Failed to load batches summary",
      response.status,
    );
  }

  return response.json() as Promise<BatchesSummary>;
}

export async function getBatchProgress(
  batchId: string,
): Promise<BatchProgressData> {
  const response = await fetch(`/api/batches/${batchId}/progress`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new BatchesServiceError(
      data.error ?? "Failed to load batch progress",
      response.status,
    );
  }

  return response.json() as Promise<BatchProgressData>;
}

export async function createBatchUpload(
  files: File[],
): Promise<CreateBatchUploadResponse> {
  const body: CreateBatchUploadRequest = {
    files: files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    })),
  };

  const response = await fetch("/api/batches/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new BatchUploadError(
      data.error ?? "Batch upload failed",
      response.status,
    );
  }

  return response.json() as Promise<CreateBatchUploadResponse>;
}

async function putFileToR2(
  file: File,
  upload: CreateBatchUploadResponse["uploads"][number],
) {
  let response: Response;

  try {
    response = await fetch(upload.url, {
      method: upload.method,
      headers: upload.headers,
      body: file,
    });
  } catch {
    throw new BatchUploadStorageError(
      `Failed to upload ${file.name}. Check R2 bucket CORS allows PUT from this origin.`,
    );
  }

  if (!response.ok) {
    throw new BatchUploadStorageError(
      `Failed to upload ${file.name} (${response.status})`,
    );
  }
}

export async function uploadBatchFilesToStorage(
  files: File[],
  batchUpload: CreateBatchUploadResponse,
  options?: BatchUploadProgressOptions,
): Promise<void> {
  if (files.length !== batchUpload.uploads.length) {
    throw new BatchUploadStorageError(
      "Batch upload does not match selected files",
    );
  }

  const total = files.length;
  let completed = 0;

  await Promise.all(
    files.map(async (file, index) => {
      const upload = batchUpload.uploads[index];
      await putFileToR2(file, upload);
      completed += 1;
      options?.onProgress?.({
        completed,
        total,
        fileName: file.name,
      });
    }),
  );
}

async function completeBatchUpload(
  batchUpload: CreateBatchUploadResponse,
): Promise<void> {
  const response = await fetch(`/api/batches/${batchUpload.batchId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileIds: batchUpload.uploads.map((upload) => upload.fileId),
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new BatchUploadError(
      data.error ?? "Failed to complete batch upload",
      response.status,
    );
  }
}

export async function uploadBatch(
  files: File[],
  options?: BatchUploadProgressOptions,
): Promise<CreateBatchUploadResponse> {
  const batchUpload = await createBatchUpload(files);
  await uploadBatchFilesToStorage(files, batchUpload, options);
  await completeBatchUpload(batchUpload);
  return batchUpload;
}
