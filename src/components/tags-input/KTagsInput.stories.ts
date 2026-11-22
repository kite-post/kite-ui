import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KTagsInput from './KTagsInput.vue'

const meta = {
  title: 'Складні поля/KTagsInput',
  component: KTagsInput,
  args: {
    modelValue: ['KT123456785UA', 'KT987654321UA', 'XX12'],
    normalize: (v: string) => v.replace(/\s+/g, '').toUpperCase(),
    validate: (v: string) =>
      /^[A-Z]{2}\d{9}[A-Z]{2}$/.test(v) ? true : 'Неправильний формат номера',
    max: 50,
    placeholder: 'KT…',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    normalize: { control: false },
    validate: { control: false },
  },
  render: (args) => ({
    components: { KField, KTagsInput },
    setup: () => ({ args }),
    template: `<KField label="Номери накладних" hint="Вставте стовпець з Excel" class="k:max-w-[36rem]"><KTagsInput v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KTagsInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
