import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { updateCollectionGroupRepresentative } from "@/lib/db/collection-groups";
import { isUuid } from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string; groupId: string }>;
};

function parseRepresentativeImageId(body: unknown): string | null | undefined {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return undefined;
  }

  const value = (body as { representativeImageId?: unknown }).representativeImageId;

  if (value === null) {
    return null;
  }

  if (typeof value !== "string" || !isUuid(value)) {
    return undefined;
  }

  return value;
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

  const representativeImageId = parseRepresentativeImageId(body);

  if (representativeImageId === undefined) {
    return NextResponse.json(
      { error: "representativeImageId must be a UUID or null" },
      { status: 400 },
    );
  }

  try {
    const updated = await updateCollectionGroupRepresentative(
      collectionId,
      groupId,
      userId,
      representativeImageId,
    );

    if (!updated) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update group representative", error);

    return NextResponse.json(
      { error: "Failed to update group representative" },
      { status: 500 },
    );
  }
}
