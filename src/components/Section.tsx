import { forwardRef } from "react";
import { motion, useReducedMotion as fmReduced } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Stagger children in on scroll. */
  stagger?: boolean;
};

/**
 * Section wrapper: assigns the scroll anchor id, applies consistent vertical
 * rhythm, and fades/slides its content in when scrolled into view. Honors
 * reduced motion by skipping the transform/animation.
 *
 * The inner motion.div is the positioning context (`relative`) and can carry
 * a forwarded ref, so callers don't need an extra wrapper div.
 */
export const Section = forwardRef<HTMLDivElement, Props>(function Section(
  { id, children, className = "", stagger = false },
  ref
) {
  const reduced = fmReduced();

  return (
    <section id={id} className={`relative scroll-mt-24 ${className}`} aria-label={id}>
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
