import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { getCollectionProgress } from "@/lib/db/collection-progress";
import { isUuid } from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await context.params;

  if (!isUuid(collectionId)) {
    return NextResponse.json({ error: "Invalid collection id" }, { status: 400 });
  }

  const progress = await getCollectionProgress(collectionId, userId);

  if (!progress) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }

  return NextResponse.json(progress);
}
