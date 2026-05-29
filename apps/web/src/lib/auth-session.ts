import { auth } from "@/lib/auth";

export async function getRequestUserId(headers: Headers): Promise<string | null> {
  const session = await auth.api.getSession({ headers });

  return session?.user.id ?? null;
}
