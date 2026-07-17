import { useState } from "react";
import { motion } from "framer-motion";
import { techGraph } from "../lib/techGraph";
import { projects } from "../data/projects";
import { Section } from "../components/Section";

/**
 * Technology Constellation — nodes are distinct techs from projects.ts.
 * Hover OR keyboard-focus OR click a tech node highlights the connected project
 * cards and dims the rest. Never hover-only (accessibility requirement).
 */
export function Constellation({ glow = false }: { glow?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  const connectedSlugs = active
    ? techGraph.bySlug.get(active)?.projects ?? []
    : null;

  return (
    <Section id="constellation" className="section-pad" glow={glow}>
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">Technology Constellation</p>
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
          The tools I reach for
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Hover, tap, or focus a technology to see where it shows up across my
          work.
        </p>

        {/* Tech nodes */}
        <div className="mt-10 flex flex-wrap gap-3">
          {techGraph.nodes.map((node) => {
            const isActive = active === node.name;
            const isDimmed = active !== null && !isActive;
            return (
              <button
                key={node.name}
                onMouseEnter={() => setActive(node.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(node.name)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((a) => (a === node.name ? null : node.name))}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm transition-all ${
                  isActive
                    ? "border-primary bg-primary/20 text-highlight shadow-glow"
                    : isDimmed
                    ? "border-white/5 bg-white/[0.02] text-muted/50"
                    : "border-white/10 bg-surface text-text hover:border-primary/50"
                }`}
              >
                {node.icon ? (
                  <img
                    src={node.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-4 w-4 place-items-center rounded-[3px] bg-white/15 text-[8px] font-bold text-muted"
                  >
                    {node.name.charAt(0)}
                  </span>
                )}
                {node.name}
                <span className="ml-1 text-xs text-muted">{node.count}</span>
              </button>
            );
          })}
        </div>

        {/* Connected project cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const highlight =
              connectedSlugs === null || connectedSlugs.includes(p.slug);
            return (
              <motion.div
                key={p.slug}
                layout
                animate={{ opacity: highlight ? 1 : 0.3 }}
                className="glass rounded-2xl p-5"
              >
                <h3 className="font-display text-lg font-bold text-text">
                  {p.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(techGraph.slugToTechs.get(p.slug) ?? []).map((t) => (
                    <span
                      key={t}
                      className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                        active === t
                          ? "bg-primary/25 text-highlight"
                          : "bg-white/5 text-muted"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
