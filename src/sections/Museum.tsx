import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Sparkles, X } from "lucide-react";
import type { Project, ProjectStatus } from "../data/types";
import { Section } from "../components/Section";
import { useContent } from "../lib/store";

type GalleryMode = "mobile" | "tablet" | "desktop";

function useGalleryMode(): GalleryMode {
  const [mode, setMode] = useState<GalleryMode>(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w <= 639) return "mobile";
    if (w <= 1023) return "tablet";
    return "desktop";
  });
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setMode(w <= 639 ? "mobile" : w <= 1023 ? "tablet" : "desktop");
    };
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return mode;
}

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

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [onClose]);

  const trapScroll = (e: React.WheelEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        data-lenis-prevent
        onWheel={trapScroll}
        onTouchMove={trapScroll}
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-surface p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${STATUS_DOT[project.status]}`} aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{STATUS_LABEL[project.status]}</span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-bold text-text">{project.title}</h3>
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
            <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-highlight">{tech}</span>
          ))}
        </div>

        {project.architecture && (
          <div className="mt-5">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">Architecture</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.architecture}</p>
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mt-5">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">Features</h4>
            <ul className="mt-2 space-y-1.5">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-muted">
                  <Sparkles size={14} className="mt-1 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.lessons && (
          <div className="mt-5">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">Lessons</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.lessons}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
              <ExternalLink size={14} /> View live
            </a>
          )}
          {project.links.repo && (
            <a href={project.links.repo} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-text hover:bg-white/5">
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

function CardBody({ p }: { p: Project }) {
  return (
    <>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={p.alt}
          loading="lazy"
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-text">{p.title}</h3>
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
    </>
  );
}

export function Museum({ glow = false }: { glow?: boolean }) {
  const { galleryProjects: museumProjects } = useContent();
  const [active, setActive] = useState<Project | null>(null);
  const mode = useGalleryMode();
  const isDesktop = mode === "desktop";
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const trackRef = useRef<HTMLDivElement>(null);
  const starLayerRef = useRef<HTMLDivElement>(null);
  const direction = useRef(-1);
  const offsetRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const speedMultiplier = useRef(1);

  // Desktop: track-based marquee with click to open modal.
  // Tablet/Mobile: simple scroll-snap carousel.
  
  // Desktop marquee loop
  useEffect(() => {
    if (reduced || !isDesktop) return;
    const track = trackRef.current;
    if (!track) return;

    const halfWidth = () => track.scrollWidth / 2;
    let last = performance.now();
    let raf = 0;
    const BASE = 0.045;
    const BOOST = 0.14;
    let mouseX = -1;
    let rect = track.getBoundingClientRect();

    const onMove = (e: MouseEvent) => {
      rect = track.getBoundingClientRect();
      mouseX = e.clientX;
    };
    const onLeave = () => { mouseX = -1; };
    track.addEventListener("mousemove", onMove);
    track.addEventListener("mouseleave", onLeave);

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (!active) {
        let speed = BASE * speedMultiplier.current;
        if (mouseX >= 0) {
          const rel = (mouseX - rect.left) / rect.width;
          if (rel > 0.75) {
            direction.current = 1;
          } else if (rel < 0.25) {
            const t = 1 - rel / 0.25;
            speed = (BASE + BOOST * t) * speedMultiplier.current;
          } else {
            direction.current = -1;
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
  }, [reduced, isDesktop, active]);

  // Decay speed
  useEffect(() => {
    if (!isDesktop || reduced) return;
    const iv = setInterval(() => {
      if (speedMultiplier.current > 1) {
        speedMultiplier.current = Math.max(1, speedMultiplier.current * 0.92);
      }
    }, 80);
    return () => clearInterval(iv);
  }, [isDesktop, reduced]);

  // Tablet/mobile scroll tracking
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isDesktop) return;

    const onScroll = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-gallery-card]"));
      const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, idx) => {
        const r = card.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) { bestDist = d; best = idx; }
      });
      const count = museumProjects.length;
      setActiveIndex(((best % count) + count) % count);

      if (starLayerRef.current) {
        starLayerRef.current.style.transform = `translateX(${-track.scrollLeft * 0.15}px)`;
      }

      if (!reduced) {
        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const center = r.left + r.width / 2;
          const dist = (center - mid) / window.innerWidth;
          const rot = Math.max(-3, Math.min(3, dist * -6));
          card.style.transform = `rotate(${rot}deg)`;
        });
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [isDesktop, reduced, mode]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelectorAll<HTMLElement>("[data-gallery-card]")[i];
    if (card) {
      card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
    }
  };

  const handleCardClick = (p: Project) => {
    setActive(p);
  };

  const items = isDesktop ? [...museumProjects, ...museumProjects] : museumProjects;
  const itemWidthClass = mode === "mobile" ? "w-screen shrink-0 snap-center" : "w-screen shrink-0 snap-center";

  return (
    <Section id="museum" className="section-pad" glow={glow}>
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">The Gallery</p>
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">Every project is a world</h2>
        <p className="mt-4 max-w-2xl text-muted">
          {isDesktop
            ? "Explored, solved, and carried forward — grab and drag to scroll either way, or let it drift. Click a card to open its story."
            : "Explored, solved, and carried forward — swipe through the collection. Tap a card to open its story."}
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden">
        {!isDesktop && (
          <div ref={starLayerRef} aria-hidden="true" className="gallery-stars pointer-events-none absolute inset-x-[-20%] inset-y-0 z-0" />
        )}

        {isDesktop && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
          </>
        )}

        <div
          ref={trackRef}
          className={
            isDesktop
              ? `relative z-[1] flex w-max ${reduced ? "overflow-x-auto px-6" : "px-3 select-none cursor-grab will-change-transform"}`
              : "-mx-6 relative z-[1] flex w-full snap-x snap-mandatory overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }
          style={isDesktop && !reduced ? { touchAction: "pan-y" } : undefined}
        >
          {items.map((p, i) => (
            <button
              key={`${p.slug}-${i}`}
              type="button"
              onClick={() => handleCardClick(p)}
              className={`group relative shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-surface text-left transition-all hover:border-accent/50 hover:shadow-glow-accent focus-visible:border-accent focus-visible:outline-none ${
                isDesktop ? "mr-6 w-[300px] sm:w-[360px]" : `${itemWidthClass} px-3`
              }`}
            >
              <CardBody p={p} />
            </button>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      {!isDesktop && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {museumProjects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Go to ${p.title}`}
              aria-current={i === activeIndex}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-primary" : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </Section>
  );
}
