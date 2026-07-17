export type ProjectStatus = "live" | "in-progress" | "prototype";

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  status: ProjectStatus;
  stack: string[];
  /** Controls large vs small bento tile. */
  featured: boolean;
  image: string;
  alt: string;
  links: { live?: string; repo?: string };
  overview: string;
  /** Optional deeper fields for the "Enter Project" detail view — only filled when true. */
  architecture?: string;
  features?: string[];
  lessons?: string;
};

export type TimelineStatus = "complete" | "live" | "future";

export type TimelineMilestone = {
  id: string;
  /** Mission number, e.g. "001" */
  mission: string;
  /** Planetary chapter the mission belongs to (e.g. "Earth", "Nebula"). */
  chapter: string;
  /** Short chapter label shown in the HUD (e.g. "Origin"). */
  chapterLabel: string;
  year: string;
  title: string;
  detail: string;
  stack: string[];
  /** Achievement badge label. */
  badge: string;
  status: TimelineStatus;
  links: { live?: string; repo?: string };
};

export type SocialLink = {
  label: string;
  href: string;
  /** lucide-react icon name, resolved in the Socials component */
  icon: "github" | "linkedin" | "mail" | "instagram" | "tiktok" | "pinterest";
};

export type SiteConfig = {
  name: string;
  identity: string;
  location: string;
  tagline: string;
  mission: string;
  currentlyBuilding: string[];
  currentlyLearning: string[];
  email: string;
  cvUrl: string;
};
