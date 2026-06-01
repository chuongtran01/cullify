import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { getUserCollectionsSummary } from "@/lib/db/collections";

export async function GET(request: Request) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await getUserCollectionsSummary(userId);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Failed to load collections summary", error);

    return NextResponse.json(
      { error: "Failed to load collections summary" },
      { status: 500 },
    );
  }
}
