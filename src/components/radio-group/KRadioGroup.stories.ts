import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KRadio from './KRadio.vue'
import KRadioGroup from './KRadioGroup.vue'

const options = [
  { value: 'sender', label: 'Відправник' },
  { value: 'recipient', label: 'Отримувач' },
  { value: 'business', label: 'Бізнес-рахунок', disabled: true },
]
const meta = {
  title: 'Форми/KRadioGroup',
  component: KRadioGroup,
  subcomponents: { KRadio },
  args: {
    label: 'Хто платить за доставку',
    options,
    modelValue: 'sender',
    variant: 'default',
    orientation: 'vertical',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'card'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
  },
} satisfies Meta<typeof KRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Kartky: Story = {
  name: 'Картки',
  args: {
    label: 'Тариф',
    variant: 'card',
    columns: 3,
    modelValue: 'standard',
    options: [
      { value: 'standard', label: 'Стандарт', description: 'До відділення, 2–3 дні · 80 ₴' },
      { value: 'express', label: 'Експрес', description: 'Завтра до 18:00 · 140 ₴' },
      { value: 'box', label: 'Kite Box', description: 'У поштомат, 2–3 дні · 65 ₴' },
    ],
  },
}
