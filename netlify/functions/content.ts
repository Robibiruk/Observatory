import { db, ensureSchema } from "./_shared/db";
import {
  missionFromRow,
  projectFromRow,
  techFromRow,
} from "./_shared/mapping";
import { json, methodNotAllowed } from "./_shared/http";

type Row = Record<string, unknown>;

/**
 * Public content endpoint — serves everything the site renders. No auth needed
 * (this is the public portfolio). Falls through to a 500 so the client can
 * fall back to its bundled local data when the DB isn't configured yet.
 */
export const handler = async (event: {
  httpMethod: string;
  headers: Record<string, string | undefined>;
}) => {
  if (event.httpMethod !== "GET") return methodNotAllowed();
  if (!process.env.DATABASE_URL) {
    return json(500, {
      error: "Server error: DATABASE_URL env var is not set",
    });
  }
  try {
    await ensureSchema();
    const s = db();
    const [projects, missions, tech] = await Promise.all([
      s`SELECT * FROM projects ORDER BY sort_order ASC, id ASC`,
      s`SELECT * FROM missions ORDER BY sort_order ASC, id ASC`,
      s`SELECT * FROM tech ORDER BY sort_order ASC, id ASC`,
    ]);
    return json(200, {
      projects: (projects as Row[]).map(projectFromRow),
      missions: (missions as Row[]).map(missionFromRow),
      tech: (tech as Row[]).map(techFromRow),
    });
  } catch (err) {
    console.error("[content] failed:", err);
    return json(500, { error: "Content unavailable" });
  }
};
