import type { Preview } from '@storybook/vue3-vite'
import { watchEffect } from 'vue'

import '../src/styles/index.css'
import KConfigProvider from '../src/config/KConfigProvider.vue'

// Тема й мова — глобальні перемикачі в панелі Storybook; кожна історія доступна в усіх
// комбінаціях (і візуальні тести знімають обидві теми через ?globals=theme:dark).
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема',
      toolbar: {
        title: 'Тема',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Світла' },
          { value: 'dark', title: 'Темна' },
          { value: 'system', title: 'Системна' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Мова',
      toolbar: {
        title: 'Мова',
        icon: 'globe',
        items: [
          { value: 'uk', title: 'Українська' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', locale: 'uk' },
  decorators: [
    (story, context) => ({
      components: { story, KConfigProvider },
      setup() {
        watchEffect(() => {
          const theme = context.globals.theme as string
          const root = document.documentElement
          if (theme === 'system') delete root.dataset.theme
          else root.dataset.theme = theme
        })
        return { locale: context.globals.locale as 'uk' | 'en' }
      },
      template: `<KConfigProvider :locale="locale"><div class="k:p-1 k:text-fg k:font-sans"><story /></div></KConfigProvider>`,
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Вступ',
          'Основи',
          'Дії',
          'Форми',
          'Складні поля',
          'Оверлеї',
          'Зворотний звʼязок',
          'Навігація',
          'Дані',
          'Домен',
          'Оболонка',
        ],
      },
    },
    docs: { toc: true },
  },
  tags: ['autodocs'],
}

export default preview
