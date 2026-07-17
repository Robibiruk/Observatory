import type { Project } from "./types";

// ============================================================================
// SINGLE SOURCE OF TRUTH for project content.
//
// Stacks are taken from each app's real package.json (verified).
// `links.live` / `links.repo` — repo URLs are the real Robibiruk repos.
// Some live URLs are left blank (TODO) where not yet confirmed; the UI only
// renders a button when the link exists, so nothing is invented.
// Do not invent metrics or launch dates.
// ============================================================================

export const projects: Project[] = [
  {
    slug: "nira-ai",
    title: "Nira AI",
    oneLiner:
      "A local-first desktop AI assistant — voice, reasoning, and tool use with a calm glass UI.",
    status: "in-progress",
    stack: ["React", "Vite", "Firebase", "Three.js", "GSAP", "Framer Motion"],
    featured: true,
    image: "/projects/nira.png",
    alt: "Nira AI desktop assistant interface with chat and voice controls",
    links: {
      live: "https://nira-ai-assistant.vercel.app",
      repo: "https://github.com/Robibiruk/Nira",
    },
    overview:
      "Nira is a desktop AI assistant built for natural, low-friction interaction. It speaks with a male British voice (Web Speech API), streams reasoning, and can run browser and local tools through a pluggable backend. The UI is a glassy, motion-rich workspace designed to stay out of the way.",
    architecture:
      "FastAPI/uvicorn backend + React/Vite plain-CSS UI on the desktop shell, with a separate nira-browser service for web access (no Chromium; Tavily → DuckDuckGo → Wikipedia chain). Firebase (anonymous auth + Firestore) handles per-user names, chats, and projects, mirrored to localStorage so memory survives offline.",
    features: [
      "Streaming voice (male British, Web Speech API — keyless)",
      "Reasoning block for deep models (deepseek-r1 / qwq)",
      "Tool-calling backend with isolated per-user tokens",
      "Projects workspace with localStorage-first persistence",
    ],
    lessons:
      "Keeping state local-first (localStorage mirror) made the assistant feel instant and resilient, even when Firebase writes silently fail.",
  },
  {
    slug: "medreminder",
    title: "MedReminder",
    oneLiner:
      "Medication reminder app with an AI layer (OpenRouter) for natural scheduling.",
    status: "live", // was prototype; EventHub is the prototype now
    stack: [
      "React",
      "Vite",
      "Tailwind",
      "Express",
      "MongoDB",
      "Firebase",
      "Framer Motion",
      "Recharts",
      "OpenRouter",
    ],
    featured: false,
    image: "/projects/medreminder.png",
    alt: "MedReminder app showing medication schedule and adherence chart",
    links: {
      live: "https://community-pharmacy-reminder.onrender.com",
      repo: "https://github.com/Robibiruk/Medicine-Reminder-project",
    },
    overview:
      "MedReminder helps users stay on top of medication schedules. An AI layer (OpenRouter) parses natural-language instructions into structured reminders, and adherence is visualized with charts so users and caregivers can spot patterns.",
    architecture:
      "React + Vite + Tailwind client with Framer Motion micro-interactions and Recharts adherence graphs, backed by an Express + MongoDB API. Firebase handles auth; the AI scheduling path calls OpenRouter to convert free-text dosing instructions into reminder objects.",
    features: [
      "Natural-language → structured schedule (OpenRouter)",
      "Adherence tracking with Recharts visualizations",
      "Cross-device auth via Firebase",
    ],
    lessons:
      "Letting users type reminders in plain language (vs rigid forms) dramatically lowered onboarding friction — the AI parsing step earned its place.",
  },
  {
    slug: "eventhub",
    title: "EventHub",
    oneLiner:
      "Two-sided event ticketing SaaS for Ethiopia — discovery, checkout, and Chapa payments.",
    status: "prototype", // corrected: EventHub is the prototype
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind",
      "Zustand",
      "React Query",
      "Express",
      "MongoDB",
      "JWT",
      "Chapa",
    ],
    featured: false, // not featured: keeps MedReminder as the 2nd bento tile
    image: "/projects/eventhub.png",
    alt: "EventHub event listing and checkout screen with Ethiopian events",
    links: {
      // live: prototype — no live deployment yet
      repo: "https://github.com/Robibiruk/Event-Hub",
    },
    overview:
      "EventHub is an event marketplace connecting organizers and attendees. Organizers publish events and issue QR tickets; attendees discover Ethiopian events, buy with Chapa, and get QR-coded passes. The backend is a typed Express + MongoDB API with auth, rate limiting, and validation.",
    architecture:
      "Monorepo: Express + Mongoose API (JWT auth, Zod validation, Helmet, rate limiting, QR ticket generation) talking to a React/TypeScript/Vite client using Zustand for cart/UI state and React Query for server cache. Payments via Chapa; tickets rendered as scannable QR codes.",
    features: [
      "Organizer dashboards + attendee-facing discovery",
      "Chapa payment integration with QR tickets",
      "Typed end-to-end (Zod on server, TS on client)",
      "Secure-by-default API (Helmet, rate-limit, JWT)",
    ],
    lessons:
      "Splitting client state (Zustand) from server cache (React Query) removed a whole class of stale-UI bugs versus a single global store.",
  },
];

// ----------------------------------------------------------------------------
// Museum-only extras — shown in the Museum marquee but NOT in the Projects
// bento grid or the Technology Constellation (per request). These are the
// menstrual/period tracker (in development) plus two projects carried over
// from the previous portfolio site.
// ----------------------------------------------------------------------------
export const museumExtras: Project[] = [
  {
    slug: "menstrual-tracker",
    title: "Menstrual / Period Tracking App",
    oneLiner:
      "A calm, ad-free cycle and pregnancy tracking app — emoji UI, RTL support, no clutter.",
    status: "in-progress", // "on development"
    stack: ["React", "Vite", "TypeScript", "Tailwind", "Express", "MongoDB"],
    featured: false,
    image: "/projects/menstrual.jpg",
    alt: "Menstrual and period tracking app home screen with cycle overview",
    links: {}, // in development — links to be added
    overview:
      "A period and cycle tracking app focused on a friendly, ad-free experience. Built with an emoji-driven UI, right-to-left language support, and a clean information architecture that keeps the user's data first.",
    architecture:
      "React/Vite/TypeScript/Tailwind client with an Express + MongoDB backend (Atlas).",
    features: [
      "Ad-free, emoji-led UI",
      "Right-to-left (RTL) language support",
      "Cycle + pregnancy tracking modes",
    ],
    lessons: "",
  },
  {
    slug: "clean-city",
    title: "Clean City — Report & Restore",
    oneLiner:
      "A platform for reporting and restoring clean-city initiatives, with data analysis and visualization.",
    status: "live",
    stack: ["React", "Vite", "Data Visualization", "Charts"],
    featured: false,
    image: "/projects/clean-city.png",
    alt: "Clean City report and restore dashboard with city initiative maps",
    links: {
      live: "https://clean-city-l9tfceiqg-robels-projects-a70f5979.vercel.app/",
      repo: "https://github.com/Robibiruk/clean-city",
    },
    overview:
      "A project focused on reporting and restoring clean city initiatives, showcasing data analysis and visualization techniques.",
    architecture: "",
    features: ["Citizen reporting flow", "Data analysis dashboard", "Restoration tracking"],
    lessons: "",
  },
  {
    slug: "data-analysis-python",
    title: "Data Analysis with Python",
    oneLiner:
      "A Jupyter Notebook assignment analyzing datasets — cleaning, visualization, and basic analysis.",
    status: "live",
    stack: ["Python", "Jupyter", "Pandas", "Streamlit", "Data Viz"],
    featured: false,
    image: "/projects/data-analysis.jpeg",
    alt: "Jupyter notebook with Python data analysis and Streamlit dashboard",
    links: {
      live: "https://cord19-sample-analysis.streamlit.app/",
      repo: "https://github.com/Robibiruk/Data_Analaysis_Python_Week_7_Assignment",
    },
    overview:
      "A Jupyter Notebook assignment analyzing datasets, performing data cleaning, visualization, and basic analysis using Python libraries.",
    architecture: "",
    features: ["Data cleaning with Pandas", "Visualization", "Streamlit deployment"],
    lessons: "",
  },
];

// Combined list for the Museum marquee (real apps + extras).
export const museumProjects = [...projects, ...museumExtras];

// Derived helpers used by Projects / Constellation.
export const featuredProjects = projects.filter((p) => p.featured);
export const sortedProjects = [...projects].sort(
  (a, b) => Number(b.featured) - Number(a.featured)
);
