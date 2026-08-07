import type { Project } from "../data/types";

/** A technology node — admin-managed in the DB, or derived from projects. */
export type TechItem = {
  /** DB id — absent for locally-derived nodes. */
  id?: number;
  name: string;
  /** /devicons/*.svg path, or null if no devicon exists. */
  icon: string | null;
  count: number;
  /** Slugs of projects that use this tech. */
  projects: string[];
  sortOrder?: number;
};

export type TechGraph = {
  /** Nodes sorted by frequency (most-used first) for a stable layout. */
  nodes: TechItem[];
  bySlug: Map<string, TechItem>; // tech name -> node
  slugToTechs: Map<string, string[]>; // project slug -> tech names
};

// ---------------------------------------------------------------------------
// Tech -> devicon SVG. Only the techs that exist in devicon-master are mapped;
// the rest (GSAP, Recharts, OpenRouter, React Query, JWT, Chapa) have no
// devicon asset, so they render as a text chip fallback in the UI.
// When you add more techs, drop their SVGs into public/devicons/ and map them
// here.
// ---------------------------------------------------------------------------
export const TECH_ICON: Record<string, string> = {
  React: "/devicons/react.svg",
  Vite: "/devicons/vite.svg",
  Firebase: "/devicons/firebase.svg",
  "Framer Motion": "/devicons/framermotion.svg",
  Tailwind: "/devicons/tailwindcss.svg",
  Express: "/devicons/express.svg",
  MongoDB: "/devicons/mongodb.svg",
  "Three.js": "/devicons/threejs.svg",
  GSAP: "/devicons/gsap.svg",
  Recharts: "/devicons/recharts.svg",
  OpenRouter: "/devicons/openrouter.svg",
  "React Query": "/devicons/reactquery.svg",
  JWT: "/devicons/jwt.svg",
  TypeScript: "/devicons/typescript.svg",
  Zustand: "/devicons/zustand.svg",
};

/**
 * Derives the tech nodes from a set of projects' `stack` arrays — used for the
 * local fallback (pre-DB) and for the admin "import current site content".
 * Mirrors the old module-load-time behavior exactly.
 */
export function deriveTechFromProjects(projects: Project[]): TechItem[] {
  const map = new Map<string, TechItem>();
  projects.forEach((p) => {
    p.stack.forEach((tech) => {
      const node = map.get(tech) ?? {
        name: tech,
        icon: TECH_ICON[tech] ?? null,
        count: 0,
        projects: [] as string[],
      };
      node.count += 1;
      if (!node.projects.includes(p.slug)) node.projects.push(p.slug);
      map.set(tech, node);
    });
  });
  return Array.from(map.values());
}

/** Builds the graph used by the Constellation section from tech rows. */
export function buildTechGraph(tech: TechItem[]): TechGraph {
  const bySlug = new Map<string, TechItem>();
  const slugToTechs = new Map<string, string[]>();

  tech.forEach((t) => {
    bySlug.set(t.name, t);
    t.projects.forEach((slug) => {
      const list = slugToTechs.get(slug) ?? [];
      list.push(t.name);
      slugToTechs.set(slug, list);
    });
  });

  const nodes = [...tech].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );

  return { nodes, bySlug, slugToTechs };
}
