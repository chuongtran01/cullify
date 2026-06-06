import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import {
  DEFAULT_LOW_QUALITY_LIMIT,
  getCollectionLowQualityImages,
  MAX_LOW_QUALITY_LIMIT,
} from "@/lib/db/collection-low-quality-images";
import { isUuid } from "@/services/collections/validate";

type RouteContext = {
  params: Promise<{ collectionId: string }>;
};

function parseBoundedInteger(
  value: string | null,
  defaultValue: number,
  min: number,
  max: number,
): number {
  if (value === null) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  return Math.min(Math.max(Math.floor(parsed), min), max);
}

export async function GET(request: Request, context: RouteContext) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await context.params;

  if (!isUuid(collectionId)) {
    return NextResponse.json({ error: "Invalid collection id" }, { status: 400 });
  }

  const url = new URL(request.url);
  const limit = parseBoundedInteger(
    url.searchParams.get("limit"),
    DEFAULT_LOW_QUALITY_LIMIT,
    1,
    MAX_LOW_QUALITY_LIMIT,
  );
  const offset = parseBoundedInteger(
    url.searchParams.get("offset"),
    0,
    0,
    Number.MAX_SAFE_INTEGER,
  );

  try {
    const lowQualityImages = await getCollectionLowQualityImages(
      collectionId,
      userId,
      { limit, offset },
    );

    if (!lowQualityImages) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(lowQualityImages);
  } catch (error) {
    console.error("Failed to load low quality images", error);

    return NextResponse.json(
      { error: "Failed to load low quality images" },
      { status: 500 },
    );
  }
}
