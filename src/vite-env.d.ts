/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No public env vars required — the contact form uses Netlify Forms (edge-side).
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
