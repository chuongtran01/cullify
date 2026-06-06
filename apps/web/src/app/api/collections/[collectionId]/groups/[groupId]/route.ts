import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { getCollectionGroup } from "@/lib/db/collection-groups";
import { isUuid } from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string; groupId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId, groupId } = await context.params;

  if (!isUuid(collectionId)) {
    return NextResponse.json({ error: "Invalid collection id" }, { status: 400 });
  }

  if (!isUuid(groupId)) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
  }

  try {
    const group = await getCollectionGroup(collectionId, groupId, userId);

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Failed to load collection group", error);

    return NextResponse.json(
      { error: "Failed to load collection group" },
      { status: 500 },
    );
  }
}
