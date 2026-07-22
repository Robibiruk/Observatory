import type { TimelineMilestone } from "./types";

// Hand-maintained — the visitor's career as a space expedition.
// Each milestone is a "completed mission", grouped into planetary chapters.
// Order: oldest → newest. Years are approximate where not precisely confirmed.
export const timeline: TimelineMilestone[] = [
  {
    id: "start",
    mission: "001",
    chapter: "Earth",
    chapterLabel: "Origin",
    year: "2022",
    title: "Started programming",
    detail:
      "Began learning web development alongside my pharmacy studies — HTML, CSS, and JavaScript first.",
    stack: ["HTML", "CSS", "JavaScript", "Git"],
    badge: "Liftoff",
    status: "complete",
    links: { repo: undefined, live: undefined },
  },
  {
    id: "first-react",
    mission: "002",
    chapter: "Moon",
    chapterLabel: "First Orbit",
    year: "2023",
    title: "First React app",
    detail:
      "Shipped my first React projects and fell into the MERN stack for full-stack work.",
    stack: ["React", "Node", "Express", "MongoDB"],
    badge: "Orbit Achieved",
    status: "complete",
    links: { repo: undefined, live: undefined },
  },
  {
    id: "plp",
    mission: "003",
    chapter: "Mars",
    chapterLabel: "Frontend Warp",
    year: "2024",
    title: "PLP MERN certificate",
    detail:
      "Completed a structured MERN full-stack program, deepening backend and deployment skills.",
    stack: ["MERN", "REST", "Vite", "Tailwind"],
    badge: "Certified",
    status: "complete",
    links: { repo: undefined, live: undefined },
    certificate: {
      image: "/certificates/plp-mern.webp",
      pdf: "/certificates/plp-mern.pdf",
      alt: "PLP MERN Fullstack Development certificate",
      caption: "PLP MERN Fullstack Development",
    },
  },
  {
    id: "medreminder",
    mission: "004",
    chapter: "Saturn",
    chapterLabel: "Backend Rings",
    year: "2024",
    title: "Built MedReminder",
    detail:
      "Built MedReminder — a medication reminder app to keep patients on track with their doses, developed while enrolled in the PLP hackathon.",
    stack: ["React", "Express", "MongoDB", "Node"],
    badge: "Live Mission",
    status: "live",
    links: { repo: undefined, live: undefined },
  },
  {
    id: "nira",
    mission: "005",
    chapter: "Nebula",
    chapterLabel: "AI Ignition",
    year: "2025",
    title: "Built Nira AI ",
    detail:
      "Started Nira AI, a local-first desktop assistant with voice, reasoning, and tools.",
    stack: ["React", "Three.js", "FastAPI", "OpenRouter"],
    badge: "In Flight",
    status: "live",
    links: {
      repo: "https://github.com/Robibiruk/Nira-AI-Assistant",
      live: "https://nira-ai-assistant.vercel.app",
    },
  },
  {
    id: "future",
    mission: "006",
    chapter: "Deep Space",
    chapterLabel: "Future Vision",
    year: "—",
    title: "Next mission",
    detail:
      "The journey continues. Researching agentic systems, real-time 3D, and tools that feel alive.",
    stack: ["Researching"],
    badge: "Uncharted",
    status: "future",
    links: { repo: undefined, live: undefined },
  },
];
