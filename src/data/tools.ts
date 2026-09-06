// Static tech stack data with thesvg icon slugs.
// Each tool maps to an icon from https://github.com/glincker/thesvg

export type Tool = {
  name: string;
  /** thesvg slug — load SVG from `thesvg` package at runtime */
  icon: string;
};

export type ToolCategory = {
  label: string;
  tools: Tool[];
};

export const toolCategories: ToolCategory[] = [
  {
    label: "Programming",
    tools: [
      { name: "Python", icon: "python" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "PHP", icon: "php" },
    ],
  },
  {
    label: "AI / ML / Data",
    tools: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "LangChain", icon: "langchain" },
      { name: "OpenCV", icon: "opencv" },
      { name: "Hugging Face", icon: "hugging-face" },
      { name: "Scikit-learn", icon: "scikit-learn" },
      { name: "NumPy", icon: "numpy" },
      { name: "Pandas", icon: "pandas" },
      { name: "Jupyter", icon: "jupyter" },
      { name: "OpenRouter", icon: "openrouter" },
      { name: "Matplotlib", icon: "matplotlib" },
      { name: "Kaggle", icon: "kaggle" },
    ],
  },
  {
    label: "Backend",
    tools: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "Django", icon: "django" },
      { name: "Flask", icon: "flask" },
    ],
  },
  {
    label: "Frontend",
    tools: [
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Vue.js", icon: "vue" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Sass", icon: "sass" },
      { name: "Vite", icon: "vite" },
    ],
  },
  {
    label: "Databases",
    tools: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "MySQL", icon: "mysql" },
      { name: "SQLite", icon: "sqlite" },
      { name: "Neon", icon: "neon" },
      { name: "Supabase", icon: "supabase" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    label: "Cloud / DevOps",
    tools: [
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "GitLab", icon: "gitlab" },
      { name: "GitHub Actions", icon: "github-actions" },
      { name: "AWS", icon: "aws" },
      { name: "Google Cloud", icon: "google-cloud" },
      { name: "Microsoft Azure", icon: "azure" },
      { name: "Netlify", icon: "netlify" },
      { name: "Cloudflare", icon: "cloudflare" },
      { name: "Heroku", icon: "heroku" },
      { name: "Vercel", icon: "vercel" },
      { name: "Railway", icon: "railway" },
      { name: "Render", icon: "render" },
      { name: "Linux", icon: "linux" },
      { name: "Ubuntu", icon: "ubuntu" },
      { name: "Debian", icon: "debian" },
      { name: "Windows", icon: "windows" },
      { name: "Arduino", icon: "arduino" },
    ],
  },
  {
    label: "Development Tools",
    tools: [
      { name: "VS Code", icon: "visual-studio-code" },
      { name: "Visual Studio", icon: "visual-studio" },
      { name: "Sublime Text", icon: "sublime-text" },
      { name: "CLion", icon: "clion" },
      { name: "PyCharm", icon: "pycharm" },
      { name: "IntelliJ IDEA", icon: "intellij-idea" },
      { name: "Postman", icon: "postman" },
      { name: "npm", icon: "npm" },
      { name: "Streamlit", icon: "streamlit" },
    ],
  },
  {
    label: "Design / Creative",
    tools: [
      { name: "Figma", icon: "figma" },
      { name: "Photoshop", icon: "photoshop" },
      { name: "After Effects", icon: "after-effects" },
      { name: "Premiere Pro", icon: "premierepro" },
      { name: "Blender", icon: "blender" },
    ],
  },
  {
    label: "Productivity / Platforms",
    tools: [
      { name: "Obsidian", icon: "obsidian" },
      { name: "Notion", icon: "notion" },
      { name: "Discord", icon: "discord" },
      { name: "Stack Overflow", icon: "stack-overflow" },
      { name: "Instagram", icon: "instagram" },
      { name: "LinkedIn", icon: "linkedin" },
      { name: "X", icon: "x-formerly-twitter" },
    ],
  },
];
