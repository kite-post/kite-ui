import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KInput from '../input/KInput.vue'
import KLabel from '../label/KLabel.vue'
import KField from './KField.vue'

const meta = {
  title: 'Форми/KField',
  component: KField,
  subcomponents: { KLabel },
  args: {
    label: 'Ім’я отримувача',
    hint: 'Як у документі — його перевірять при видачі',
    error: null,
    optional: false,
    orientation: 'vertical',
  },
  argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  render: (args) => ({
    components: { KField, KInput },
    setup: () => ({ args }),
    template: `<KField v-bind="args" class="k:max-w-lg"><KInput model-value="Ірина Петренко" /></KField>`,
  }),
} satisfies Meta<typeof KField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Pomylka: Story = { name: 'Помилка', args: { error: 'Вкажіть ім’я і прізвище' } }
export const Neoboviazkove: Story = {
  name: 'Необовʼязкове',
  args: { label: 'Email', hint: undefined, optional: true },
}
export const Horyzontalne: Story = { name: 'Горизонтальне', args: { orientation: 'horizontal' } }
