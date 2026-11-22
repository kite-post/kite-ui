import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KDatePicker from './KDatePicker.vue'

const meta = {
  title: 'Складні поля/KDatePicker',
  component: KDatePicker,
  args: {
    modelValue: '2026-11-24',
    min: '2026-11-20',
    max: '2026-12-06',
    isDateUnavailable: (d: string) => new Date(`${d}T00:00:00`).getDay() === 0,
    presets: [
      { label: 'Завтра', value: '2026-11-25' },
      { label: 'Через тиждень', value: '2026-12-01' },
    ],
    calendar: true,
    clearable: true,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    isDateUnavailable: { control: false },
  },
  render: (args) => ({
    components: { KField, KDatePicker },
    setup: () => ({ args }),
    template: `<KField label="Тримати до" class="k:max-w-xs"><KDatePicker v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Vidkrytyi: Story = { name: 'Відкритий', args: { open: true } }
export const BezKalendaria: Story = {
  name: 'Без календаря',
  args: {
    calendar: false,
    modelValue: '1990-03-08',
    min: undefined,
    max: undefined,
    presets: undefined,
  },
}
