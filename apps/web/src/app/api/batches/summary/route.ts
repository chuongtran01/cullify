import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { getUserBatchesSummary } from "@/lib/db/batches";

export async function GET(request: Request) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await getUserBatchesSummary(userId);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Failed to load batches summary", error);

    return NextResponse.json(
      { error: "Failed to load batches summary" },
      { status: 500 },
    );
  }
}
