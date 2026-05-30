import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { getBatchProgress } from "@/lib/db/batch-progress";
import { isUuid } from "@/lib/upload/validate";

type RouteContext = {
  params: Promise<{ batchId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { batchId } = await context.params;

  if (!isUuid(batchId)) {
    return NextResponse.json({ error: "Invalid batch id" }, { status: 400 });
  }

  const progress = await getBatchProgress(batchId, userId);

  if (!progress) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  return NextResponse.json(progress);
}
