// Wire types + row<->wire mappers. The wire shapes are intentionally identical
// to the client-side types (src/data/types.ts) so the frontend store can consume
// them directly. DB columns are snake_case; the wire is camelCase.

export type ProjectStatus = "live" | "in-progress" | "prototype";
export type ProjectPosition = "observatory" | "gallery" | "both";

export type ProjectWire = {
  id: number;
  slug: string;
  title: string;
  oneLiner: string;
  status: ProjectStatus;
  featured: boolean;
  position: ProjectPosition;
  image: string;
  alt: string;
  links: { live?: string; repo?: string };
  overview: string;
  architecture?: string;
  features?: string[];
  lessons?: string;
  stack: string[];
  sortOrder: number;
};

export type MissionStatus = "complete" | "live" | "future";

export type MissionWire = {
  id: number;
  mission: string;
  chapter: string;
  chapterLabel: string;
  year: string;
  title: string;
  detail: string;
  badge: string;
  status: MissionStatus;
  stack: string[];
  links: { live?: string; repo?: string };
  certificate?: { image: string; pdf?: string; alt: string; caption?: string };
  sortOrder: number;
};

export type TechWire = {
  id: number;
  name: string;
  icon: string | null;
  count: number;
  /** Slugs of projects that use this tech. */
  projects: string[];
  sortOrder: number;
};

export type TableKey = "projects" | "missions" | "tech";

type Row = Record<string, unknown>;

const first = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const bool = (v: unknown, fallback = false) => (v == null ? fallback : Boolean(v));
const arr = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (typeof v === "string" && v) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
};
const optStr = (v: unknown): string | undefined => {
  const s = first(v);
  return s ? s : undefined;
};

// ---------------------------------------------------------------- row -> wire

export function projectFromRow(r: Row): ProjectWire {
  return {
    id: Number(r.id),
    slug: first(r.slug),
    title: first(r.title),
    oneLiner: first(r.one_liner),
    status: first(r.status, "live") as ProjectStatus,
    featured: bool(r.featured),
    position: first(r.position, "both") as ProjectPosition,
    image: first(r.image),
    alt: first(r.alt),
    links: { live: optStr(r.live_url), repo: optStr(r.repo_url) },
    overview: first(r.overview),
    architecture: optStr(r.architecture),
    features: arr(r.features),
    lessons: optStr(r.lessons),
    stack: arr(r.stack),
    sortOrder: Number(r.sort_order ?? 0),
  };
}

export function missionFromRow(r: Row): MissionWire {
  const hasCert = Boolean(r.certificate_image);
  return {
    id: Number(r.id),
    mission: first(r.mission),
    chapter: first(r.chapter),
    chapterLabel: first(r.chapter_label),
    year: first(r.year),
    title: first(r.title),
    detail: first(r.detail),
    badge: first(r.badge),
    status: first(r.status, "complete") as MissionStatus,
    stack: arr(r.stack),
    links: { live: optStr(r.live_url), repo: optStr(r.repo_url) },
    certificate: hasCert
      ? {
          image: first(r.certificate_image),
          pdf: optStr(r.certificate_pdf),
          alt: first(r.certificate_alt),
          caption: optStr(r.certificate_caption),
        }
      : undefined,
    sortOrder: Number(r.sort_order ?? 0),
  };
}

export function techFromRow(r: Row): TechWire {
  return {
    id: Number(r.id),
    name: first(r.name),
    icon: optStr(r.icon) ?? null,
    count: Number(r.count ?? 1),
    projects: arr(r.project_slugs),
    sortOrder: Number(r.sort_order ?? 0),
  };
}

// ---------------------------------------------------------------- write SQL
// Values are always bound as parameters (tagged template) or via unsafe(); the
// only identifiers ever inlined are table names from the fixed TABLE whitelist.

const TABLE: Record<TableKey, string> = {
  projects: "projects",
  missions: "missions",
  tech: "tech",
};

type Sql = ReturnType<typeof import("@neondatabase/serverless").neon>;

export function insertProject(s: Sql, p: ProjectWire) {
  return s`
    INSERT INTO projects
      (slug, title, one_liner, status, featured, position, image, alt,
       live_url, repo_url, overview, architecture, features, lessons, stack, sort_order)
    VALUES
      (${p.slug}, ${p.title}, ${p.oneLiner ?? ""}, ${p.status}, ${p.featured},
       ${p.position ?? "both"}, ${p.image ?? ""}, ${p.alt ?? ""},
       ${p.links?.live ?? ""}, ${p.links?.repo ?? ""}, ${p.overview ?? ""},
       ${p.architecture ?? ""}, ${JSON.stringify(p.features ?? [])},
       ${p.lessons ?? ""}, ${JSON.stringify(p.stack ?? [])}, ${p.sortOrder ?? 0})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, one_liner = EXCLUDED.one_liner,
      status = EXCLUDED.status, featured = EXCLUDED.featured,
      position = EXCLUDED.position, image = EXCLUDED.image, alt = EXCLUDED.alt,
      live_url = EXCLUDED.live_url, repo_url = EXCLUDED.repo_url,
      overview = EXCLUDED.overview, architecture = EXCLUDED.architecture,
      features = EXCLUDED.features, lessons = EXCLUDED.lessons,
      stack = EXCLUDED.stack, sort_order = EXCLUDED.sort_order
    RETURNING id`;
}

export function insertMission(s: Sql, m: MissionWire) {
  return s`
    INSERT INTO missions
      (mission, chapter, chapter_label, year, title, detail, badge, status,
       stack, live_url, repo_url, certificate_image, certificate_pdf,
       certificate_alt, certificate_caption, sort_order)
    VALUES
      (${m.mission}, ${m.chapter ?? ""}, ${m.chapterLabel ?? ""}, ${m.year ?? ""},
       ${m.title ?? ""}, ${m.detail ?? ""}, ${m.badge ?? ""}, ${m.status ?? "complete"},
       ${JSON.stringify(m.stack ?? [])}, ${m.links?.live ?? ""}, ${m.links?.repo ?? ""},
       ${m.certificate?.image ?? ""}, ${m.certificate?.pdf ?? ""},
       ${m.certificate?.alt ?? ""}, ${m.certificate?.caption ?? ""}, ${m.sortOrder ?? 0})
    ON CONFLICT (mission) DO UPDATE SET
      chapter = EXCLUDED.chapter, chapter_label = EXCLUDED.chapter_label,
      year = EXCLUDED.year, title = EXCLUDED.title, detail = EXCLUDED.detail,
      badge = EXCLUDED.badge, status = EXCLUDED.status, stack = EXCLUDED.stack,
      live_url = EXCLUDED.live_url, repo_url = EXCLUDED.repo_url,
      certificate_image = EXCLUDED.certificate_image,
      certificate_pdf = EXCLUDED.certificate_pdf,
      certificate_alt = EXCLUDED.certificate_alt,
      certificate_caption = EXCLUDED.certificate_caption,
      sort_order = EXCLUDED.sort_order
    RETURNING id`;
}

export function insertTech(s: Sql, t: TechWire) {
  return s`
    INSERT INTO tech
      (name, icon, count, project_slugs, sort_order)
    VALUES
      (${t.name}, ${t.icon ?? ""}, ${t.count ?? 1},
       ${JSON.stringify(t.projects ?? [])}, ${t.sortOrder ?? 0})
    ON CONFLICT (name) DO UPDATE SET
      icon = EXCLUDED.icon, count = EXCLUDED.count,
      project_slugs = EXCLUDED.project_slugs, sort_order = EXCLUDED.sort_order
    RETURNING id`;
}

export function updateProject(s: Sql, p: ProjectWire) {
  return s.query(
    `UPDATE projects SET
       slug=$1, title=$2, one_liner=$3, status=$4, featured=$5, position=$6,
       image=$7, alt=$8, live_url=$9, repo_url=$10, overview=$11,
       architecture=$12, features=$13, lessons=$14, stack=$15, sort_order=$16
     WHERE id = $17`,
    [
      p.slug,
      p.title,
      p.oneLiner ?? "",
      p.status,
      p.featured,
      p.position ?? "both",
      p.image ?? "",
      p.alt ?? "",
      p.links?.live ?? "",
      p.links?.repo ?? "",
      p.overview ?? "",
      p.architecture ?? "",
      JSON.stringify(p.features ?? []),
      p.lessons ?? "",
      JSON.stringify(p.stack ?? []),
      p.sortOrder ?? 0,
      p.id,
    ]
  );
}

export function updateMission(s: Sql, m: MissionWire) {
  return s.query(
    `UPDATE missions SET
       mission=$1, chapter=$2, chapter_label=$3, year=$4, title=$5, detail=$6,
       badge=$7, status=$8, stack=$9, live_url=$10, repo_url=$11,
       certificate_image=$12, certificate_pdf=$13, certificate_alt=$14,
       certificate_caption=$15, sort_order=$16
     WHERE id = $17`,
    [
      m.mission,
      m.chapter ?? "",
      m.chapterLabel ?? "",
      m.year ?? "",
      m.title ?? "",
      m.detail ?? "",
      m.badge ?? "",
      m.status ?? "complete",
      JSON.stringify(m.stack ?? []),
      m.links?.live ?? "",
      m.links?.repo ?? "",
      m.certificate?.image ?? "",
      m.certificate?.pdf ?? "",
      m.certificate?.alt ?? "",
      m.certificate?.caption ?? "",
      m.sortOrder ?? 0,
      m.id,
    ]
  );
}

export function updateTech(s: Sql, t: TechWire) {
  return s.query(
    `UPDATE tech SET name=$1, icon=$2, count=$3, project_slugs=$4, sort_order=$5
     WHERE id = $6`,
    [
      t.name,
      t.icon ?? "",
      t.count ?? 1,
      JSON.stringify(t.projects ?? []),
      t.sortOrder ?? 0,
      t.id,
    ]
  );
}

export function deleteById(s: Sql, table: TableKey, id: number) {
  return s.query(`DELETE FROM ${TABLE[table]} WHERE id = $1`, [id]);
}

/**
 * Reassigns sort_order for the whole table. The admin edits filtered views
 * (e.g. only observatory projects), so provided ids keep their given order and
 * every OTHER row keeps its existing relative order, appended afterwards. That
 * way reordering one section never scrambles the others.
 */
export async function reorder(
  s: Sql,
  table: TableKey,
  orderedIds: number[]
) {
  const rows = (await s.query(
    `SELECT id FROM ${TABLE[table]} ORDER BY sort_order ASC, id ASC`
  )) as Row[];
  const all = rows.map((r) => Number(r.id));
  const given = new Set(orderedIds);
  const rest = all.filter((id) => !given.has(id));
  const next = [...orderedIds, ...rest];

  for (let i = 0; i < next.length; i++) {
    await s.query(`UPDATE ${TABLE[table]} SET sort_order = $1 WHERE id = $2`, [
      i,
      next[i],
    ]);
  }
}

export async function maxSortOrder(s: Sql, table: TableKey): Promise<number> {
  const rows = await s.query(
    `SELECT COALESCE(MAX(sort_order), -1) AS m FROM ${TABLE[table]}`
  );
  return Number((rows as Row[])[0]?.m ?? -1);
}
