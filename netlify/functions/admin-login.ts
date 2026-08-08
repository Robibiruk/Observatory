import {
  resolvePasswordHash,
  signSessionToken,
  storedHashLooksValid,
  verifyPassword,
} from "./_shared/auth";
import { json, methodNotAllowed, parseBody } from "./_shared/http";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter. State resets on cold start, which is fine for
// a personal site — it still stops an obvious brute-force burst. Keyed by the
// client IP Netlify reports.
// ---------------------------------------------------------------------------
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

const attempts = new Map<string, { count: number; blockedUntil: number }>();

function prune() {
  if (attempts.size < 500) return;
  const now = Date.now();
  for (const [ip, rec] of attempts) {
    if (now - rec.blockedUntil > BLOCK_MS && rec.count === 0) attempts.delete(ip);
  }
}

export const handler = async (event: {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}) => {
  if (event.httpMethod !== "POST") return methodNotAllowed();

  // Give an actionable error instead of a generic 401 when the server isn't
  // configured yet — a 401 always means "wrong password" afterwards.
  if (!process.env.ADMIN_PASSWORD_HASH) {
    return json(500, {
      error: "Server error: ADMIN_PASSWORD_HASH env var is not set",
    });
  }
  if (!process.env.ADMIN_SECRET) {
    return json(500, {
      error: "Server error: ADMIN_SECRET env var is not set",
    });
  }

  // A stored hash that doesn't parse as bcrypt means the env value was mangled
  // (typically `$` signs stripped/truncated by an env-var editor). Surface that
  // instead of silently returning 401 for every password.
  if (!storedHashLooksValid()) {
    return json(500, {
      error:
        "ADMIN_PASSWORD_HASH looks corrupt (not a valid bcrypt hash). " +
        "Re-copy it from .env exactly — the base64 form is recommended — " +
        "then redeploy.",
    });
  }

  prune();
  const ip =
    event.headers?.["x-nf-client-connection-ip"] ??
    event.headers?.["x-forwarded-for"] ??
    "unknown";
  const now = Date.now();
  const rec = attempts.get(ip);

  if (rec && rec.blockedUntil > now) {
    return json(429, { error: "Too many attempts. Try again in a few minutes." });
  }

  const { password } = parseBody<{ password?: string }>(event.body);
  if (typeof password !== "string" || password.length === 0) {
    return json(400, { error: "Password required" });
  }

  const ok = await verifyPassword(password);
  if (!ok) {
    const count = (rec?.count ?? 0) + 1;
    attempts.set(ip, {
      count,
      blockedUntil: count >= MAX_ATTEMPTS ? now + BLOCK_MS : 0,
    });
    // Non-secret fingerprint of what the stored hash resolved to, so a stale or
    // base64-not-yet-decoded value is diagnosable from the 401 alone.
    const h = resolvePasswordHash();
    return json(401, {
      error: "Incorrect password",
      debug: { hashLength: h.length, hashPrefix: h.slice(0, 4) },
    });
  }

  attempts.delete(ip);
  try {
    const token = await signSessionToken();
    return json(200, { token });
  } catch (err) {
    console.error("[admin-login] sign failed:", err);
    return json(500, { error: "Login unavailable" });
  }
};
