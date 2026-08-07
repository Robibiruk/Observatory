import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let client: Sql | null = null;

/**
 * Returns a lazily-created Neon HTTP client. The serverless driver runs over
 * plain HTTP (no WebSockets), so it works on Netlify's Node runtime without
 * extra dependencies. The connection string is sanitized for the driver:
 * `channel_binding` is a libpq-only option the HTTP endpoint doesn't understand.
 */
export function db(): Sql {
  if (client) return client;
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set");
  const url = raw.replace(/&?channel_binding=[^&\s]*/gi, "");
  client = neon(url);
  return client;
}

/** Idempotent DDL — creates tables if they don't exist yet. Runs on every
 *  function invocation so a fresh deploy always has a schema. */
export async function ensureSchema(): Promise<void> {
  const s = db();
  await s`
    CREATE TABLE IF NOT EXISTS projects (
      id BIGSERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      one_liner TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'live',
      featured BOOLEAN NOT NULL DEFAULT false,
      position TEXT NOT NULL DEFAULT 'both',
      image TEXT NOT NULL DEFAULT '',
      alt TEXT NOT NULL DEFAULT '',
      live_url TEXT NOT NULL DEFAULT '',
      repo_url TEXT NOT NULL DEFAULT '',
      overview TEXT NOT NULL DEFAULT '',
      architecture TEXT NOT NULL DEFAULT '',
      features JSONB NOT NULL DEFAULT '[]'::jsonb,
      lessons TEXT NOT NULL DEFAULT '',
      stack JSONB NOT NULL DEFAULT '[]'::jsonb,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`;
  await s`
    CREATE TABLE IF NOT EXISTS missions (
      id BIGSERIAL PRIMARY KEY,
      mission TEXT NOT NULL UNIQUE,
      chapter TEXT NOT NULL DEFAULT '',
      chapter_label TEXT NOT NULL DEFAULT '',
      year TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT '',
      detail TEXT NOT NULL DEFAULT '',
      badge TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'complete',
      stack JSONB NOT NULL DEFAULT '[]'::jsonb,
      live_url TEXT NOT NULL DEFAULT '',
      repo_url TEXT NOT NULL DEFAULT '',
      certificate_image TEXT NOT NULL DEFAULT '',
      certificate_pdf TEXT NOT NULL DEFAULT '',
      certificate_alt TEXT NOT NULL DEFAULT '',
      certificate_caption TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    )`;
  await s`
    CREATE TABLE IF NOT EXISTS tech (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL DEFAULT '',
      count INTEGER NOT NULL DEFAULT 1,
      project_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`;
}
