import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  createCollectionUploadRecords,
  deleteCollectionUpload,
} from "@/lib/db/collection-upload";
import { getRequestUserId } from "@/lib/auth-session";
import { R2ConfigError } from "@/lib/r2/env";
import {
  createPresignedUpload,
  UPLOAD_URL_EXPIRES_IN_SECONDS,
} from "@/lib/r2/presign";
import type { CreateCollectionUploadResponse } from "@/services/collections/types";
import { validateCreateCollectionUploadRequest } from "@/services/collections/validate";

// Browser PUT uploads to presigned URLs require R2 bucket CORS configuration.
export async function POST(request: Request) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateCreateCollectionUploadRequest(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const collectionId = randomUUID();

  let records;

  try {
    records = await createCollectionUploadRecords(
      collectionId,
      userId,
      validation.data.files,
    );
  } catch (error) {
    console.error("Failed to persist collection upload", error);

    return NextResponse.json(
      { error: "Failed to create collection upload" },
      { status: 500 },
    );
  }

  try {
    const uploads = await Promise.all(
      records.map((record) =>
        createPresignedUpload(record.fileId, record.objectKey, record.file),
      ),
    );

    const response: CreateCollectionUploadResponse = {
      collectionId,
      expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
      uploads,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    await deleteCollectionUpload(collectionId, userId);

    if (error instanceof R2ConfigError) {
      return NextResponse.json(
        { error: "Upload storage is not configured" },
        { status: 500 },
      );
    }

    console.error("Failed to create collection upload", error);

    return NextResponse.json(
      { error: "Failed to create collection upload" },
      { status: 500 },
    );
  }
}
