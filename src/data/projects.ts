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
    id: 1,
    slug: "pulsewatch",
    title: "PulseWatch",
    oneLiner:
      "Self-hosted uptime monitoring platform with Telegram alerts and AI-explained incidents.",
    status: "live",
    featured: true,
    position: "both",
    sortOrder: 0,
    image: "/projects/pulsewatch-dashboard.png",
    alt: "PulseWatch dashboard showing real-time monitor fleet with KPI cards and status pills",
    links: {
      live: "https://pulsewatch-monitor.vercel.app",
      repo: "https://github.com/Robibiruk/PulseWatch",
    },
    overview:
      "PulseWatch is a full-stack monitoring platform for developers who want to know when their services break — before users notice. It probes endpoints every minute, tracks uptime history, opens incidents automatically on repeated failures, sends alerts to Telegram / Email / Discord / Slack / Webhooks, and provides a public status page. AI-powered incident explanations (via OpenRouter) tell you why something broke in plain English.",
    architecture:
      "FastAPI (Python) async backend with SQLAlchemy 2.0 ORM, worker scheduler with distributed claim-locking (SELECT FOR UPDATE SKIP LOCKED), and a long-polling Telegram bot — all against Neon Postgres. React + Vite + TypeScript SPA on the frontend with JWT auth. Deployed across Render (API), Vercel (frontend + docs), and GitHub Actions (always-on monitoring cron).",
    features: [
      "HTTP/HTTPS + heartbeat (push) monitors with configurable intervals",
      "Anti-false-alarm state machine — 3 consecutive failures before alerting",
      "Multi-channel alerts: Telegram, Email (Resend), Discord, Slack, webhooks",
      "AI incident explanations via OpenRouter (GPT-OSS-20b:free)",
      "Public status pages with 3 themes (neon / light / minimal)",
      "Distributed worker claim-locking — safe for 2+ replicas",
      "GitHub Actions cron for always-on monitoring on free tier",
    ],
    lessons:
      "The distributed claim-locking pattern (SKIP LOCKED + lease) made it possible to run the monitoring engine for free across Render's sleeping API + GitHub Actions cron — no paid worker service needed.",
    stack: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Vite", "Neon"],
  },
  {
    id: 2,
    slug: "nira-ai",
    title: "Nira AI",
    oneLiner:
      "A local-first desktop AI assistant — voice, reasoning, and tool use with a calm glass UI.",
    status: "live",
    featured: false,
    position: "both",
    sortOrder: 1,
    image: "/projects/nira.png",
    alt: "Nira AI desktop assistant interface with chat and voice controls",
    links: {
      live: "https://nira-ai-assistant.vercel.app",
      repo: "https://github.com/Robibiruk/Nira-AI-Assistant",
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
    stack: ["React", "Vite", "Firebase", "Three.js", "GSAP", "Framer Motion"],
  },
  {
    id: 3,
    slug: "medreminder",
    title: "MedReminder",
    oneLiner:
      "Medication reminder app with an AI layer (OpenRouter) for natural scheduling.",
    status: "live",
    featured: false,
    position: "both",
    sortOrder: 2,
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
    stack: ["React", "Vite", "Tailwind", "Express", "MongoDB", "Firebase", "Framer Motion", "Recharts", "OpenRouter"],
  },
  {
    id: 16,
    slug: "devwrapped",
    title: "DevWrapped",
    oneLiner:
      "Turn your GitHub activity into a beautiful, shareable annual story with coding stats and a developer archetype.",
    status: "live",
    featured: false,
    position: "observatory",
    sortOrder: 3,
    image: "/projects/devwrapped.png",
    alt: "DevWrapped annual developer statistics and GitHub activity story",
    links: {
      live: "https://devwrapped-app.vercel.app/",
      repo: "https://github.com/Robibiruk/DevWrapped",
    },
    overview:
      "DevWrapped turns a developer's GitHub activity into an interactive annual story. It transforms raw contribution and repository data into an engaging visual summary containing coding statistics, activity patterns, streaks, personality insights, and a developer archetype.",
    architecture:
      "GitHub API → Data Collection → Statistics / Classification → Story Generation → Interactive Web Experience. The application retrieves GitHub activity and repository information, processes the raw data into meaningful statistics, derives developer characteristics, and presents the results through a sequence of visual story sections.",
    features: [
      "GitHub activity analysis",
      "Coding statistics",
      "Contribution streaks",
      "Repository and activity insights",
      "Developer personality analysis",
      "Developer archetype",
      "Interactive annual story",
      "Shareable presentation",
      "GitHub-powered data",
      "Visual data storytelling",
    ],
    lessons:
      "Working with the GitHub API and developer activity data, transforming raw API data into meaningful statistics, designing data-driven storytelling interfaces, and creating shareable experiences from personal developer data.",
    stack: ["React", "TypeScript", "GitHub API", "Vite", "Cloudfare", "JavaScript", "CSS", "Vercel"],
  },
  {
    id: 17,
    slug: "spiderman-github-readme",
    title: "Spider-Man GitHub README",
    oneLiner:
      "Turn your GitHub profile into an animated Spider-Verse comic-book README with live developer stats.",
    status: "live",
    featured: false,
    position: "both",
    sortOrder: 4,
    image: "/projects/spiderman-readme.png",
    alt: "Animated Spider-Verse themed GitHub profile README showing developer statistics",
    links: {
      live: "https://spiderman-github-readme.vercel.app/",
      repo: "https://github.com/Robibiruk/spiderman-github-readme",
    },
    overview:
      "Spider-Man GitHub README transforms a standard GitHub profile into an animated Spider-Verse-inspired comic-book experience. The project combines GitHub developer statistics with a highly visual presentation designed to make a profile more memorable. It is intentionally lightweight and requires no backend, while supporting multiple approaches for keeping GitHub statistics fresh.",
    architecture:
      "GitHub Profile → GitHub Statistics → Dynamic README Assets → Animated / Themed Presentation. The project is designed as a zero-backend GitHub profile experience. GitHub activity and profile information are transformed into visual assets and README content that can be embedded directly into a GitHub profile.",
    features: [
      "Spider-Verse themed GitHub README",
      "Live GitHub developer statistics",
      "Animated comic-book presentation",
      "GitHub profile integration",
      "Zero-backend architecture",
      "Multiple statistics refresh methods",
      "Dynamic SVG assets",
      "Responsive presentation",
      "Highly customizable visual theme",
    ],
    lessons:
      "Working with GitHub profile data, building dynamic README experiences without a traditional backend, designing animated visual interfaces within GitHub's constraints, creating reusable assets for developer profiles, and automating the refresh of external developer statistics.",
    stack: ["GitHub API", "JavaScript", "TypeScript", "SVG", "HTML", "CSS", "GitHub Actions", "Vercel"],
  },
  {
    id: 15,
    slug: "repo-to-landing-page",
    title: "RepoPages — GitHub Repository to Landing Page",
    oneLiner:
      "Turn any GitHub repository into a polished, AI-generated product website in minutes.",
    status: "live",
    featured: false,
    position: "both",
    sortOrder: 5,
    image: "/projects/repopages.png",
    alt: "RepoPages interface generating a product landing page from a GitHub repository",
    links: {
      live: "https://repo-to-landing-page.vercel.app/",
      repo: "https://github.com/Robibiruk/Repo-to-Landing-page",
    },
    overview:
      "RepoPages transforms GitHub repositories into polished product landing pages. Instead of manually writing marketing copy and designing a website for every project, developers can provide a repository and use the application to analyze the project and generate a professional presentation. The project focuses on automating the gap between building software and presenting it — turning technical project information into a visually polished website that can be customized, exported, and deployed.",
    architecture:
      "GitHub Repository → Repository Analysis → AI Content Generation → Landing Page Builder → Preview / Export / Deployment. The application takes repository information as its input, analyzes project documentation and metadata, and transforms that information into structured website content. The generated content is then rendered through reusable landing-page components that can be customized and prepared for deployment.",
    features: [
      "GitHub repository analysis",
      "AI-generated product content",
      "Automatic landing-page generation",
      "Polished website templates",
      "Customizable generated content",
      "Live preview",
      "Export-ready pages",
      "Deployment-ready output",
      "Developer-focused workflow",
    ],
    lessons:
      "Building AI-powered developer tools, turning unstructured repository information into structured product content, designing reusable components for dynamically generated websites, automating the transition from software project to product presentation, and building tools that improve developer workflows.",
    stack: ["React", "TypeScript", "Vite", "AI/LLM APIs", "Github API", "Modern CSS", "Vercel"],
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
    id: 4,
    slug: "menstrual-tracker",
    title: "Menstrual / Period Tracking App",
    oneLiner:
      "A calm, ad-free cycle and pregnancy tracking app — emoji UI, RTL support, no clutter.",
    status: "live",
    featured: false,
    position: "gallery",
    sortOrder: 6,
    image: "/projects/menstrual.jpg",
    alt: "Menstrual and period tracking app home screen with cycle overview",
    links: {
      live: "https://atnasya-health.netlify.app/",
      repo: "https://github.com/Robibiruk/atnasya-health-frontend",
    },
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
    stack: ["React", "Vite", "TypeScript", "Tailwind", "Express", "MongoDB"],
  },
  {
    id: 5,
    slug: "clean-city",
    title: "CleanCity",
    oneLiner:
      "A community environmental reporting platform for mapping, validating, and resolving local problems.",
    status: "live",
    featured: false,
    position: "observatory",
    sortOrder: 7,
    image: "/projects/clean-city.png",
    alt: "CleanCity environmental reporting map showing community reports in Addis Ababa",
    links: {
      live: "https://clean-city-report.vercel.app/",
      repo: "https://github.com/Robibiruk/clean-city",
    },
    overview:
      "CleanCity is a community environmental reporting platform that allows residents to report local problems directly on an interactive map. Users can select a location, attach an image, categorize an issue, and publish the report to a shared community feed. The platform combines geospatial visualization with community validation through upvotes and a resolution workflow. Reports can be marked as solved or identified as false, while statistics provide an overview of the community's environmental issues.",
    architecture:
      "React/Vite Frontend → Express REST API → MongoDB Atlas. The frontend uses React, React Router, Leaflet, and shared report state to synchronize the interactive map and community feed. The Express backend provides REST endpoints for report creation, image uploads, statistics, upvotes, resolution, and deletion. MongoDB Atlas stores report data while Multer handles uploaded images.",
    features: [
      "Interactive environmental map",
      "Location-based reporting",
      "Image uploads",
      "Environmental issue categories",
      "Community upvotes",
      "Report resolution workflow",
      "False-report removal",
      "Community statistics",
      "Category filtering",
      "Live report updates",
      "Street, satellite, and dark map layers",
      "Interactive report markers",
      "Detailed report view",
      "Responsive dark interface",
    ],
    lessons:
      "Building location-based applications with interactive maps, integrating Leaflet with React, designing REST APIs for community-generated content, handling multipart image uploads, modeling report status and community validation, and synchronizing shared state between a map and feed.",
    stack: ["React 19", "Vite", "Tailwind CSS", "Leaflet", "React Router", "Node.js", "Express", "Multer", "MongoDB Atlas"],
  },
  {
    id: 6,
    slug: "data-analysis-python",
    title: "Data Analysis with Python",
    oneLiner:
      "A Jupyter Notebook assignment analyzing datasets — cleaning, visualization, and basic analysis.",
    status: "live",
    featured: false,
    position: "gallery",
    sortOrder: 8,
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
    stack: ["Python", "Jupyter", "Pandas", "Streamlit", "Data Viz"],
  },
];

// Combined list for the Museum marquee (real apps + extras).
export const museumProjects = [...projects, ...museumExtras];

// Derived helpers used by Projects / Constellation.
export const featuredProjects = projects.filter((p) => p.featured);
export const sortedProjects = [...projects].sort(
  (a, b) => Number(b.featured) - Number(a.featured)
);
