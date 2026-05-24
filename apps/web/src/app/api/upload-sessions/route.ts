import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  createUploadSessionRecords,
  deleteUploadSession,
} from "@/lib/db/upload-session";
import { R2ConfigError } from "@/lib/r2/env";
import {
  createPresignedUpload,
  UPLOAD_URL_EXPIRES_IN_SECONDS,
} from "@/lib/r2/presign";
import type { CreateUploadSessionResponse } from "@/lib/upload/types";
import { validateCreateUploadSessionRequest } from "@/lib/upload/validate";

// Browser PUT uploads to presigned URLs require R2 bucket CORS configuration.
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateCreateUploadSessionRequest(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const sessionId = randomUUID();

  let records;

  try {
    records = await createUploadSessionRecords(sessionId, validation.data.files);
  } catch (error) {
    console.error("Failed to persist upload session", error);

    return NextResponse.json(
      { error: "Failed to create upload session" },
      { status: 500 },
    );
  }

  try {
    const uploads = await Promise.all(
      records.map((record) =>
        createPresignedUpload(sessionId, record.fileId, record.file),
      ),
    );

    const response: CreateUploadSessionResponse = {
      sessionId,
      expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
      uploads,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    await deleteUploadSession(sessionId);

    if (error instanceof R2ConfigError) {
      return NextResponse.json(
        { error: "Upload storage is not configured" },
        { status: 500 },
      );
    }

    console.error("Failed to create upload session", error);

    return NextResponse.json(
      { error: "Failed to create upload session" },
      { status: 500 },
    );
  }
}
