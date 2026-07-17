import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../data/site";

// HARD minimum the loader stays up before fading into the homepage.
const MIN_VISIBLE = 2200; // ms — within the 2-3s premium window

/**
 * Hamster-in-wheel loading screen (Uiverse snippet, plain-CSS port).
 *
 * - Shown on EVERY reload (no session gate) — per request.
 * - Skipped entirely (no paint) when the user prefers reduced motion; CSS
 *   animations are also frozen globally by the reduced-motion block.
 * - Stays up a minimum of ~2.2s, then fades seamlessly into the homepage via
 *   AnimatePresence. Click anywhere to skip after the minimum.
 * - Pure CSS animation (no extra deps), scroll locked while up.
 */
export function Loader() {
  const mountedAt = useRef(Date.now()).current;
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const finish = useCallback(() => {
    const remaining = MIN_VISIBLE - (Date.now() - mountedAt);
    const close = () => setVisible(false);
    if (remaining <= 0) close();
    else window.setTimeout(close, remaining);
  }, [mountedAt]);

  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(finish, MIN_VISIBLE);
    return () => clearTimeout(t);
  }, [visible, finish]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          onClick={finish}
          role="status"
          aria-label="Loading the Observatory"
        >
          {/* soft radial nebula wash, matching the homepage background glows */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="pointer-events-none absolute right-1/3 bottom-1/4 h-[30vh] w-[30vh] rounded-full bg-accent/10 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              aria-label="Orange and tan hamster running in a metal wheel"
              role="img"
              className="wheel-and-hamster"
            >
              <div className="wheel" />
              <div className="hamster">
                <div className="hamster__body">
                  <div className="hamster__head">
                    <div className="hamster__ear" />
                    <div className="hamster__eye" />
                    <div className="hamster__nose" />
                  </div>
                  <div className="hamster__limb hamster__limb--fr" />
                  <div className="hamster__limb hamster__limb--fl" />
                  <div className="hamster__limb hamster__limb--br" />
                  <div className="hamster__limb hamster__limb--bl" />
                  <div className="hamster__tail" />
                </div>
              </div>
              <div className="spoke" />
            </div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-16 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          >
            <div className="font-display text-lg tracking-wide text-text">
              {site.name}
              <span className="text-primary">.</span>
            </div>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-muted">
              Entering the Observatory
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
