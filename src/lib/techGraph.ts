import { projects } from "../data/projects";
import type { Project } from "../data/types";

export type TechNode = {
  name: string;
  count: number;
  projects: string[]; // slugs using this tech
  icon: string | null; // /devicons/*.svg path, or null if no devicon exists
};

export type TechGraph = {
  nodes: TechNode[];
  bySlug: Map<string, TechNode>; // tech name -> node
  slugToTechs: Map<string, string[]>; // project slug -> tech names
};

// ---------------------------------------------------------------------------
// Tech -> devicon SVG. Only the 10 techs that exist in devicon-master are
// mapped; the rest (GSAP, Recharts, OpenRouter, React Query, JWT, Chapa) have
// no devicon asset, so they render as a text chip fallback in the UI.
// When you add more techs, drop their SVGs into public/devicons/ and map them
// here.
// ---------------------------------------------------------------------------
const TECH_ICON: Record<string, string> = {
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
  "OpenRouter": "/devicons/openrouter.svg",
  "React Query": "/devicons/reactquery.svg",
  JWT: "/devicons/jwt.svg",
  TypeScript: "/devicons/typescript.svg",
  Zustand: "/devicons/zustand.svg",
};

/**
 * Derives the Technology Constellation graph from the SAME data as the Projects
 * section, so the two can never drift out of sync. Run once at module load.
 */
function buildTechGraph(): TechGraph {
  const nodeMap = new Map<string, TechNode>();
  const slugToTechs = new Map<string, string[]>();

  projects.forEach((p: Project) => {
    const techs: string[] = [];
    p.stack.forEach((tech) => {
      techs.push(tech);
      const existing = nodeMap.get(tech);
      if (existing) {
        existing.count += 1;
        if (!existing.projects.includes(p.slug)) existing.projects.push(p.slug);
      } else {
        nodeMap.set(tech, {
          name: tech,
          count: 1,
          projects: [p.slug],
          icon: TECH_ICON[tech] ?? null,
        });
      }
    });
    slugToTechs.set(p.slug, techs);
  });

  // Order nodes by frequency (most-used tech first) for a stable layout.
  const nodes = Array.from(nodeMap.values()).sort((a, b) => b.count - a.count);

  return { nodes, bySlug: nodeMap, slugToTechs };
}

export const techGraph: TechGraph = buildTechGraph();
