import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KNumberField from './KNumberField.vue'

const meta = {
  title: 'Складні поля/KNumberField',
  component: KNumberField,
  args: {
    modelValue: 2.4,
    precision: 1,
    unit: 'кг',
    min: 0.1,
    max: 30,
    step: 0.1,
    stepper: true,
    format: 'decimal',
    size: 'md',
  },
  argTypes: {
    format: { control: 'inline-radio', options: ['decimal', 'money', 'percent'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { KField, KNumberField },
    setup: () => ({ args }),
    template: `<KField label="Вага" hint="До 30 кг" class="k:max-w-xs"><KNumberField v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KNumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Hroshi: Story = {
  name: 'Гроші',
  args: {
    format: 'money',
    modelValue: 125000,
    stepper: false,
    unit: undefined,
    precision: 2,
    min: 0,
    max: undefined,
    step: 1,
  },
}
