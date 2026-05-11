import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 加入 server 區塊設定 Proxy 代理
  server: {
    proxy: {
      // 只要 fetch 的網址開頭是 /api，就會自動轉交給 https://localhost:7247 這個後端伺服器。
      '/api': {
        target: 'https://localhost:7247', // 自動轉交給 C# 後端
        changeOrigin: true,
        secure: false, // 因為我們在本地端用的是沒有正式憑證的 https，所以設為 false 避免擋信
      }
    }
  }
})