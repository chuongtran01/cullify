import { NextResponse } from "next/server";

import { completeCollectionUpload } from "@/lib/db/collection-upload";
import { getRequestUserId } from "@/lib/auth-session";
import { enqueueImageProcessingJob } from "@/lib/queues/image-processing";
import {
  isUuid,
  validateCompleteCollectionUploadRequest,
} from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await context.params;

  if (!isUuid(collectionId)) {
    return NextResponse.json({ error: "Invalid collection id" }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateCompleteCollectionUploadRequest(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const updated = await completeCollectionUpload(
      collectionId,
      userId,
      validation.data.fileIds,
    );

    if (updated === null) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const processingJob = await enqueueImageProcessingJob(collectionId);

    return NextResponse.json({
      collectionId,
      updated,
      processingJob: {
        id: processingJob.id,
        name: processingJob.name,
        queue: processingJob.queueName,
      },
    });
  } catch (error) {
    console.error("Failed to complete collection upload", error);

    return NextResponse.json(
      { error: "Failed to complete collection upload" },
      { status: 500 },
    );
  }
}
