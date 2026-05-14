import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        // ⚠️ 注意：組員的版本是 7247，但您後端實際跑在 7148
        target: 'https://localhost:7148',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  build: {
    rollupOptions: {
      input: {
        entry:     resolve(__dirname, 'index.html'),       // 登入歡迎頁 (Welcome.cshtml 用)
        fronthome: resolve(__dirname, 'front-home.html'),  // 首頁 HomePage (Index.cshtml 用)
        profile:   resolve(__dirname, 'profile.html')      // 個人檔案頁 (Profile.cshtml 用)
      }
    }
  }
})
