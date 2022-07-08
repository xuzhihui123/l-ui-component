import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx" // jsx

export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    port: 8034
  }
})
