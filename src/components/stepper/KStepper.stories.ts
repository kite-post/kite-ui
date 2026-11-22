import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KStepper from './KStepper.vue'

const meta = {
  title: 'Навігація/KStepper',
  component: KStepper,
  args: {
    modelValue: 2,
    orientation: 'horizontal',
    linear: true,
    steps: [
      { title: 'Відправник', description: 'Ольга Ковальчук' },
      { title: 'Отримувач' },
      { title: 'Посилка' },
      { title: 'Оплата' },
    ],
  },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof KStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Vertykalnyi: Story = {
  name: 'Вертикальний',
  args: {
    orientation: 'vertical',
    modelValue: 3,
    linear: false,
    steps: [
      { title: 'Створено', description: '24.11, 10:12' },
      { title: 'Оплата', state: 'error', description: 'Картку відхилено' },
      { title: 'Передача кур’єру' },
      { title: 'Доставлено', state: 'disabled' },
    ],
  },
}
