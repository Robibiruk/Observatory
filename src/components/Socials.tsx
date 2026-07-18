import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Music2,
  Image,
  // lucide ships no brand icons for TikTok/Pinterest; use distinct fallbacks.
  type LucideIcon,
} from "lucide-react";
import type { SocialLink } from "../data/types";

const ICONS: Record<SocialLink["icon"], LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  instagram: Instagram,
  tiktok: Music2, // music note — recognizable stand-in for TikTok
  pinterest: Image, // pinboard/visual — distinct from the TikTok note
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
        const Icon = ICONS[s.icon];
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
              <Icon size={18} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
