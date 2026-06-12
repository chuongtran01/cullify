import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { updateCollectionGroupSelection } from "@/lib/db/collection-groups";
import { isUuid } from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string; groupId: string }>;
};

function parseImageId(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return undefined;
  }

  const value = (body as { imageId?: unknown }).imageId;

  return typeof value === "string" ? value : undefined;
}

export async function PATCH(request: Request, context: RouteContext) {
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imageId = parseImageId(body);

  if (!imageId || !isUuid(imageId)) {
    return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
  }

  try {
    const result = await updateCollectionGroupSelection(
      collectionId,
      groupId,
      imageId,
      userId,
    );

    if (!result) {
      return NextResponse.json(
        { error: "Group image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update group selection", error);

    return NextResponse.json(
      { error: "Failed to update group selection" },
      { status: 500 },
    );
  }
}
