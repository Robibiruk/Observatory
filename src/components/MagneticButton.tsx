import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../lib/useReducedMotion";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  ariaLabel?: string;
  /** Strength of the magnetic pull in px. */
  strength?: number;
};

/**
 * Subtle magnetic-follow button (desktop only). On pointer move it eases the
 * label toward the cursor; resets on leave. Disabled on touch / reduced motion.
 */
export function MagneticButton({
  children,
  onClick,
  className = "",
  href,
  ariaLabel,
  strength = 12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const handleMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * (strength / 40), y: y * (strength / 40) });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      className={`inline-flex items-center justify-center ${className}`}
      style={href || onClick ? { cursor: "pointer" } : undefined}
      role={onClick && !href ? "button" : undefined}
      tabIndex={onClick && !href ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={
        onClick && !href
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );

  return inner;
}
