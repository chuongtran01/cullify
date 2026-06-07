import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { getCollectionResultsOverall } from "@/lib/db/collection-results-overall";
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
    const overall = await getCollectionResultsOverall(collectionId, userId);

    if (!overall) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(overall);
  } catch (error) {
    console.error("Failed to load collection results overall", error);

    return NextResponse.json(
      { error: "Failed to load collection results overall" },
      { status: 500 },
    );
  }
}
