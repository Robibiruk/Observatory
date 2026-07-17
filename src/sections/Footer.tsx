import { site } from "../data/site";
import { Socials } from "../components/Socials";
import { socials } from "../data/socials";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-t from-background to-transparent px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="font-display text-2xl font-bold text-text">
          {site.name.split(" ")[0]}
          <span className="text-primary">.</span>
        </div>
        <Socials links={socials} />
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name}. Built with React, Three.js,
          and too much coffee.
        </p>
      </div>
    </footer>
  );
}
