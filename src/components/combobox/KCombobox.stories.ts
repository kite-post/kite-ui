import { MapPin } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KCombobox from './KCombobox.vue'

const cities = [
  'Київ',
  'Львів',
  'Одеса',
  'Харків',
  'Дніпро',
  'Кам’янець-Подільський',
  'Ірпінь',
].map((c) => ({
  value: c,
  label: c,
}))
const meta = {
  title: 'Складні поля/KCombobox',
  component: KCombobox,
  args: {
    options: cities,
    modelValue: null,
    placeholder: 'Почніть вводити',
    clearable: true,
    multiple: false,
    allowCustom: false,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    filter: { control: false },
  },
  render: (args) => ({
    components: { KField, KCombobox },
    setup: () => ({ args }),
    template: `<KField label="Місто" class="k:max-w-sm"><KCombobox v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KCombobox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Vidkrytyi: Story = { name: 'Відкритий', args: { open: true } }
export const Multyvybir: Story = {
  name: 'Мультивибір',
  args: { multiple: true, modelValue: ['Київ', 'Львів', 'Одеса', 'Ірпінь'], maxVisibleChips: 2 },
}
export const OpysyIHrupy: Story = {
  name: 'Описи й групи',
  args: {
    open: true,
    options: [1, 2, 14, 27].map((n) => ({
      value: `b${n}`,
      label: `Відділення №${n}`,
      description: `Львів, вул. Соборна, ${n} · 8:00–20:00`,
      icon: MapPin,
      group: n > 20 ? 'Kite Box' : 'Відділення',
    })),
  },
}
