import { Bold, MapPin } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KToggle from './KToggle.vue'

const meta = {
  title: 'Дії/KToggle',
  component: KToggle,
  args: { defaultValue: true, variant: 'ghost', size: 'md', disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { KToggle },
    setup: () => ({ args }),
    template: `<KToggle v-bind="args">Лише мої</KToggle>`,
  }),
} satisfies Meta<typeof KToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Varianty: Story = {
  name: 'Варіанти',
  render: () => ({
    components: { KToggle },
    setup: () => ({ Bold, MapPin }),
    template: `<div class="k:flex k:flex-wrap k:items-center k:gap-3">
      <KToggle>Лише мої</KToggle>
      <KToggle :default-value="true">Лише мої</KToggle>
      <KToggle variant="secondary" :icon="MapPin" :default-value="true">На карті</KToggle>
      <KToggle :icon="Bold" label="Жирний" :default-value="true" />
      <KToggle disabled>Вимкнений</KToggle>
    </div>`,
  }),
}
