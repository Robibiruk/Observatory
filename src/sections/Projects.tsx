import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, Sparkles } from "lucide-react";
import { sortedProjects } from "../data/projects";
import type { Project } from "../data/types";
import { Section } from "../components/Section";

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "Live",
  "in-progress": "In progress",
  prototype: "Prototype",
};

/**
 * Projects "Observatory" — bento grid. Featured projects get large tiles.
 * Click expands into an in-page detail view (no route change) with
 * overview / architecture / features / lessons. Keyboard + screen-reader safe:
 * cards are real buttons; the detail panel is focus-trapped-ish via autofocus.
 */
export function Projects({ glow = false }: { glow?: boolean }) {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <Section id="projects" className="section-pad" glow={glow}>
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">Projects Observatory</p>
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
          Things I've built
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          A bento of shipped and in-flight work. Select any exhibit to look
          closer.
        </p>

        <div className="mt-12 grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => setOpen(p)}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-0 text-left transition-all hover:border-primary/50 hover:shadow-glow ${
                p.featured ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
              aria-label={`Open project: ${p.title}`}
            >
              <ProjectImage p={p} large={p.featured} />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/70 to-transparent p-5">
                <div className="flex items-center gap-2">
                  <StatusDot status={p.status} />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-text sm:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{p.oneLiner}</p>

                {/* Live + GitHub buttons — shown when links exist (real URLs only) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.links.live && (
                    <a
                      href={p.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white hover:shadow-glow"
                    >
                      <ExternalLink size={12} /> View Live
                    </a>
                  )}
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-text hover:bg-white/20"
                    >
                      <Github size={12} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.title} details`}
          >
            <motion.div
              className="glass max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={open.status} />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      {STATUS_LABEL[open.status]}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold text-text">
                    {open.title}
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-text hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-muted">{open.overview}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {open.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-highlight"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {open.architecture && (
                <Detail title="Architecture" body={open.architecture} />
              )}
              {open.features && (
                <div className="mt-5">
                  <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                    Features
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {open.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-muted">
                        <Sparkles size={14} className="mt-1 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {open.lessons && <Detail title="Lessons" body={open.lessons} />}

              <div className="mt-6 flex flex-wrap gap-3">
                {open.links.live && (
                  <a
                    href={open.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    <ExternalLink size={14} /> View live
                  </a>
                )}
                {open.links.repo && (
                  <a
                    href={open.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-text hover:bg-white/5"
                  >
                    <Github size={14} /> Source
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function ProjectImage({ p, large }: { p: Project; large: boolean }) {
  return (
    <img
      src={p.image}
      alt={p.alt}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
        large ? "opacity-70" : "opacity-50"
      }`}
    />
  );
}

function StatusDot({ status }: { status: Project["status"] }) {
  const color =
    status === "live"
      ? "bg-emerald-400"
      : status === "in-progress"
      ? "bg-amber-400"
      : "bg-sky-400";
  return <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />;
}

function Detail({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-5">
      <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
        {title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
