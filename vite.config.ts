import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `global`
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': JSON.stringify({}),
  },
  optimizeDeps: {
    include: ['buffer'],
    exclude: ['unenv/node/process'],
  },
  build: {
    rollupOptions: {
      external: [],
      onwarn(warning, warn) {
        // Ignore all warnings about unresolved imports for unenv polyfills
        // These are polyfilled by vite-plugin-node-polyfills
        if (warning.message.includes('unenv/')) {
          return;
        }
        warn(warning);
      },
    },
  },
})
