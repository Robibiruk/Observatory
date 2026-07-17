import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Sparkles, X } from "lucide-react";
import { museumProjects } from "../data/projects";
import type { Project, ProjectStatus } from "../data/types";
import { Section } from "../components/Section";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  prototype: "Prototype",
};

const STATUS_DOT: Record<ProjectStatus, string> = {
  live: "bg-emerald-400",
  "in-progress": "bg-amber-400",
  prototype: "bg-sky-400",
};

/** Modal with the project's full description, built from the data model. */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // This site runs Lenis smooth-scroll, which installs a window-level wheel
    // listener that preventDefaults — so native overflow-y-auto on this modal
    // can't scroll and the page behind moves instead. We stop Lenis outright
    // while the modal is open (its RAF loop + its preventDefault both die),
    // and the panel also calls stopPropagation on wheel/touch so the event
    // never reaches Lenis in the first place.
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();

    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [onClose]);

  // Block the wheel/touch event from bubbling to Lenis's window listener so
  // the panel's own native overflow-y-auto handles it.
  const trapScroll = (e: React.WheelEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        data-lenis-prevent
        onWheel={trapScroll}
        onTouchMove={trapScroll}
        className="glass max-h-[88vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${STATUS_DOT[project.status]}`}
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {STATUS_LABEL[project.status]}
              </span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-bold text-text">
              {project.title}
            </h3>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-text hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-muted">{project.overview}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-highlight"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.architecture && (
          <div className="mt-5">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
              Architecture
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.architecture}
            </p>
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mt-5">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
              Features
            </h4>
            <ul className="mt-2 space-y-1.5">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-muted">
                  <Sparkles
                    size={14}
                    className="mt-1 shrink-0 text-accent"
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.lessons && (
          <div className="mt-5">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
              Lessons
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.lessons}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              <ExternalLink size={14} /> View live
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-text hover:bg-white/5"
            >
              <Github size={14} /> Source
            </a>
          )}
          {!project.links.live && !project.links.repo && (
            <span className="text-xs text-muted/70">In development</span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Museum — a moving marquee of projects (real apps + extras).
 *
 * The strip scrolls continuously via a requestAnimationFrame loop (not the CSS
 * keyframe) so we can react to the cursor in real time:
 *   - cursor far LEFT  → speeds up (boost factor ramps with distance)
 *   - cursor far RIGHT → reverses direction (scrolls right instead of left)
 *   - otherwise        → base speed, leftward
 * It pauses only while a detail modal is open (so the user can read it).
 * Reduced-motion users get a static, swipeable row (no auto-animation);
 * clicking a card still opens the modal.
 */
export function Museum() {
  const [active, setActive] = useState<Project | null>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const trackRef = useRef<HTMLDivElement>(null);
  // -1 = scrolling left (default), +1 = scrolling right.
  const direction = useRef(-1);
  // Scroll position persists across modal open/close so the cycle never resets.
  const offsetRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    // The track holds TWO copies of the list; loop when we pass one copy's width.
    const halfWidth = () => track.scrollWidth / 2;
    let last = performance.now();
    let raf = 0;
    const BASE = 0.045; // px per ms — comfortable base speed
    const BOOST = 0.14; // extra px/ms at the far-left extreme
    let mouseX = -1; // -1 = outside the strip
    let rect = track.getBoundingClientRect();

    const onMove = (e: MouseEvent) => {
      rect = track.getBoundingClientRect();
      mouseX = e.clientX;
    };
    const onLeave = () => {
      mouseX = -1;
    };
    track.addEventListener("mousemove", onMove);
    track.addEventListener("mouseleave", onLeave);

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50); // clamp on tab refocus
      last = now;
      if (!active) {
        // far-right → reverse; far-left → boost (leftward) fast
        let speed = BASE;
        if (mouseX >= 0) {
          const rel = (mouseX - rect.left) / rect.width; // 0 left .. 1 right
          if (rel > 0.75) {
            direction.current = 1; // far right → go right
          } else if (rel < 0.25) {
            const t = 1 - rel / 0.25; // 0..1 as we approach far left
            speed = BASE + BOOST * t;
          } else {
            direction.current = -1; // middle → normal leftward
          }
        }
        offsetRef.current += direction.current * speed * dt;
        const w = halfWidth();
        if (offsetRef.current <= -w) offsetRef.current += w;
        if (offsetRef.current >= 0) offsetRef.current -= w;
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("mousemove", onMove);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, active]);

  // Duplicate the list so the marquee loops seamlessly.
  const track = [...museumProjects, ...museumProjects];

  return (
    <Section id="museum" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">Museum</p>
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
          On display
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          A drifting reel of everything — move to the far left to speed it up,
          the far right to send it back. Click a card to open its story.
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden" role="group" aria-label="Project marquee">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

        <div
          ref={trackRef}
          className={`flex w-max ${
            reduced ? "overflow-x-auto px-6" : "px-3 will-change-transform"
          }`}
        >
          {track.map((p, i) => (
            <button
              key={`${p.slug}-${i}`}
              type="button"
              onClick={() => setActive(p)}
              className="group relative mr-6 w-[300px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-surface text-left transition-all hover:border-accent/50 hover:shadow-glow-accent focus-visible:border-accent focus-visible:outline-none sm:w-[360px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.alt}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility =
                      "hidden";
                  }}
                  className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-text">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{p.oneLiner}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {p.links.live && (
                    <span className="inline-flex items-center gap-1 text-sm text-highlight">
                      <ExternalLink size={14} /> View Live
                    </span>
                  )}
                  {p.links.repo && (
                    <span className="inline-flex items-center gap-1 text-sm text-muted">
                      <Github size={14} /> GitHub
                    </span>
                  )}
                  {!p.links.live && !p.links.repo && (
                    <span className="text-xs text-muted/70">In development</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </Section>
  );
}
