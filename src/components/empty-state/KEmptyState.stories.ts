import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KEmptyState from './KEmptyState.vue'

const meta = {
  title: 'Зворотний звʼязок/KEmptyState',
  component: KEmptyState,
  args: {
    kind: 'initial',
    title: 'Тут з’являться ваші відправлення',
    description: 'Створіть першу накладну — це займе 2 хвилини.',
    size: 'md',
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['initial', 'no-results', 'error'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof KEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const NichohoNeZnaishly: Story = {
  name: 'Нічого не знайшли',
  args: { kind: 'no-results', title: undefined, description: undefined, onReset: () => {} },
}
export const Pomylka: Story = {
  name: 'Помилка',
  args: { kind: 'error', title: undefined, description: undefined, onRetry: () => {} },
}
