import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Loader } from "./sections/Loader";
import { Hero } from "./sections/Hero";
import { useReducedMotion as useRM } from "./lib/useReducedMotion";
import { useLenis } from "./lib/useLenis";
import {
  ActiveSectionContext,
} from "./lib/activeSection";

// Heavy / below-the-fold sections are code-split and lazy-mounted so the
// initial bundle and first paint stay lean (Lighthouse guardrail).
const About = lazy(() =>
  import("./sections/About").then((m) => ({ default: m.About }))
);
const Projects = lazy(() =>
  import("./sections/Projects").then((m) => ({ default: m.Projects }))
);
const TimeMachine = lazy(() =>
  import("./sections/TimeMachine").then((m) => ({ default: m.TimeMachine }))
);
const Constellation = lazy(() =>
  import("./sections/Constellation").then((m) => ({ default: m.Constellation }))
);
const Museum = lazy(() =>
  import("./sections/Museum").then((m) => ({ default: m.Museum }))
);
const Contact = lazy(() =>
  import("./sections/Contact").then((m) => ({ default: m.Contact }))
);
const Footer = lazy(() =>
  import("./sections/Footer").then((m) => ({ default: m.Footer }))
);

// The R3F starfield is its own lazy chunk too.
const Starfield = lazy(() => import("./components/Starfield"));

const NAV_IDS = [
  "hero",
  "about",
  "projects",
  "timeline",
  "constellation",
  "museum",
  "contact",
];

/** Mounts children only once they scroll near the viewport (IntersectionObserver). */
function LazyMount({
  children,
  rootMargin = "200px",
}: {
  children: React.ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{show ? children : null}</div>;
}

export default function App() {
  const reduced = useRM();
  useLenis();
  const [active, setActive] = useState("hero");

  // Single scroll-spy: drives both the navbar highlight and the per-section
  // glow. Lifted here so it isn't duplicated by the Navbar.
  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <ActiveSectionContext.Provider value={active}>
      <Loader />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        {!reduced && (
          <Suspense fallback={null}>
            <Starfield />
          </Suspense>
        )}
        {/* The circular nebula glow now lives per-section (see Section `glow`)
            and only fades in for the active nav section — so it appears on
            every section you scroll/click to, not only the homepage. */}
      </div>

      <Navbar />

      <main>
        <Hero />

        <LazyMount>
          <Suspense fallback={null}>
            <About glow />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Projects glow />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <TimeMachine glow />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Constellation glow />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Museum glow />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Contact glow />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LazyMount>
      </main>
    </ActiveSectionContext.Provider>
  );
}
