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
    id: 5,
    slug: "cleancity",
    title: "CleanCity",
    oneLiner:
      "Environmental reporting platform for tracking and visualizing city cleanliness metrics.",
    status: "live",
    featured: false,
    position: "both",
    sortOrder: 2,
    image: "/projects/clean-city.png",
    alt: "CleanCity dashboard showing environmental reporting metrics and city cleanliness visualization",
    links: {
      live: "https://clean-city-app.vercel.app",
      repo: "https://github.com/Robibiruk/CleanCity",
    },
    overview:
      "CleanCity is a platform for tracking and visualizing city cleanliness metrics. Users can report cleanliness issues, view aggregated data on urban hygiene, and track improvement patterns over time. The application focuses on making environmental data accessible and actionable for community members and local governments.",
    architecture:
      "React + Vite + TypeScript frontend with Tailwind CSS for styling. Node.js + Express API backend with PostgreSQL database. Real-time updates via WebSockets. Deployed on Vercel with PostgreSQL.",
    features: [
      "Issue reporting system for cleanliness problems",
      "Interactive maps with issue locations",
      "Adherence tracking and improvement patterns",
      "Community voting and prioritization",
      "Data visualization with Recharts",
      "Role-based views for residents vs administrators",
    ],
    lessons:
      "Converting ad-hoc community reporting into structured data required designing intuitive workflows and clear visualizations that motivate consistent participation.",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "WebSockets", "Vercel"],
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
    image: "/projects/devwrapped.jpg",
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
    image: "/projects/spiderman-readme.jpg",
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
    image: "/projects/repopages.jpg",
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
  // Client Work projects — commissioned deliverables
  {
    id: 20,
    slug: "craftrix-consultancy",
    title: "Craftrix Consultancy",
    oneLiner:
      "Business consultancy website — clean, professional presence for a consulting firm.",
    status: "live",
    featured: true,
    position: "both",
    sortOrder: 6,
    image: "/projects/craftrix.jpg",
    alt: "Craftrix Consultancy website homepage showing services and contact information",
    links: {
      live: "https://craftrix-consultancy.netlify.app",
      repo: "",
    },
    overview:
      "Craftrix Consultancy is a professional business website built to establish an online presence for a consulting firm. The site features a clean, minimal design with service offerings, about section, and contact functionality. Built with a focus on readability, navigation, and converting visitors into clients.",
    architecture:
      "React + Vite + TypeScript frontend with Tailwind CSS for rapid styling. Static site generation for fast performance. Netlify deployment with form handling for contact inquiries.",
    features: [
      "Responsive design mobile-first",
      "Service offerings section",
      "About section with mission statement",
      "Contact form with Netlify integration",
      "SEO-optimized markup structure",
      "Fast load times with static generation",
    ],
    lessons:
      "Building a professional service website from scratch, designing clean UI hierarchies, implementing responsive layouts, and integrating form handling without a traditional backend.",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Netlify"],
  },
  {
    id: 21,
    slug: "sami-edits",
    title: "SAMI EDITS",
    oneLiner:
      "Creative portfolio website for a digital editor and content creator.",
    status: "live",
    featured: true,
    position: "both",
    sortOrder: 7,
    image: "/projects/sami-edits.jpg",
    alt: "SAMI EDITS creative portfolio homepage showcasing editing work and projects",
    links: {
      live: "https://sami-edits.netlify.app",
      repo: "",
    },
    overview:
      "SAMI EDITS is a creative portfolio website built for a digital editor and content creator. The site features a visually-driven layout with project showcase, editing capabilities highlight, and contact functionality. Designed to showcase creative work with strong typography and imagery focus.",
    architecture:
      "React + Vite + TypeScript frontend with Tailwind CSS for styling. Animated sections and interactive elements using Framer Motion. Deployed on Netlify with smooth page transitions.",
    features: [
      "Creative portfolio showcase",
      "Project gallery with filtering",
      "About section with editor's statement",
      "Contact form with Netlify integration",
      "Framer Motion animations for section transitions",
      "Dark mode support with color-scheme",
    ],
    lessons:
      "Creating a visually-driven portfolio that puts creative work front-and-center, implementing smooth animations without sacrificing performance, and designing for both dark and light color schemes.",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
];

export const museumProjects = projects;