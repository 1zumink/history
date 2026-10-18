import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// На GitHub Pages сайт живёт по адресу https://1zumink.github.io/history/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/history/' : '/',
  plugins: [react()],
}))
