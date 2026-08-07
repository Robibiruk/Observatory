import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { museumProjects } from "../data/projects";
import { timeline as localTimeline } from "../data/timeline";
import type { Project, TimelineMilestone } from "../data/types";
import {
  buildTechGraph,
  deriveTechFromProjects,
  type TechGraph,
  type TechItem,
} from "./techGraph";

type ContentPayload = {
  projects: Project[];
  missions: TimelineMilestone[];
  tech: TechItem[];
};

type ContentState = {
  /** True once the fetch attempt has settled (success or fallback). */
  loaded: boolean;
  /** True when content came from the admin DB instead of bundled data. */
  fromDb: boolean;
  projects: Project[];
  /** Projects shown in the Projects Observatory bento (position !== gallery). */
  observatoryProjects: Project[];
  /** Projects shown in the Gallery marquee (position !== observatory). */
  galleryProjects: Project[];
  missions: TimelineMilestone[];
  tech: TechItem[];
  graph: TechGraph;
  refresh: () => Promise<void>;
};

const ContentContext = createContext<ContentState | null>(null);

/** Bundled local data — used before/if the DB isn't reachable (e.g. plain
 *  `npm run dev` without Netlify functions, or a deploy without env vars). */
function buildFallback(): Pick<ContentState, "projects" | "missions" | "tech"> {
  // museumProjects carries `position` (main apps = both, extras = gallery).
  const projects = museumProjects;
  // Match the old tech graph exactly: derived from the bento apps only.
  const tech = deriveTechFromProjects(
    projects.filter((p) => p.position !== "gallery")
  );
  return { projects, missions: localTimeline, tech };
}

const sortFeatured = (a: Project, b: Project) =>
  Number(b.featured) - Number(a.featured) ||
  (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

const sortByOrder = (
  a: { sortOrder?: number },
  b: { sortOrder?: number }
) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(buildFallback);
  const [fromDb, setFromDb] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/.netlify/functions/content");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Partial<ContentPayload>;
      if (
        Array.isArray(data.projects) &&
        Array.isArray(data.missions) &&
        Array.isArray(data.tech)
      ) {
        // Trust the DB even when empty — the admin decides what's shown.
        setContent({
          projects: data.projects,
          missions: data.missions,
          tech: data.tech,
        });
        setFromDb(true);
      }
    } catch {
      // Unreachable/not configured — keep the bundled fallback.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<ContentState>(() => {
    const observatoryProjects = [...content.projects]
      .sort(sortFeatured)
      .filter((p) => p.position !== "gallery");
    const galleryProjects = [...content.projects]
      .sort(sortByOrder)
      .filter((p) => p.position !== "observatory");
    const tech = [...content.tech].sort(sortByOrder);
    const graph = buildTechGraph(tech);
    return {
      loaded,
      fromDb,
      projects: content.projects,
      observatoryProjects,
      galleryProjects,
      missions: content.missions,
      tech,
      graph,
      refresh,
    };
  }, [content, loaded, fromDb, refresh]);

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent(): ContentState {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within <ContentProvider>");
  return ctx;
}
