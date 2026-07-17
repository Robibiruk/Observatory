import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "../data/site";
import { MagneticButton } from "./MagneticButton";

const NAV = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "timeline", label: "Time Machine" },
  { id: "constellation", label: "Stack" },
  { id: "museum", label: "Museum" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      Boolean
    ) as HTMLElement[];
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-2.5 transition-shadow ${
          scrolled ? "shadow-glow" : ""
        }`}
        aria-label="Primary"
      >
        <MagneticButton
          onClick={() => go("hero")}
          className="font-display text-lg font-bold tracking-tight text-text"
          aria-label="Back to top"
        >
          {site.name.split(" ")[0]}
          <span className="text-primary">.</span>
        </MagneticButton>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => go(n.id)}
                aria-current={active === n.id ? "true" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active === n.id
                    ? "bg-primary/15 text-highlight"
                    : "text-muted hover:text-text"
                }`}
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="grid h-9 w-9 place-items-center rounded-full text-text md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu sheet */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass absolute top-20 left-4 right-4 z-50 rounded-2xl p-3 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => go(n.id)}
                  className="w-full rounded-xl px-4 py-3 text-left text-text hover:bg-white/5"
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  );
}
