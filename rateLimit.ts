import type { NextRequest } from "next/server";

type Req = Request | NextRequest;

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function getClientIp(req: Req): string {
  const xf = req.headers.get("x-forwarded-for") || req.headers.get("X-Forwarded-For");
  if (xf) {
    const first = String(xf).split(",")[0].trim();
    if (first) return first;
  }
  // Fallback to user-agent as a coarse key to avoid blocking all users in dev
  const ua = req.headers.get("user-agent") || "unknown";
  return `ua:${ua}`;
}

export function rateLimit(req: Req, opts: { limit: number; intervalMs: number }) {
  const key = getClientIp(req);
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.intervalMs });
    return { allowed: true, remaining: opts.limit - 1, resetAt: now + opts.intervalMs };
  }
  if (bucket.count < opts.limit) {
    bucket.count += 1;
    return { allowed: true, remaining: opts.limit - bucket.count, resetAt: bucket.resetAt };
  }
  return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
}