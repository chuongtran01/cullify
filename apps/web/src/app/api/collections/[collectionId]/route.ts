import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { updateUserCollectionName } from "@/lib/db/collections";
import { isUuid } from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await context.params;

  if (!isUuid(collectionId)) {
    return NextResponse.json({ error: "Invalid collection id" }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object" },
      { status: 400 },
    );
  }

  const name = (body as { name?: unknown }).name;

  if (typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (normalizedName.length > 100) {
    return NextResponse.json(
      { error: "Name must be at most 100 characters" },
      { status: 400 },
    );
  }

  const collection = await updateUserCollectionName(collectionId, userId, normalizedName);

  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }

  return NextResponse.json({ collection });
}
