import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 配置代理
      '/api': {
        target: 'http://123.249.104.94:8878', // 目标服务器地址
        changeOrigin: true, // 改变请求源
        rewrite: (path) => path.replace(/^\/api/, '') // 重写请求路径
      }
    }
  }
})
