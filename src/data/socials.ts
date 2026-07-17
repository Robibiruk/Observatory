import type { SocialLink } from "./types";

// Pulled from the existing portfolio's contact section.
// Kept all six the previous site linked to (spec §3.8 allowed trimming to 3;
// we preserve the full set and let the UI show the primary 3 + the rest).
export const socials: SocialLink[] = [
  { label: "Email", href: "mailto:natim7520@gmail.com", icon: "mail" },
  { label: "GitHub", href: "https://github.com/Robibiruk", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/robel-biruk-72084636b",
    icon: "linkedin",
  },
  { label: "Instagram", href: "https://instagram.com/ynw_rob.i", icon: "instagram" },
  { label: "TikTok", href: "https://tiktok.com/@ynwrobiii", icon: "tiktok" },
  { label: "Pinterest", href: "https://pinterest.com/ynwrobii", icon: "pinterest" },
];

// Primary links surfaced in the Contact section header.
export const primarySocials = socials.filter((s) =>
  ["github", "linkedin", "mail"].includes(s.icon)
);
