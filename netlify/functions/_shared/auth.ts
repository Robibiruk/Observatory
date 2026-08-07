import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function secret(): Uint8Array {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set");
  return new TextEncoder().encode(s);
}

/** Constant-ish time bcrypt comparison against the ADMIN_PASSWORD_HASH env var. */
export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
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
