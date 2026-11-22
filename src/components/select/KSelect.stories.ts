import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KSelect from './KSelect.vue'

const options = [
  { value: 'size', label: 'Не підійшов розмір', group: 'Товар' },
  { value: 'defect', label: 'Брак', group: 'Товар' },
  { value: 'late', label: 'Затримка доставки', group: 'Доставка' },
  { value: 'other', label: 'Інше', description: 'Опишіть у коментарі', group: 'Доставка' },
]
const meta = {
  title: 'Форми/KSelect',
  component: KSelect,
  args: {
    options,
    modelValue: 'size',
    clearable: true,
    size: 'md',
    disabled: false,
    invalid: false,
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => ({
    components: { KField, KSelect },
    setup: () => ({ args }),
    template: `<KField label="Причина повернення" class="k:max-w-sm"><KSelect v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Vidkrytyi: Story = {
  name: 'Відкритий',
  args: { open: true },
  parameters: { layout: 'padded' },
}
