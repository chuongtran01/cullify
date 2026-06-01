import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { listUserCollections } from "@/lib/db/collections";

export async function GET(request: Request) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collections = await listUserCollections(userId);

    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Failed to list collections", error);

    return NextResponse.json(
      { error: "Failed to load collections" },
      { status: 500 },
    );
  }
}
