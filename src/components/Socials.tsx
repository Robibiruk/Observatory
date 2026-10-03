import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  type LucideIcon,
} from "lucide-react";
import { thesvgIcons } from "../data/thesvg-icons";
import type { SocialLink } from "../data/types";

// Lucide icons for platforms that have first-party support
const LUCIDE_ICONS: Partial<Record<SocialLink["icon"], LucideIcon>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  instagram: Instagram,
};

// Brand icons sourced from @thesvg/icons (no Lucide equivalent)
const SVG_ICONS: Partial<Record<SocialLink["icon"], string>> = {
  tiktok: thesvgIcons["tiktok"],
  pinterest: thesvgIcons["pinterest"],
};

export function Socials({
  links,
  className = "",
}: {
  links: SocialLink[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((s) => {
        const LucideIcon = LUCIDE_ICONS[s.icon];
        const rawSvg = SVG_ICONS[s.icon];

        return (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              title={s.label}
              className="group grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-surface text-muted transition-colors hover:border-primary/60 hover:text-highlight"
            >
              {LucideIcon ? (
                <LucideIcon size={18} aria-hidden="true" />
              ) : rawSvg ? (
                <span
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: rawSvg }}
                />
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
