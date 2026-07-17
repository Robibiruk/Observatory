import { forwardRef } from "react";
import { motion, useReducedMotion as fmReduced } from "framer-motion";
import type { ReactNode } from "react";
import { useActiveSection } from "../lib/activeSection";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Stagger children in on scroll. */
  stagger?: boolean;
  /** Show the circular glow behind this section when it is the active nav section. */
  glow?: boolean;
};

/**
 * Section wrapper: assigns the scroll anchor id, applies consistent vertical
 * rhythm, and fades/slides its content in when scrolled into view. Honors
 * reduced motion by skipping the transform/animation.
 *
 * The inner motion.div is the positioning context (`relative`) and can carry
 * a forwarded ref, so callers don't need an extra wrapper div.
 *
 * `glow`: when true, a soft circular nebula bloom sits behind the section and
 * only fades in for the section currently in view (the active nav target), so
 * the "circular glow" follows you as you click/scroll through the nav — not
 * just on the homepage.
 */
export const Section = forwardRef<HTMLDivElement, Props>(function Section(
  { id, children, className = "", stagger = false, glow = false },
  ref
) {
  const reduced = fmReduced();
  const active = useActiveSection();
  const isActive = active === id;

  return (
    <section id={id} className={`relative scroll-mt-24 ${className}`} aria-label={id}>
      {glow && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 flex items-center justify-center transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-[55vh] w-[55vh] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute h-[35vh] w-[35vh] rounded-full bg-accent/10 blur-[120px]" />
        </div>
      )}
      <motion.div
        ref={ref}
        initial={reduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        className={`relative ${stagger ? "space-y-6" : ""}`}
      >
        {children}
      </motion.div>
    </section>
  );
});
