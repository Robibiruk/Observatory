import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Static SPA — no server, no API routes. Deployable to Vercel/Netlify/GitHub Pages.
export default defineConfig({
    plugins: [react()],
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
