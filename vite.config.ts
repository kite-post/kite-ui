import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const src = (p: string) => fileURLToPath(new URL(`./src/${p}`, import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

// Залежності не вшиваються в пакет: застосунок ставить їх сам і не тягне дублікати.
const deps = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]
const isExternal = (id: string) => deps.some((d) => id === d || id.startsWith(`${d}/`))

// Тема Tailwind і CSS-змінні — окремими файлами пакета, як є, для застосунків
// на Tailwind (@kite-post/ui/theme.css) і без нього (@kite-post/ui/tokens.css).
function emitStyleSources(): Plugin {
  return {
    name: 'kite:emit-style-sources',
    apply: 'build',
    generateBundle() {
      for (const name of ['theme.css', 'tokens.css']) {
        this.emitFile({ type: 'asset', fileName: name, source: readFileSync(src(`styles/${name}`)) })
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), emitStyleSources()],
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
      external: isExternal,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    css: false,
    setupFiles: ['src/test-utils/setup.ts'],
  },
})
