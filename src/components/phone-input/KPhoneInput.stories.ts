import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KPhoneInput from './KPhoneInput.vue'

const meta = {
  title: 'Складні поля/KPhoneInput',
  component: KPhoneInput,
  args: {
    modelValue: '+380671234567',
    clearable: true,
    size: 'md',
    invalid: false,
    disabled: false,
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => ({
    components: { KField, KPhoneInput },
    setup: () => ({ args }),
    template: `<KField label="Телефон отримувача" hint="На нього прийде код" class="k:max-w-xs"><KPhoneInput v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KPhoneInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Porozhnie: Story = { name: 'Порожнє', args: { modelValue: null } }
