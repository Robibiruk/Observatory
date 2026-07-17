import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { site } from "../data/site";
import { Section } from "../components/Section";
import { MagneticButton } from "../components/MagneticButton";

/**
 * Hero "Observatory" — name + one-line identity + "Enter Observatory" CTA.
 * GSAP scopes ONLY to the hero entrance (per the brief). The CTA performs a
 * smooth camera-style scroll into the next section.
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
        <p className="hero-stagger eyebrow mb-6">{site.location}</p>

        <h1 className="hero-stagger font-display text-5xl font-bold leading-[1.05] tracking-tight text-text sm:text-7xl lg:text-8xl">
          {site.name.split(" ")[0]}
          <span className="text-primary">.</span>
        </h1>

        <p className="hero-stagger mt-6 max-w-2xl font-mono text-sm uppercase tracking-[0.25em] text-muted sm:text-base">
          {site.identity}
        </p>

        <p className="hero-stagger mt-6 max-w-xl text-lg text-muted">
          {site.tagline}
        </p>

        <div className="hero-stagger mt-10">
          <MagneticButton
            onClick={enter}
            ariaLabel="Enter the Observatory and scroll to About"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3.5 font-medium text-white shadow-glow transition-shadow hover:shadow-glow-accent"
          >
            <span className="inline-flex items-center gap-2">
              Enter Observatory <ArrowDown size={18} />
            </span>
          </MagneticButton>
        </div>
      </div>
    </Section>
  );
}
