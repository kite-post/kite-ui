import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/vue3-vite', options: {} },
  core: { disableTelemetry: true },
  // Конфіг бібліотеки (library mode) Storybook не підходить — беремо лише плагіни.
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      define: { __KITE_UI_VERSION__: JSON.stringify('storybook') },
      // Для GitHub Pages: сайт лежить у підкаталозі репозиторію.
      base: process.env.STORYBOOK_BASE ?? config.base,
    })
  },
}

export default config
