import { headers } from "next/headers";

// Forwards the end user's IP to the backend so its rate limiter can key on
// the real client. The shared secret lets the backend trust this header.
export async function clientIpHeaders(): Promise<Record<string, string>> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "";
  const secret = process.env.INTERNAL_API_SECRET;
  if (!ip || !secret) return {};
  return { "x-client-ip": ip, "x-internal-secret": secret };
}
