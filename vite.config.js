import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const useBase44Hosted = Boolean(env.VITE_BASE44_APP_ID);

  return {
  // Keep default log level so the terminal shows "Local: http://localhost:5173/"
  server: {
    host: true, // listen on LAN as well; use http://localhost:5173 locally
    port: 5173,
    strictPort: false, // if 5173 is busy, try next port and print the real URL
  },
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: useBase44Hosted,
      navigationNotifier: useBase44Hosted,
      // Avoid /api/apps/null/... requests when only Supabase is configured
      analyticsTracker: useBase44Hosted,
      visualEditAgent: useBase44Hosted,
    }),
    react(),
  ],
  };
});