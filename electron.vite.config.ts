import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const aliasShared = { '@shared': resolve('src/shared') }

export default defineConfig({
  main: {
    resolve: { alias: aliasShared }
  },
  preload: {
    resolve: { alias: aliasShared }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        ...aliasShared
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
