import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // Only use /baomenu/ base path for production (GitHub Pages)
  base: command === 'build' ? '/baomenu/' : '/',
  build: {
    outDir: 'dist'
  }
}))
