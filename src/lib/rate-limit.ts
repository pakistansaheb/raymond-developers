/**
 * Fixed-window rate limiter held in process memory.
 *
 * This exists so the magic-link form cannot be used to post sign-in mail at an
 * arbitrary address. It is per-instance: a serverless deployment running
 * several instances gives each its own window, so the effective ceiling is the
 * limit multiplied by the instance count. That is enough to stop a form being
 * hammered from one browser. For a hard global ceiling, move this to Upstash
 * Redis or Vercel KV — the call signature is designed to survive the swap.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets. Zero when `ok`. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client address. Vercel sets x-forwarded-for; the left-most entry
 * is the client. Falls back to a constant so a missing header tightens the
 * limit rather than removing it.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}
