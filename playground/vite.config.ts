// Майданчик для ручної перевірки компонентів до появи Storybook. У пакет не потрапляє.
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  root: __dirname,
  plugins: [vue(), tailwindcss()],
  define: { __KITE_UI_VERSION__: JSON.stringify('dev') },
  server: { port: 5174 },
})
