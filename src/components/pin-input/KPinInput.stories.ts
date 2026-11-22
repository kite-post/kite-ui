import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KPinInput from './KPinInput.vue'

const meta = {
  title: 'Складні поля/KPinInput',
  component: KPinInput,
  args: {
    modelValue: '482',
    length: 6,
    groups: [3, 3],
    type: 'numeric',
    mask: false,
    otp: true,
    size: 'md',
    invalid: false,
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['numeric', 'alphanumeric'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
  render: (args) => ({
    components: { KField, KPinInput },
    setup: () => ({ args }),
    template: `<KField label="Код отримання" hint="Шість цифр з SMS"><KPinInput v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KPinInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Pomylka: Story = { name: 'Помилка', args: { modelValue: '482913', invalid: true } }
