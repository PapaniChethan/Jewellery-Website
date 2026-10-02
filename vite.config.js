import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration. No special aliasing is required; kept intentionally
// minimal so the project is easy to drop into any hosting pipeline
// (Vercel, Netlify, static S3 bucket, etc).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Split the heavy 3D vendor libraries into their own chunk so the
    // initial JS payload for a first paint stays small.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
