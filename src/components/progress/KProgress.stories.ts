import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KProgress from './KProgress.vue'

const meta = {
  title: 'Зворотний звʼязок/KProgress',
  component: KProgress,
  args: {
    value: 240,
    max: 1000,
    label: 'Імпорт відправлень',
    showValue: true,
    tone: 'info',
    size: 'md',
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    formatValue: { control: false },
  },
  render: (args) => ({
    components: { KProgress },
    setup: () => ({ args }),
    template: `<KProgress v-bind="args" class="k:max-w-md" />`,
  }),
} satisfies Meta<typeof KProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Nevyznachenyi: Story = {
  name: 'Невизначений',
  args: { value: null, label: 'Формуємо маніфест', showValue: false },
}
