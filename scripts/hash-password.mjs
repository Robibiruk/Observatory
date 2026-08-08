#!/usr/bin/env node
// Helpers for the admin password.
//
//   Generate a hash + secret for a NEW password:
//     node scripts/hash-password.mjs "your-secret-password"
//
//   Check a password against a hash (pass the hash explicitly, or omit it to
//   read ADMIN_PASSWORD_HASH from .env):
//     node scripts/hash-password.mjs --check "your-password" "$2b$12$..."
//     node scripts/hash-password.mjs --check "your-password"
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

// Accept either a raw `$2b$12$...` bcrypt hash or its base64 form (the base64
// form is `$`-free, so it survives env-var UIs that mangle `$`).
function resolveHash(value) {
  if (value.startsWith("$2")) return value;
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    return decoded.startsWith("$2") ? decoded : value;
  } catch {
    return value;
  }
}

const [, , mode, argA, argB] = process.argv;

if (mode === "--check") {
  const password = argA ?? "";
  let hash = argB ?? "";
  if (!hash) {
    try {
      const envText = fs.readFileSync(path.join(root, ".env"), "utf8");
      const line = envText
        .split("\n")
        .find((l) => l.startsWith("ADMIN_PASSWORD_HASH="));
      hash = line ? line.slice("ADMIN_PASSWORD_HASH=".length).trim() : "";
    } catch {
      // no .env — fall through to the usage message
    }
  }
  if (!password || !hash) {
    console.error(
      'Usage: node scripts/hash-password.mjs --check "password" ["$2b$12$..." | base64]'
    );
    process.exit(1);
  }
  const ok = bcrypt.compareSync(password, resolveHash(hash));
  if (ok) {
    console.log("MATCH — that password produces that hash. Login will work.");
    process.exit(0);
  }
  console.log("NO MATCH — wrong password, or the hash value is corrupted.");
  process.exit(1);
}

const password = mode ?? "";
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password should be at least 8 characters.");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const secret = crypto.randomBytes(32).toString("hex");

// Base64 form is `$`-free — Netlify's env-var UI can mangle raw bcrypt hashes
// at the `$` signs, which silently breaks login. Prefer this value everywhere.
const b64 = Buffer.from(hash, "utf8").toString("base64");

console.log("\nAdd these to .env and Netlify:\n");
console.log(`ADMIN_PASSWORD_HASH=${b64}`);
console.log(`ADMIN_SECRET=${secret}`);
console.log(`\n(Raw bcrypt hash, also accepted — but only if pasted without mangling:)\n${hash}`);
