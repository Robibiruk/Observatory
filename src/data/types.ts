export type ProjectStatus = "live" | "in-progress" | "prototype";

/** Which section a project appears in. `both` shows it everywhere. */
export type ProjectPosition = "observatory" | "gallery" | "both";

export type Project = {
  /** DB id — set when loaded from the admin backend; absent in local data. */
  id?: number;
  slug: string;
  title: string;
  oneLiner: string;
  status: ProjectStatus;
  stack: string[];
  /** Controls large vs small bento tile. */
  featured: boolean;
  position: ProjectPosition;
  image: string;
  alt: string;
  links: { live?: string; repo?: string };
  overview: string;
  /** Optional deeper fields for the "Enter Project" detail view — only filled when true. */
  architecture?: string;
  features?: string[];
  lessons?: string;
  /** Position within the section's list (admin-managed). */
  sortOrder?: number;
};

export type TimelineStatus = "complete" | "live" | "future";

export type TimelineMilestone = {
  /** Local string ids ("start", "plp") or the numeric DB id once DB-backed. */
  id: string | number;
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
  /** Optional certificate artifact: thumbnail opens a lightbox of the full
      image; pdf (if present) links to a downloadable/verifiable copy. */
  certificate?: {
    image: string;
    pdf?: string;
    alt: string;
    caption?: string;
  };
  /** Position within the timeline (admin-managed). */
  sortOrder?: number;
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
