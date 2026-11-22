import { Truck } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KBadge from './KBadge.vue'

const tones = ['neutral', 'info', 'success', 'warning', 'danger'] as const
const meta = {
  title: 'Основи/KBadge',
  component: KBadge,
  args: { tone: 'info', variant: 'subtle', size: 'md', dot: false },
  argTypes: {
    tone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['subtle', 'solid', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { KBadge },
    setup: () => ({ args }),
    template: `<KBadge v-bind="args">Їде до Львова</KBadge>`,
  }),
} satisfies Meta<typeof KBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const TonyIVarianty: Story = {
  name: 'Тони й варіанти',
  render: () => ({
    components: { KBadge },
    setup: () => ({ tones, Truck }),
    template: `<div class="k:grid k:gap-2">
      <div v-for="v in ['subtle','solid','outline']" :key="v" class="k:flex k:flex-wrap k:gap-2">
        <KBadge v-for="t in tones" :key="t" :tone="t" :variant="v" :icon="Truck">{{ t }}</KBadge>
      </div>
      <div class="k:flex k:gap-2"><KBadge :count="3" tone="danger" variant="solid" label="3 непрочитані" /><KBadge :count="120" /><KBadge dot tone="success">Онлайн</KBadge></div>
    </div>`,
  }),
}
