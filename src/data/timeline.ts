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
    title: "The First Line of Code",
    detail:
      "Started programming alongside my pharmacy studies, learning the foundations of the web and discovering that I could build things instead of only consuming them.",
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
    title: "Entered Full-Stack Development",
    detail:
      "Moved from frontend experiments into full-stack development, building applications with React and the MERN stack.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    badge: "Orbit Achieved",
    status: "complete",
    links: { repo: undefined, live: undefined },
  },
  {
    id: "plp",
    mission: "003",
    chapter: "Mars",
    chapterLabel: "Systems Online",
    year: "2024",
    title: "PLP Software Engineering",
    detail:
      "Completed the PLP Software Engineering program and went deeper into full-stack architecture, APIs, deployment, and modern development workflows.",
    stack: ["MERN", "REST APIs", "Vite", "Tailwind"],
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
    id: "nira",
    mission: "004",
    chapter: "Nebula",
    chapterLabel: "AI Ignition",
    year: "2025",
    title: "Entered the AI Frontier",
    detail:
      "Started building AI-powered software and exploring how language models, tools, memory, and voice could become part of real applications. Nira AI — a local-first desktop assistant built around voice interaction, reasoning, memory, and tools.",
    stack: ["Python", "FastAPI", "React", "OpenRouter"],
    badge: "AI Ignition",
    status: "complete",
    links: {
      repo: "https://github.com/Robibiruk/Nira-AI-Assistant",
      live: "https://nira-ai-assistant.vercel.app",
    },
  },
  {
    id: "pulsewatch",
    mission: "005",
    chapter: "Deep Space",
    chapterLabel: "Reliability",
    year: "2026",
    title: "Entered Infrastructure",
    detail:
      "Built PulseWatch after experiencing the limitations of free hosting firsthand. Turned that frustration into a self-hosted monitoring platform with automated alerts and AI-assisted incident analysis.",
    stack: ["FastAPI", "React", "TypeScript", "PostgreSQL", "Azure", "Linux"],
    badge: "Deep Space Ops",
    status: "complete",
    links: {
      repo: "https://github.com/Robibiruk/PulseWatch",
      live: "https://pulsewatch-monitor.vercel.app",
    },
  },
  {
    id: "beyond-stack",
    mission: "006",
    chapter: "Deep Space",
    chapterLabel: "Next Frontier",
    year: "2026",
    title: "Building Beyond the Stack",
    detail:
      "Moving from individual applications toward larger product systems, combining AI, infrastructure, developer tooling, and real-world problem solving. Current work includes new AI systems, autonomous infrastructure, and products designed to be shipped rather than left as prototypes.",
    stack: ["AI", "Full-Stack", "Cloud", "Infrastructure", "Automation"],
    badge: "In Progress",
    status: "live",
    links: { repo: undefined, live: undefined },
  },
  {
    id: "future",
    mission: "007",
    chapter: "Deep Space",
    chapterLabel: "Uncharted",
    year: "—",
    title: "The Next Sector",
    detail:
      "The map is still expanding. More ambitious systems. Harder problems. Products that have to survive outside the development environment.",
    stack: ["Researching"],
    badge: "Uncharted",
    status: "future",
    links: { repo: undefined, live: undefined },
  },
];
