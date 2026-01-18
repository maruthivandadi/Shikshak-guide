import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load all environment variables
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Safety check to warn during build if key is missing
  if (mode === 'production' && !env.API_KEY) {
    console.warn("⚠️  WARNING: API_KEY is missing in the build environment. The app will not function correctly.");
  }

  return {
    plugins: [react()],
    define: {
      // Safely stringify the key. If missing, it becomes an empty string literal "" in the code.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      'process.env': {} 
    },
    server: {
      host: true
    },
    preview: {
      allowedHosts: true
    }
  };
});