const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'node_modules/@thesvg/icons/dist');

// Slugs we need (matching icon-resolver.ts, with 'vue' instead of 'vuejs')
const slugs = [
  'python', 'javascript', 'typescript', 'php', 'pytorch', 'langchain', 'opencv',
  'hugging-face', 'scikit-learn', 'numpy', 'pandas', 'jupyter', 'openrouter',
  'matplotlib', 'kaggle', 'fastapi', 'nodejs', 'express', 'django', 'flask',
  'html5', 'css3', 'react', 'nextjs', 'vue', 'tailwindcss', 'bootstrap', 'sass',
  'vite', 'postgresql', 'mongodb', 'mysql', 'sqlite', 'neon', 'supabase', 'firebase',
  'docker', 'kubernetes', 'git', 'github', 'gitlab', 'github-actions', 'aws',
  'google-cloud', 'azure', 'netlify', 'cloudflare', 'heroku', 'vercel', 'railway',
  'render', 'linux', 'ubuntu', 'debian', 'windows', 'arduino', 'visual-studio-code',
  'visual-studio', 'sublime-text', 'clion', 'pycharm', 'intellij-idea', 'postman',
  'npm', 'streamlit', 'figma', 'photoshop', 'after-effects', 'premierepro', 'blender',
  'obsidian', 'notion', 'discord', 'stack-overflow', 'instagram', 'linkedin',
  'x-formerly-twitter', 'tiktok', 'pinterest'
];

const svgMap = {};

for (const slug of slugs) {
  const filePath = path.join(distDir, slug + '.js');
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Extract SVG string
    const match = content.match(/export const svg\s*=\s*`([\s\S]*?)`;/);
    if (match) {
      svgMap[slug] = match[1];
    }
  }
}

// Write TypeScript file
const entries = Object.entries(svgMap);
const jsonPart = entries.map(([k, v]) => `  "${k}": \`${v}\``).join(',\n');

const tsContent = `// Auto-generated from @thesvg/icons — do not edit manually
// Source: https://github.com/glincker/thesvg

export const thesvgIcons: Record<string, string> = {
${jsonPart}
};
`;

const outputPath = path.join(__dirname, 'src/data/thesvg-icons.ts');
fs.writeFileSync(outputPath, tsContent);
console.log('Generated thesvg-icons.ts with', Object.keys(svgMap).length, 'icons');
