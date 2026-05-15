import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7148',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  build: {
    // ✨ 改動 1：直接 build 進 wwwroot，省去手動複製
    outDir: '../DiaryProject/DiaryProject/wwwroot/entry',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        entry:     resolve(__dirname, 'index.html'),
        fronthome: resolve(__dirname, 'front-home.html'),
        profile:   resolve(__dirname, 'profile.html')
      },

      // ✨ 改動 2：固定檔名，永不變
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
})