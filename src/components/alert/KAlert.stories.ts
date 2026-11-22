import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KAlert from './KAlert.vue'

const tones = ['info', 'success', 'warning', 'danger', 'neutral'] as const
const meta = {
  title: 'Зворотний звʼязок/KAlert',
  component: KAlert,
  args: {
    tone: 'warning',
    variant: 'subtle',
    size: 'md',
    title: 'Посилка затримується',
    dismissible: true,
  },
  argTypes: {
    tone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['subtle', 'banner'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  render: (args) => ({
    components: { KAlert, KButton },
    setup: () => ({ args }),
    template: `<KAlert v-bind="args">Через негоду доставка до Львова займе на день більше.<template #actions><KButton size="sm">Переадресувати</KButton></template></KAlert>`,
  }),
} satisfies Meta<typeof KAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Tony: Story = {
  name: 'Тони',
  render: () => ({
    components: { KAlert },
    setup: () => ({ tones }),
    template: `<div class="k:grid k:gap-3"><KAlert v-for="t in tones" :key="t" :tone="t" :title="t">Текст повідомлення для тону {{ t }}.</KAlert><KAlert tone="info" variant="banner">Сьогодні з 02:00 до 03:00 ведуться технічні роботи.</KAlert></div>`,
  }),
}
