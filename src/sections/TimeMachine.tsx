import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Sparkles, Rocket } from "lucide-react";
import { timeline } from "../data/timeline";
import { site } from "../data/site";
import type { TimelineMilestone, TimelineStatus } from "../data/types";
import { Section } from "../components/Section";
import Planet from "../components/Planet";
import RotatingEarth from "../components/RotatingEarth";
import ElectricBorder from "../components/ElectricBorder";
import "../Timeline.css";

/* ------------------------------------------------------------------ */
/* Theme                                                              */
/* ------------------------------------------------------------------ */
const STATUS_STYLES: Record<TimelineStatus, string> = {
  complete: "text-emerald-300 border-emerald-300/40 bg-emerald-300/10",
  live: "text-amber-300 border-amber-300/40 bg-amber-300/10",
  future: "text-sky-300 border-sky-300/40 bg-sky-300/10",
};
const STATUS_LABEL: Record<TimelineStatus, string> = {
  complete: "Mission Complete",
  live: "Active Mission",
  future: "Uncharted",
};

const PALETTE: Record<string, { color: string; glow: string; ring: boolean }> = {
  Earth: { color: "#3b82f6", glow: "#1e3a8a", ring: false },
  Moon: { color: "#cbd5e1", glow: "#475569", ring: false },
  Mars: { color: "#f97316", glow: "#7c2d12", ring: false },
  Saturn: { color: "#fbbf24", glow: "#92400e", ring: true },
  Nebula: { color: "#a855f7", glow: "#581c87", ring: false },
  "Deep Space": { color: "#22d3ee", glow: "#0e7490", ring: false },
};
const paletteOf = (c: string) => PALETTE[c] ?? PALETTE["Deep Space"];

const MORSE = [
  { ch: "K", code: "—·—" },
  { ch: "E", code: "·" },
  { ch: "E", code: "·" },
  { ch: "P", code: "·——·" },
  { ch: " ", code: " " },
  { ch: "E", code: "·" },
  { ch: "X", code: "—··—" },
  { ch: "P", code: "·——·" },
  { ch: "L", code: "·—··" },
  { ch: "O", code: "———" },
  { ch: "R", code: "·—·" },
  { ch: "I", code: "··" },
  { ch: "N", code: "—·" },
  { ch: "G", code: "——·" },
];

/* ------------------------------------------------------------------ */
/* HUD — minimal mission-control telemetry (~10% opacity)            */
/* ------------------------------------------------------------------ */
function Hud({ activeIndex, progress }: { activeIndex: number; progress: number }) {
  const m = timeline[activeIndex] ?? timeline[0];
  const sector = `${String.fromCharCode(65 + (activeIndex % 6))}-${String(activeIndex + 1).padStart(2, "0")}`;
  const x = (472.2 - activeIndex * 7.3).toFixed(1);
  const y = (183.8 + activeIndex * 4.1).toFixed(1);
  const signal = Math.min(100, 55 + activeIndex * 9);
  const dist = (12.6 + progress * 900).toFixed(1);
  return (
    <div className="pointer-events-none absolute inset-0 z-20 font-mono text-[10px] uppercase tracking-widest text-white/10">
      <div className="absolute left-4 top-4 space-y-1">
        <div>Coordinates</div>
        <div>X {x}</div>
        <div>Y {y}</div>
        <div className="pt-1">Signal</div>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-white/30" style={{ width: `${signal}%` }} />
        </div>
      </div>
      <div className="absolute right-4 top-4 space-y-1 text-right">
        <div>Current Sector</div>
        <div>{sector}</div>
        <div className="pt-1">Mission</div>
        <div>{m.mission}</div>
        <div className="pt-1">Distance</div>
        <div>{dist} LY</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Left progress indicator                                           */
/* ------------------------------------------------------------------ */
function ProgressRail({ progress, activeIndex }: { progress: number; activeIndex: number }) {
  return (
    <div className="pointer-events-none sticky top-24 hidden h-fit w-40 flex-col items-start gap-2 font-mono text-[10px] uppercase tracking-widest text-primary/60 lg:flex">
      <div>Mission</div>
      <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-primary/60 transition-all" style={{ width: `${progress * 100}%` }} />
      </div>
      <div>{(progress * 100).toFixed(0)}%</div>
      <div className="pt-2 text-text/70">
        Current
        <br />
        <span className="text-lg font-bold text-text">Mission {timeline[activeIndex]?.mission ?? "006"}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mission card — holographic glass, hover lift/rotate/glow          */
/* ------------------------------------------------------------------ */
function MissionCard({
  m,
  index,
  active,
  isFinale,
}: {
  m: TimelineMilestone;
  index: number;
  active: boolean;
  isFinale: boolean;
}) {
  if (isFinale) {
    // Wormhole finale
    return (
      <article className="relative mx-auto w-full max-w-xl">
        <div className="obs-wormhole" aria-hidden="true">
          <span className="obs-wormhole-ring" />
          <span className="obs-wormhole-ring" />
          <span className="obs-wormhole-ring" />
          <span className="obs-wormhole-ring" />
          <span className="obs-wormhole-ring" />
          <span className="obs-wormhole-core" />
        </div>
        <div className="glass relative z-10 overflow-hidden rounded-3xl border-sky-300/30 p-8 text-center">
          <div className="font-mono text-xs text-sky-300">Future Mission</div>
          <h3 className="mt-2 font-display text-3xl font-bold text-text">???</h3>
          <p className="mt-2 text-muted">Coming Soon</p>
          <p className="mt-4 text-sm text-muted">
            The wormhole opens. The path folds through spacetime — board the next mission.
          </p>
        </div>
      </article>
    );
  }
  return (
    <article
      className={`obs-card group relative w-full ${active ? "is-active" : ""}`}
      data-index={index}
    >
      {/* milestone star — the mission IS the star */}
      <span className={`obs-node ${m.status === "future" ? "" : "obs-node-on"} ${active ? "obs-node-active" : ""}`}>
        {m.status === "future" ? "✧" : "✦"}
      </span>
      <div className="glass obs-card-glass">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500"
          style={{ background: paletteOf(m.chapter).glow, opacity: active ? 0.6 : 0.25 }}
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
              Mission {String(index + 1).padStart(3, "0")}
            </div>
            <div className="mt-1 font-mono text-xs text-muted">{m.year}</div>
            <h3 className="mt-1 font-display text-2xl font-bold text-text">{m.title}</h3>
          </div>
          <span className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[10px] uppercase ${STATUS_STYLES[m.status]}`}>
            {STATUS_LABEL[m.status]}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{m.detail}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {m.stack.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-highlight">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-accent">
          <Sparkles size={14} className="shrink-0" />
          <span className="font-mono uppercase tracking-wide">{m.badge}</span>
        </div>
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-primary/60">
          {m.chapter} · {m.chapterLabel}
        </div>
        {(m.links.live || m.links.repo) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {m.links.live && (
              <a href={m.links.live} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:shadow-glow-primary">
                <ExternalLink size={13} /> Live
              </a>
            )}
            {m.links.repo && (
              <a href={m.links.repo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-text transition hover:bg-white/5">
                <Github size={13} /> Source
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main orchestrator                                                  */
/* ------------------------------------------------------------------ */
export function TimeMachine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [shootKey, setShootKey] = useState(0);
  const [morseOn, setMorseOn] = useState(false);

  // Radar pulses in morse rhythm; clicking decodes the message.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setMorseOn((v) => !v),
      1200
    );
    return () => clearInterval(id);
  }, [reduced]);
  const decodeMorse = () => {
    const msg = MORSE.map((m) => m.ch).join("");
    setAchievement(`Signal Decoded — “${msg.trim()}”`);
  };

  // reduced motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // scroll → progress / active / parallax
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1)));
      setProgress(p);
      setActiveIndex(Math.min(timeline.length - 1, Math.floor(p * timeline.length)));
      setScrollY(window.scrollY);
      raf = 0;
    };
    const rafScroll = () => {
      if (!raf) raf = requestAnimationFrame(onScroll);
    };
    window.addEventListener("scroll", rafScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", rafScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // escape key (dismiss achievement)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAchievement(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // random shooting star every 20-40s
  useEffect(() => {
    if (reduced) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setShootKey((k) => k + 1);
        schedule();
      }, 20000 + Math.random() * 20000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [reduced]);

  // rare hidden astronaut (≈8% per load)
  const showAstronaut = useRef(Math.random() < 0.08).current;

  const activeChapter = timeline[activeIndex]?.chapter ?? "Earth";
  const pal = paletteOf(activeChapter);

  return (
    <Section id="timeline" className="section-pad relative overflow-hidden" ref={containerRef}>
      {/* living space backdrop (parallax) */}
        <div className="obs-backdrop" aria-hidden="true">
          <div className="obs-nebula" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
          {[0.12, 0.22, 0.35].map((s, i) => (
            <div
              key={i}
              className="obs-stars"
              style={{ transform: `translateY(${scrollY * s}px)`, opacity: 0.5 + i * 0.2, backgroundSize: `${130 - i * 25}px ${130 - i * 25}px` }}
            />
          ))}
          {/* drifting planets per chapter */}
          {timeline.map((m, i) => (
            <span
              key={m.id}
              className="obs-planet-drift rounded-full"
              style={{
                left: `${6 + i * 16}%`,
                top: `${10 + (i % 3) * 28}%`,
                width: 70 + i * 8,
                height: 70 + i * 8,
                background: `radial-gradient(circle at 30% 30%, ${paletteOf(m.chapter).color}, ${paletteOf(m.chapter).glow})`,
                boxShadow: `0 0 50px ${paletteOf(m.chapter).glow}`,
                transform: `translateY(${scrollY * (0.08 + i * 0.02)}px)`,
                opacity: 0.4,
              }}
            />
          ))}
          {/* satellite crossing — detailed CSS craft */}
          <div className="obs-satellite" aria-hidden>
            <div className="obs-sat-inner">
              <span className="obs-sat-panel left" />
              <span className="obs-sat-body" />
              <span className="obs-sat-panel right" />
              <span className="obs-sat-antenna" />
              <span className="obs-sat-dish" />
              <span className="obs-sat-blink" />
            </div>
          </div>
          {/* space station — click opens CV */}
          <button
            className="obs-station"
            onClick={() => site.cvUrl && window.open(site.cvUrl, "_blank")}
            aria-label="Open resume"
            title="Space station — open resume"
          >
            <span className="block h-2 w-6 rounded-full bg-white/60" />
            <span className="block h-6 w-2 rounded-full bg-white/40" />
          </button>
          {/* rare astronaut */}
          {showAstronaut && (
            <button
              className="obs-astronaut"
              onClick={() => setAchievement("Astronaut Found — hidden explorer unlocked")}
              aria-label="Hidden astronaut"
              title="?"
            >
              🧑‍🚀
            </button>
          )}
          {/* shooting star */}
          <span key={shootKey} className="obs-shooting-star" />
          {/* morse radar */}
          <button
            className="obs-radar"
            onClick={() => {
              setMorseOn(true);
              decodeMorse();
            }}
            aria-label="Radar"
            title="Blinks in morse…"
          >
            <span className={`obs-radar-dot ${morseOn ? "on" : ""}`} />
          </button>
          {/* achievement toast */}
          {achievement && (
            <div className="obs-toast" onClick={() => setAchievement(null)}>
              🏆 {achievement}
            </div>
          )}
        </div>

        {/* edge fade — blends the space backdrop into the page background so
            the nebula/stars don't get cut off hard against adjacent sections */}
        <div className="obs-edge-fade" aria-hidden="true" />

        {/* HUD */}
        {!reduced && <Hud activeIndex={activeIndex} progress={progress} />}

        {/* header */}
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="eyebrow mb-3 text-sm sm:text-base">The Observatory Expedition</p>
          <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
            Become the mission commander
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Every scroll is a journey farther into the universe. Each milestone is a newly
            discovered sector. The scanner follows your cursor — look closer.
          </p>
        </div>

        {/* body: progress rail + constellation + planet */}
        <div className="relative z-10 mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[160px_1fr_220px]">
          <ProgressRail progress={progress} activeIndex={activeIndex} />

          {/* mission cards */}
          <ElectricBorder color="#6C7CFF" speed={1} chaos={0.12} borderRadius={28} className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="relative space-y-24 sm:space-y-28">
              {timeline.map((m, i) => (
                <MissionCard
                  key={m.id}
                  m={m}
                  index={i}
                  active={i === activeIndex}
                  isFinale={i === timeline.length - 1}
                />
              ))}
            </div>
          </ElectricBorder>

          {/* current chapter planet */}
          <div className="hidden flex-col items-center gap-3 lg:flex">
            <div className="h-40 w-40">
              {!reduced &&
                (activeChapter === "Earth" ? (
                  <RotatingEarth size={160} />
                ) : (
                  <Planet color={pal.color} ring={pal.ring} className="h-full w-full" />
                ))}
            </div>
            <div className="text-center font-mono text-[10px] uppercase tracking-widest text-primary/60">
              <div className="text-text">{activeChapter}</div>
              <div>{timeline[activeIndex]?.chapterLabel}</div>
            </div>
          </div>
        </div>

        {/* final invitation into contact */}
        <div className="relative z-10 mx-auto mt-24 max-w-2xl text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary/60">Next Mission</div>
          <h3 className="mt-2 font-display text-3xl font-bold text-text">Building the Future</h3>
          <p className="mt-2 text-muted">Join the journey.</p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:shadow-glow-primary"
          >
            <Rocket size={16} /> Contact Me
          </a>
        </div>
    </Section>
  );
}
