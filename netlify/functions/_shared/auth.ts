import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function secret(): Uint8Array {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set");
  return new TextEncoder().encode(s);
}

/**
 * Resolve ADMIN_PASSWORD_HASH to a bcrypt hash string. The env var accepts the
 * raw `$2b$12$...` form OR its base64 encoding. Base64 is the recommended form:
 * bcrypt hashes start with `$` and some env-var UIs mangle values at `$`, which
 * silently breaks login. Base64 has no `$`.
 */
export function resolvePasswordHash(): string {
  const raw = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (raw.startsWith("$2")) return raw;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    return decoded.startsWith("$2") ? decoded : raw;
  } catch {
    return raw;
  }
}

/** True when the stored hash is structurally a valid bcrypt hash string. */
export function storedHashLooksValid(): boolean {
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(resolvePasswordHash());
}

/** Constant-time bcrypt comparison against the ADMIN_PASSWORD_HASH env var. */
export async function verifyPassword(password: string): Promise<boolean> {
  const hash = resolvePasswordHash();
  if (!hash || !password) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export async function signSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS)
    .sign(secret());
}

/** Returns true when the bearer token is a valid, unexpired admin session. */
export async function verifySessionToken(
  token: string | null | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

/** Extracts the bearer token from an event's Authorization header. */
export function readBearer(event: {
  headers: Record<string, string | undefined>;
}): string | null {
  const raw =
    event.headers?.["authorization"] ?? event.headers?.["Authorization"] ?? "";
  if (!raw.startsWith("Bearer ")) return null;
  return raw.slice("Bearer ".length).trim() || null;
}
