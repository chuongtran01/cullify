import type {
  CreateUploadSessionRequest,
  CreateUploadSessionResponse,
  UploadProgress,
} from "@/lib/upload/types";

import { UploadR2Error, UploadSessionError } from "@/services/upload/errors";

type UploadProgressOptions = {
  onProgress?: (progress: UploadProgress) => void;
};

export async function createUploadSession(
  files: File[],
): Promise<CreateUploadSessionResponse> {
  const body: CreateUploadSessionRequest = {
    files: files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    })),
  };

  const response = await fetch("/api/upload-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new UploadSessionError(
      data.error ?? "Upload session failed",
      response.status,
    );
  }

  return response.json() as Promise<CreateUploadSessionResponse>;
}

async function putFileToR2(
  file: File,
  upload: CreateUploadSessionResponse["uploads"][number],
) {
  let response: Response;

  try {
    response = await fetch(upload.url, {
      method: upload.method,
      headers: upload.headers,
      body: file,
    });
  } catch {
    throw new UploadR2Error(
      `Failed to upload ${file.name}. Check R2 bucket CORS allows PUT from this origin.`,
    );
  }

  if (!response.ok) {
    throw new UploadR2Error(
      `Failed to upload ${file.name} (${response.status})`,
    );
  }
}

export async function uploadFilesToR2(
  files: File[],
  session: CreateUploadSessionResponse,
  options?: UploadProgressOptions,
): Promise<void> {
  if (files.length !== session.uploads.length) {
    throw new UploadR2Error("Upload session does not match selected files");
  }

  const total = files.length;
  let completed = 0;

  await Promise.all(
    files.map(async (file, index) => {
      const upload = session.uploads[index];
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

async function completeUploadSession(
  session: CreateUploadSessionResponse,
): Promise<void> {
  const response = await fetch(
    `/api/upload-sessions/${session.sessionId}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileIds: session.uploads.map((upload) => upload.fileId),
      }),
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new UploadSessionError(
      data.error ?? "Failed to complete upload session",
      response.status,
    );
  }
}

export async function uploadBatch(
  files: File[],
  options?: UploadProgressOptions,
): Promise<CreateUploadSessionResponse> {
  const session = await createUploadSession(files);
  await uploadFilesToR2(files, session, options);
  await completeUploadSession(session);
  return session;
}
