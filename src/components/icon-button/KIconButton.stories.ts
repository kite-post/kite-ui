import { Copy, Ellipsis, Printer, Trash2 } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KIconButton from './KIconButton.vue'

const meta = {
  title: 'Дії/KIconButton',
  component: KIconButton,
  args: { icon: Printer, label: 'Друкувати етикетку', variant: 'ghost', size: 'md' },
  argTypes: {
    icon: { control: false },
    variant: { control: 'select', options: ['ghost', 'secondary', 'primary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof KIconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Varianty: Story = {
  name: 'Варіанти',
  render: () => ({
    components: { KIconButton },
    setup: () => ({ Copy, Ellipsis, Printer, Trash2 }),
    template: `<div class="k:flex k:items-center k:gap-2">
      <KIconButton :icon="Ellipsis" label="Ще дії" />
      <KIconButton :icon="Copy" label="Копіювати" variant="secondary" />
      <KIconButton :icon="Printer" label="Друк" variant="primary" />
      <KIconButton :icon="Trash2" label="Видалити" variant="danger" />
      <KIconButton :icon="Trash2" label="Видалити" disabled />
      <KIconButton :icon="Copy" label="Копіювати" size="sm" />
      <KIconButton :icon="Copy" label="Копіювати" size="lg" />
    </div>`,
  }),
}
