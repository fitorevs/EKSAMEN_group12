import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.SANITY_USER_TOKEN': JSON.stringify(env.SANITY_USER_TOKEN),
      'process.env.SANITY_PROJECT_ID': JSON.stringify(env.SANITY_PROJECT_ID),
      'process.env.X_RAPIDAPI_KEY': JSON.stringify(env.X_RAPIDAPI_KEY),
      'process.env.X_RAPIDAPI_HOST': JSON.stringify(env.X_RAPIDAPI_HOST)
    },
    plugins: [react()],
  }
})