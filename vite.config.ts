import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'deployment-revision',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'deployment.json',
          source: JSON.stringify({
            environment: process.env.VERCEL_ENV ?? mode,
            revision: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
          }),
        });
      },
    },
  ],
  define: {
    'import.meta.env.VITE_DEPLOY_ENV': JSON.stringify(
      process.env.VERCEL_ENV ?? mode,
    ),
    'import.meta.env.VITE_DEPLOY_REVISION': JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local',
    ),
  },
  // Synthetic public configuration for the browser suite. No Auth/account is real.
  // Production/dev keep their ordinary environment configuration.
  ...(mode === 'test'
    ? {
        define: {
          'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
            'https://cp3-fixture.supabase.co',
          ),
          'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
            'synthetic-publishable-key',
          ),
        },
      }
    : {}),
}));
