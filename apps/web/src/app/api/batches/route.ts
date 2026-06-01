import { NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/auth-session";
import { listUserBatches } from "@/lib/db/batches";

export async function GET(request: Request) {
  const userId = await getRequestUserId(request.headers);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const batches = await listUserBatches(userId);

    return NextResponse.json({ batches });
  } catch (error) {
    console.error("Failed to list batches", error);

    return NextResponse.json(
      { error: "Failed to load batches" },
      { status: 500 },
    );
  }
}
