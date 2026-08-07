#!/usr/bin/env node
// Generates a bcrypt hash for your admin password plus a fresh ADMIN_SECRET.
//
//   node scripts/hash-password.mjs "your-secret-password"
//
// Put the printed values into .env (local dev) and into the Netlify UI
// (Site settings → Environment variables) for production.
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const password = process.argv[2];
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

console.log("\nAdd these to .env and Netlify:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_SECRET=${secret}`);
