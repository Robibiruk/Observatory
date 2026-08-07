import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        // Proxy Netlify Functions to the `netlify dev` server so the SPA can call
        // /.netlify/functions/* in local dev just like in production. When netlify
        // dev isn't running, these requests fail and the site falls back to the
        // bundled local data (src/data/*).
        proxy: {
            "/.netlify/functions": "http://localhost:8888",
        },
    },
    build: {
        // Split the heavy 3D libs into their own chunk so they can be lazy-loaded
        // and don't block first paint.
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ["three", "@react-three/fiber", "@react-three/drei"],
                },
            },
        },
    },
});
