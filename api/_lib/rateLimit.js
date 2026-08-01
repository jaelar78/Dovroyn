const buckets = globalThis.__dovroynRateLimitBuckets || new Map();
globalThis.__dovroynRateLimitBuckets = buckets;

export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetsAt <= now) {
    const next = { count: 1, resetsAt: now + windowMs };
    buckets.set(key, next);
    return { allowed: true, remaining: limit - 1, resetsAt: next.resetsAt };
  }
  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetsAt: existing.resetsAt,
  };
}

export function requestIdentity(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}
