import { NextResponse } from "next/server";

import { completeBatchUpload } from "@/lib/db/batch-upload";
import { getRequestUserId } from "@/lib/auth-session";
import { enqueueImageProcessingJob } from "@/lib/queues/image-processing";
import {
  isUuid,
  validateCompleteBatchUploadRequest,
} from "@/services/batches/validate";

type RouteContext = {
  params: Promise<{ batchId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { batchId } = await context.params;

  if (!isUuid(batchId)) {
    return NextResponse.json({ error: "Invalid batch id" }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateCompleteBatchUploadRequest(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const updated = await completeBatchUpload(
      batchId,
      userId,
      validation.data.fileIds,
    );

    if (updated === null) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const processingJob = await enqueueImageProcessingJob(batchId);

    return NextResponse.json({
      batchId,
      updated,
      processingJob: {
        id: processingJob.id,
        name: processingJob.name,
        queue: processingJob.queueName,
      },
    });
  } catch (error) {
    console.error("Failed to complete batch upload", error);

    return NextResponse.json(
      { error: "Failed to complete batch upload" },
      { status: 500 },
    );
  }
}
