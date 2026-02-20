import { HTTPException } from "hono/http-exception";

export function getClientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  const cfIp = c.req.header("CF-Connecting-IP");
  if (cfIp) return cfIp;
  const forwarded = c.req.header("X-Forwarded-For");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export function assertHoneypotEmpty(hp: string | undefined): void {
  if ((hp ?? "").trim().length > 0) {
    throw new HTTPException(400, { message: "Invalid request" });
  }
}

function bucketStartIso(windowMinutes: number): string {
  const now = new Date();
  const minute = now.getUTCMinutes();
  const bucketMinute = minute - (minute % windowMinutes);
  now.setUTCMinutes(bucketMinute, 0, 0);
  return now.toISOString();
}

export async function enforceRateLimit(
  db: D1Database,
  keyPrefix: string,
  ip: string,
  maxRequests: number,
  windowMinutes = 1
): Promise<void> {
  const windowStart = bucketStartIso(windowMinutes);
  const key = `${keyPrefix}:${ip}:${windowStart}`;

  await db
    .prepare(
      `INSERT INTO request_throttle (key, count, window_start, updated_at)
       VALUES (?, 1, ?, ?)
       ON CONFLICT(key) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at`
    )
    .bind(key, windowStart, new Date().toISOString())
    .run();

  const row = await db
    .prepare("SELECT count FROM request_throttle WHERE key = ?")
    .bind(key)
    .first<{ count: number }>();

  const count = row?.count ?? 0;
  if (count > maxRequests) {
    throw new HTTPException(429, { message: "Too many requests. Please try again later." });
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}
