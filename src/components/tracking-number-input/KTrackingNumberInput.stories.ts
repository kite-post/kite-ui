import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KTrackingNumberInput from './KTrackingNumberInput.vue'

const meta = {
  title: 'Складні поля/KTrackingNumberInput',
  component: KTrackingNumberInput,
  args: { modelValue: 'KT123456785UA', scan: true, clearable: true, size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => ({
    components: { KField, KTrackingNumberInput },
    setup: () => ({ args }),
    template: `<KField label="Номер відправлення" class="k:max-w-sm"><KTrackingNumberInput v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KTrackingNumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Velykyi: Story = {
  name: 'Великий',
  args: { size: 'lg', scan: false, modelValue: null },
}
