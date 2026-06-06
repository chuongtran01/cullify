import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { listCollectionGroups } from "@/lib/db/collection-groups";
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
    const groups = await listCollectionGroups(collectionId, userId);

    if (!groups) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Failed to list collection groups", error);

    return NextResponse.json(
      { error: "Failed to load collection groups" },
      { status: 500 },
    );
  }
}
