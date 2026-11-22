import { CircleCheck, Package, Truck } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KIcon from './KIcon.vue'

const meta = {
  title: 'Основи/KIcon',
  component: KIcon,
  args: { icon: Truck, size: 'md' },
  argTypes: {
    icon: { control: false },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
  },
} satisfies Meta<typeof KIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Rozmiry: Story = {
  name: 'Розміри',
  render: () => ({
    components: { KIcon },
    setup: () => ({ Package, CircleCheck }),
    template: `<div class="k:flex k:items-end k:gap-4 k:text-fg">
      <KIcon v-for="s in ['xs','sm','md','lg','xl','2xl']" :key="s" :icon="Package" :size="s" />
      <KIcon :icon="CircleCheck" label="Доставлено" class="k:text-success-text" />
    </div>`,
  }),
}
