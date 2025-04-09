import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the env directory

  console.log("===========================")
  console.log("Current Mode: ", mode)
  console.log("Current Path: ", process.cwd())
  console.log("===========================")
  const envPath = path.resolve(process.cwd(), 'env')
  const env = loadEnv(mode, envPath)
  
  const isDrop = env.VITE_IS_DROP === 'true'

  return {
    plugins: [UnoCSS(), react()],
    server: {
      host: true,
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,
      reportCompressedSize: false,
    },
    esbuild: {
      drop: isDrop ? ['console', 'debugger'] : undefined,
    },
    // Define explicit env file directory
    envDir: envPath,
  }
})
