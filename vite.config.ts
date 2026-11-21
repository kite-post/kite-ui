import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const src = (p: string) => fileURLToPath(new URL(`./src/${p}`, import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string
}

// Бібліотечний режим: ESM без бандла Vue (він peer-залежність застосунку).
// Два входи — компоненти і токени окремо, щоб застосунок міг узяти лише кольори.
export default defineConfig({
  plugins: [vue()],
  define: {
    __KITE_UI_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: { '@': src('') },
  },
  build: {
    lib: {
      entry: { index: src('index.ts'), tokens: src('tokens/index.ts') },
      formats: ['es'],
      cssFileName: 'kite-ui',
    },
    rollupOptions: {
      external: ['vue'],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
  },
})
