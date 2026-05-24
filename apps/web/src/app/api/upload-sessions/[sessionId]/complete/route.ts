import { NextResponse } from "next/server";

import { completeUploadSession } from "@/lib/db/upload-session";
import {
  isUuid,
  validateCompleteUploadSessionRequest,
} from "@/lib/upload/validate";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { sessionId } = await context.params;

  if (!isUuid(sessionId)) {
    return NextResponse.json({ error: "Invalid session id" }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateCompleteUploadSessionRequest(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const updated = await completeUploadSession(
      sessionId,
      validation.data.fileIds,
    );

    if (updated === null) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ sessionId, updated });
  } catch (error) {
    console.error("Failed to complete upload session", error);

    return NextResponse.json(
      { error: "Failed to complete upload session" },
      { status: 500 },
    );
  }
}
