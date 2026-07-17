import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling and drives its RAF loop. Disabled (native
 * scroll) when the user prefers reduced motion. Also syncs Lenis with GSAP
 * ScrollTrigger so the pinned horizontal timeline stays in step. This is the
 * single place Lenis is wired in — call it once at app root.
 */
export function useLenis() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // respect reduced motion — skip smooth scroll entirely

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Expose for components that need to pause smooth-scroll (e.g. modals
    // with native overflow-y-auto, which Lenis would otherwise block).
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Keep ScrollTrigger (used by TimeMachine) in sync with Lenis.
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [reduced]);
}
