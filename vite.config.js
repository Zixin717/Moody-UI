import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7247',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  build: {
    // 直接 build 進 wwwroot，省去手動複製
    outDir: '../DiaryProject/DiaryProject/wwwroot/react-home',
    emptyOutDir: true,

    rollupOptions: {
      input: resolve(__dirname, 'index.html'),  // 單入口（您只負責 HomePage）

      output: {
        // 固定檔名：永遠輸出 index.js / index.css
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (info) => {
          if (info.name?.endsWith('.css')) return 'assets/index.css'
          return 'assets/[name][extname]'
        }
      }
    }
  }
})