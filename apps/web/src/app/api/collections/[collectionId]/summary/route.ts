import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { getCollectionResultsSummary } from "@/lib/db/collection-results-summary";
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

  try {
    const summary = await getCollectionResultsSummary(collectionId, userId);

    if (!summary) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Failed to load collection summary", error);

    return NextResponse.json(
      { error: "Failed to load collection summary" },
      { status: 500 },
    );
  }
}
