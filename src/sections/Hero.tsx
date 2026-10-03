import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect } from "react";
import { Section } from "../components/Section";
import { MagneticButton } from "../components/MagneticButton";

/**
 * Hero "Observatory" — client-focused headline + value proposition.
 * GSAP scopes ONLY to the hero entrance (per the brief). The CTA invites
 * conversation about the client's project, not just scrolling.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const enter = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section id="hero" className="min-h-screen">
      <div
        ref={root}
        className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 text-center"
      >
        <p className="hero-stagger eyebrow mb-6">Addis Ababa, Ethiopia</p>

        <h1 className="hero-stagger font-display text-8xl font-extrabold leading-[1.1] tracking-tight text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
          Robel.
        </h1>

        <p className="hero-stagger mt-6 max-w-2xl font-mono text-sm uppercase tracking-[0.25em] text-muted sm:text-base">
          Building intelligent tools at the intersection of code, health, and language.
        </p>

        <div className="hero-stagger mt-10">
          <MagneticButton
            onClick={enter}
            ariaLabel="Discuss your project idea"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3.5 font-medium text-white shadow-glow transition-shadow hover:shadow-glow-accent"
          >
            <span className="inline-flex items-center gap-2">
              Enter Observatory
            </span>
          </MagneticButton>
        </div>
      </div>
    </Section>
  );
}