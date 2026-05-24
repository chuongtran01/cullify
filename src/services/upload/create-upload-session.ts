import type {
  CreateUploadSessionRequest,
  CreateUploadSessionResponse,
} from "@/lib/upload/types";

import { UploadSessionError } from "@/services/upload/errors";

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
