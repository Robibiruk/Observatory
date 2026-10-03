// Icon resolver: combines local devicons with thesvg brand icons.
// Devicons are preferred; thesvg is used as fallback for brand icons not in devicons.

import { thesvgIcons } from "./thesvg-icons";

// Local devicon paths (from /public/devicons/)
// Map tool names to icon sources
// Each entry: { devicon?: string; thesvg?: string }
// devicon takes precedence
export const TOOL_ICON_MAP: Record<string, { devicon?: string; thesvg?: string }> = {
  Python: { thesvg: "python" },
  JavaScript: { thesvg: "javascript" },
  TypeScript: { devicon: "/devicons/typescript.svg", thesvg: "typescript" },
  PHP: { thesvg: "php" },
  PyTorch: { thesvg: "pytorch" },
  LangChain: { thesvg: "langchain" },
  OpenCV: { thesvg: "opencv" },
  "Hugging Face": { thesvg: "hugging-face" },
  "Scikit-learn": { thesvg: "scikit-learn" },
  NumPy: { thesvg: "numpy" },
  Pandas: { thesvg: "pandas" },
  Jupyter: { thesvg: "jupyter" },
  OpenRouter: { devicon: "/devicons/openrouter.svg", thesvg: "openrouter" },
  Matplotlib: { thesvg: "matplotlib" },
  Kaggle: { thesvg: "kaggle" },
  FastAPI: { thesvg: "fastapi" },
  "Node.js": { thesvg: "nodejs" },
  Express: { devicon: "/devicons/express.svg", thesvg: "express" },
  Django: { thesvg: "django" },
  Flask: { thesvg: "flask" },
  HTML5: { thesvg: "html5" },
  CSS3: { thesvg: "css3" },
  React: { devicon: "/devicons/react.svg", thesvg: "react" },
  "Next.js": { thesvg: "nextjs" },
  "Vue.js": { thesvg: "vue" },
  "Tailwind CSS": { devicon: "/devicons/tailwindcss.svg", thesvg: "tailwindcss" },
  Bootstrap: { thesvg: "bootstrap" },
  Sass: { thesvg: "sass" },
  Vite: { devicon: "/devicons/vite.svg", thesvg: "vite" },
  PostgreSQL: { thesvg: "postgresql" },
  MongoDB: { devicon: "/devicons/mongodb.svg", thesvg: "mongodb" },
  MySQL: { thesvg: "mysql" },
  SQLite: { thesvg: "sqlite" },
  Neon: { thesvg: "neon" },
  Supabase: { thesvg: "supabase" },
  Firebase: { devicon: "/devicons/firebase.svg", thesvg: "firebase" },
  Docker: { thesvg: "docker" },
  Kubernetes: { thesvg: "kubernetes" },
  Git: { thesvg: "git" },
  GitHub: { thesvg: "github" },
  GitLab: { thesvg: "gitlab" },
  "GitHub Actions": { thesvg: "github-actions" },
  AWS: { thesvg: "aws" },
  "Google Cloud": { thesvg: "google-cloud" },
  "Microsoft Azure": { thesvg: "azure" },
  Netlify: { thesvg: "netlify" },
  Cloudflare: { thesvg: "cloudflare" },
  Heroku: { thesvg: "heroku" },
  Vercel: { thesvg: "vercel" },
  Railway: { thesvg: "railway" },
  Render: { thesvg: "render" },
  Linux: { thesvg: "linux" },
  Ubuntu: { thesvg: "ubuntu" },
  Debian: { thesvg: "debian" },
  Windows: { thesvg: "windows" },
  Arduino: { thesvg: "arduino" },
  "VS Code": { thesvg: "visual-studio-code" },
  "Visual Studio": { thesvg: "visual-studio" },
  "Sublime Text": { thesvg: "sublime-text" },
  CLion: { thesvg: "clion" },
  PyCharm: { thesvg: "pycharm" },
  "IntelliJ IDEA": { thesvg: "intellij-idea" },
  Postman: { thesvg: "postman" },
  npm: { thesvg: "npm" },
  Streamlit: { thesvg: "streamlit" },
  Figma: { thesvg: "figma" },
  Photoshop: { thesvg: "photoshop" },
  "After Effects": { thesvg: "after-effects" },
  "Premiere Pro": { thesvg: "premierepro" },
  Blender: { thesvg: "blender" },
  Obsidian: { thesvg: "obsidian" },
  Notion: { thesvg: "notion" },
  Discord: { thesvg: "discord" },
  "Stack Overflow": { thesvg: "stack-overflow" },
  Instagram: { thesvg: "instagram" },
  LinkedIn: { thesvg: "linkedin" },
  X: { thesvg: "x-formerly-twitter" },
  TikTok: { thesvg: "tiktok" },
  Pinterest: { thesvg: "pinterest" },
};

// Get icon source for a tool name
export function getIconSource(toolName: string): { type: "devicon" | "thesvg"; value: string } | null {
  const entry = TOOL_ICON_MAP[toolName];
  if (!entry) return null;
  if (entry.devicon) return { type: "devicon", value: entry.devicon };
  if (entry.thesvg) return { type: "thesvg", value: entry.thesvg };
  return null;
}

// Get inline SVG string from thesvg library (pre-extracted)
export function getThesvgSvg(slug: string): string | null {
  return thesvgIcons[slug] ?? null;
}
