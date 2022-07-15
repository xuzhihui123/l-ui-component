
import { defineConfig } from 'vite'
import path from 'path'


export default defineConfig(async ({ mode }) => {
  return {
    server: {
      host: true,
      fs: {
        allow: [path.resolve(__dirname,'..')],
      },
    }
  }
})


