import { NextResponse } from "next/server";

import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    const redis = await getRedis();
    const pong = await redis.ping();

    return NextResponse.json({ ok: true, redis: pong });
  } catch (error) {
    console.error("Redis health check failed", error);

    return NextResponse.json(
      { ok: false, error: "Redis is not available" },
      { status: 503 },
    );
  }
}

