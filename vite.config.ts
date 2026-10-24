import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
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
