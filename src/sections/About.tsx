import { Code2, BookOpen, Download } from "lucide-react";
import { site } from "../data/site";
import { Section } from "../components/Section";
import { Socials } from "../components/Socials";
import { primarySocials } from "../data/socials";

/**
 * About "Island" — photo + mission + Currently building / learning cards.
 * Photo is optional: drop an image at public/profile.webp; if absent we render
 * a branded monogram so the layout never breaks.
 */
export function About() {
  return (
    <Section id="about" className="section-pad">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3">About</p>
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
          The builder behind the lens
        </h2>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-[260px_1fr]">
          <div className="mx-auto">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-2xl" />
              <img
                src="/profile.jpg"
                alt={`Portrait of ${site.name}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (
                    e.currentTarget
                      .nextElementSibling as HTMLElement
                  ).style.display = "grid";
                }}
                className="relative h-56 w-56 rounded-full border-2 border-primary/50 object-cover shadow-glow"
              />
              <div
                className="relative hidden h-56 w-56 place-items-center rounded-full border-2 border-primary/50 bg-surface font-display text-5xl text-primary"
                aria-hidden="true"
              >
                {site.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </div>
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-muted">{site.mission}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card
                icon={<Code2 size={18} />}
                title="Currently building"
                items={site.currentlyBuilding}
              />
              <Card
                icon={<BookOpen size={18} />}
                title="Currently learning"
                items={site.currentlyLearning}
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Socials links={primarySocials} />
              <a
                href={site.cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-text transition-colors hover:border-primary/50 hover:text-highlight"
              >
                <Download size={16} /> Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Card({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-text">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-sm text-muted">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
