import { db, ensureSchema } from "./_shared/db";
import { readBearer, verifySessionToken } from "./_shared/auth";
import {
  badRequest,
  json,
  methodNotAllowed,
  parseBody,
  unauthorized,
} from "./_shared/http";
import {
  deleteById,
  insertMission,
  insertProject,
  insertTech,
  maxSortOrder,
  reorder,
  updateMission,
  updateProject,
  updateTech,
  type MissionWire,
  type ProjectWire,
  type TableKey,
  type TechWire,
} from "./_shared/mapping";

type Row = Record<string, unknown>;

function isResource(v: unknown): v is TableKey {
  return v === "projects" || v === "missions" || v === "tech";
}

const badResource = () =>
  badRequest('"resource" must be one of: projects, missions, tech');

// ------------------------------------------------------------ action handlers

async function create(s: ReturnType<typeof db>, body: Record<string, unknown>) {
  const resource = body.resource;
  const item = body.item as Record<string, unknown> | undefined;
  if (!isResource(resource) || !item || typeof item !== "object") {
    return badResource();
  }
  const sortOrder =
    typeof item.sortOrder === "number"
      ? item.sortOrder
      : (await maxSortOrder(s, resource)) + 1;

  let rows: Row[];
  if (resource === "projects") {
    rows = (await insertProject(s, { ...item, sortOrder } as ProjectWire)) as Row[];
  } else if (resource === "missions") {
    rows = (await insertMission(s, { ...item, sortOrder } as MissionWire)) as Row[];
  } else {
    rows = (await insertTech(s, { ...item, sortOrder } as TechWire)) as Row[];
  }
  const id = Number(rows[0]?.id);
  return json(200, { item: { ...item, id, sortOrder } });
}

async function update(s: ReturnType<typeof db>, body: Record<string, unknown>) {
  const resource = body.resource;
  const id = body.id;
  const item = body.item as Record<string, unknown> | undefined;
  if (!isResource(resource) || id == null || !item || typeof item !== "object") {
    return badRequest('"resource", "id" and "item" are required');
  }
  const wire = { ...item, id: Number(id) };
  if (resource === "projects") {
    await updateProject(s, wire as ProjectWire);
  } else if (resource === "missions") {
    await updateMission(s, wire as MissionWire);
  } else {
    await updateTech(s, wire as TechWire);
  }
  return json(200, { item: wire });
}

async function remove(s: ReturnType<typeof db>, body: Record<string, unknown>) {
  const resource = body.resource;
  const id = body.id;
  if (!isResource(resource) || id == null) {
    return badRequest('"resource" and "id" are required');
  }
  await deleteById(s, resource, Number(id));
  return json(200, { ok: true });
}

async function reorderAction(
  s: ReturnType<typeof db>,
  body: Record<string, unknown>
) {
  const resource = body.resource;
  const orderedIds = body.orderedIds;
  if (!isResource(resource) || !Array.isArray(orderedIds)) {
    return badRequest('"resource" and "orderedIds[]" are required');
  }
  await reorder(s, resource, orderedIds.map(Number));
  return json(200, { ok: true });
}

/** Bulk upsert — used by the admin "import current site content" action. */
async function seed(s: ReturnType<typeof db>, body: Record<string, unknown>) {
  const projects = Array.isArray(body.projects) ? body.projects : [];
  const missions = Array.isArray(body.missions) ? body.missions : [];
  const tech = Array.isArray(body.tech) ? body.tech : [];

  for (let i = 0; i < projects.length; i++) {
    await insertProject(s, { ...(projects[i] as ProjectWire), sortOrder: i });
  }
  for (let i = 0; i < missions.length; i++) {
    await insertMission(s, { ...(missions[i] as MissionWire), sortOrder: i });
  }
  for (let i = 0; i < tech.length; i++) {
    await insertTech(s, { ...(tech[i] as TechWire), sortOrder: i });
  }
  return json(200, {
    inserted: { projects: projects.length, missions: missions.length, tech: tech.length },
  });
}

// ------------------------------------------------------------------- handler

export const handler = async (event: {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
  queryStringParameters: Record<string, string | undefined> | null;
}) => {
  if (event.httpMethod !== "POST") return methodNotAllowed();

  const authed = await verifySessionToken(readBearer(event));
  if (!authed) return unauthorized();

  const action = event.queryStringParameters?.action ?? "";
  const body = parseBody<Record<string, unknown>>(event.body);

  try {
    await ensureSchema();
    const s = db();
    switch (action) {
      case "create":
        return await create(s, body);
      case "update":
        return await update(s, body);
      case "delete":
        return await remove(s, body);
      case "reorder":
        return await reorderAction(s, body);
      case "seed":
        return await seed(s, body);
      case "verify":
        // Reached only with a valid token (auth check runs first).
        return json(200, { ok: true });
      default:
        return badRequest(`Unknown action: ${action}`);
    }
  } catch (err) {
    console.error("[admin] failed:", err);
    return json(500, { error: "Admin operation failed" });
  }
};
