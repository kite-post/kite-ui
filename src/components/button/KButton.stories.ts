import { ArrowRight, Plus, Printer } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from './KButton.vue'

const meta = {
  title: 'Дії/KButton',
  component: KButton,
  args: { variant: 'primary', size: 'md', disabled: false, loading: false, block: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { KButton },
    setup: () => ({ args }),
    template: `<KButton v-bind="args">Створити накладну</KButton>`,
  }),
} satisfies Meta<typeof KButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Varianty: Story = {
  name: 'Варіанти',
  render: () => ({
    components: { KButton },
    template: `<div class="k:flex k:flex-wrap k:items-center k:gap-3">
      <KButton variant="primary">Оплатити</KButton>
      <KButton variant="secondary">Скасувати</KButton>
      <KButton variant="ghost">Детальніше</KButton>
      <KButton variant="danger">Видалити</KButton>
      <KButton variant="link">Умови доставки</KButton>
    </div>`,
  }),
}

export const RozmiryIIkonky: Story = {
  name: 'Розміри й іконки',
  render: () => ({
    components: { KButton },
    setup: () => ({ Plus, Printer, ArrowRight }),
    template: `<div class="k:flex k:flex-wrap k:items-center k:gap-3">
      <KButton size="sm" :leading-icon="Printer">Друк</KButton>
      <KButton size="md" :leading-icon="Plus">Нова накладна</KButton>
      <KButton size="lg" variant="primary" :trailing-icon="ArrowRight">Далі</KButton>
    </div>`,
  }),
}

export const Stany: Story = {
  name: 'Стани',
  render: () => ({
    components: { KButton },
    template: `<div class="k:flex k:flex-wrap k:items-center k:gap-3">
      <KButton variant="primary" loading>Зберігаємо</KButton>
      <KButton variant="primary" disabled>Недоступно</KButton>
      <KButton variant="secondary" disabled>Недоступно</KButton>
      <KButton block variant="primary">На всю ширину</KButton>
    </div>`,
  }),
}
