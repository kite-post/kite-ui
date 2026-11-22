import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KDateRangePicker from './KDateRangePicker.vue'

const meta = {
  title: 'Складні поля/KDateRangePicker',
  component: KDateRangePicker,
  args: {
    modelValue: { start: '2026-11-10', end: '2026-11-20' },
    confirm: false,
    clearable: true,
    months: 2,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    months: { control: 'inline-radio', options: [1, 2] },
  },
  render: (args) => ({
    components: { KField, KDateRangePicker },
    setup: () => ({ args }),
    template: `<KField label="Період" class="k:max-w-[24rem]"><KDateRangePicker v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KDateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Vidkrytyi: Story = { name: 'Відкритий', args: { open: true } }
export const ZPidtverdzhenniam: Story = {
  name: 'З підтвердженням',
  args: { open: true, confirm: true, maxRange: 31, months: 1 },
}
