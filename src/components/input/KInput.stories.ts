import { Search } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KInput from './KInput.vue'

const meta = {
  title: 'Форми/KInput',
  component: KInput,
  args: {
    placeholder: 'Ірина Петренко',
    size: 'md',
    clearable: false,
    invalid: false,
    disabled: false,
    readonly: false,
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'url', 'search', 'tel'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { KField, KInput },
    setup: () => ({ args }),
    template: `<KField label="Ім’я отримувача" class="k:max-w-sm"><KInput v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Varianty: Story = {
  name: 'Варіанти',
  render: () => ({
    components: { KField, KInput },
    setup: () => ({ Search }),
    template: `<div class="k:grid k:max-w-sm k:gap-4">
      <KField label="Вага"><KInput model-value="2,4" suffix="кг" /></KField>
      <KField label="Пошук"><KInput :leading-icon="Search" model-value="Львів" clearable /></KField>
      <KField label="Пароль"><KInput type="password" model-value="secret" /></KField>
      <KField label="Назва магазину" :hint="undefined"><KInput model-value="Квітка" :maxlength="40" show-count /></KField>
      <KField label="Недоступне" disabled><KInput model-value="Київ" /></KField>
      <KField label="Тільки читання" readonly><KInput model-value="KT 1234 5678 5 UA" /></KField>
      <KField label="Email" error="Перевірте адресу"><KInput model-value="olga@" /></KField>
    </div>`,
  }),
}
