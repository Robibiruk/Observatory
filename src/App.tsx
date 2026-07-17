import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Loader } from "./sections/Loader";
import { Hero } from "./sections/Hero";
import { useReducedMotion as useRM } from "./lib/useReducedMotion";
import { useLenis } from "./lib/useLenis";

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

  return (
    <>
      <Loader />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        {!reduced && (
          <Suspense fallback={null}>
            <Starfield />
          </Suspense>
        )}
        {/* soft radial nebula glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[30vh] w-[30vh] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <Navbar />

      <main>
        <Hero />

        <LazyMount>
          <Suspense fallback={null}>
            <About />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Projects />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <TimeMachine />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Constellation />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Museum />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
        </LazyMount>

        <LazyMount>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LazyMount>
      </main>
    </>
  );
}
