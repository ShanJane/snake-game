import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/snake-game/',  // 添加这一行
  plugins: [vue()]
})