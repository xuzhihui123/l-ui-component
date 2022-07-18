import { defineConfig } from "vite"
import path from "path"

export default defineConfig(async () => {
  return {
    server: {
      host: true,
      fs: {
        allow: [path.resolve(__dirname, "..")]
      }
    }
  }
})
