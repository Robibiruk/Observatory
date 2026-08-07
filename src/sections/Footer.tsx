import { site } from "../data/site";
import { Socials } from "../components/Socials";
import { socials } from "../data/socials";
import { navigate } from "../lib/navigate";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-t from-background to-transparent px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="font-display text-2xl font-bold text-text">
          {site.name.split(" ")[0]}
          <span className="text-primary">.</span>
        </div>
        <Socials links={socials} />
        {/* Secret entry to the admin panel — looks like plain copyright text. */}
        <button
          type="button"
          onClick={() => navigate("/admin")}
          aria-label="Admin panel"
          className="text-sm text-muted transition-colors hover:text-text"
        >
          © {new Date().getFullYear()} {site.name}. Built with React, Three.js,
          and too much coffee.
        </button>
      </div>
    </footer>
  );
}
