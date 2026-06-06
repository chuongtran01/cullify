import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { updateCollectionImageReview } from "@/lib/db/collection-image-reviews";
import { isUuid } from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string; imageId: string }>;
};

function parseIsSelected(body: unknown): boolean | undefined {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return undefined;
  }

  const value = (body as { isSelected?: unknown }).isSelected;

  return typeof value === "boolean" ? value : undefined;
}

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId, imageId } = await context.params;

  if (!isUuid(collectionId)) {
    return NextResponse.json({ error: "Invalid collection id" }, { status: 400 });
  }

  if (!isUuid(imageId)) {
    return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const isSelected = parseIsSelected(body);

  if (isSelected === undefined) {
    return NextResponse.json(
      { error: "isSelected must be a boolean" },
      { status: 400 },
    );
  }

  try {
    const review = await updateCollectionImageReview(
      collectionId,
      imageId,
      userId,
      isSelected,
    );

    if (!review) {
      return NextResponse.json(
        { error: "Low quality image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Failed to update image review", error);

    return NextResponse.json(
      { error: "Failed to update image review" },
      { status: 500 },
    );
  }
}
