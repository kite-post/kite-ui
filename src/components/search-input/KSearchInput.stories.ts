import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KSearchInput from './KSearchInput.vue'

const meta = {
  title: 'Форми/KSearchInput',
  component: KSearchInput,
  args: {
    label: 'Пошук відправлень',
    placeholder: 'Номер, телефон або ПІБ',
    shortcut: '/',
    loading: false,
    variant: 'outline',
    size: 'md',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { KSearchInput },
    setup: () => ({ args }),
    template: `<KSearchInput v-bind="args" class="k:max-w-[28rem]" />`,
  }),
} satisfies Meta<typeof KSearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Zapovnenyi: Story = {
  name: 'Заповнений',
  args: { variant: 'filled', shortcut: 'mod+k' },
}
export const Zavantazhennia: Story = {
  name: 'Завантаження',
  args: { loading: true, modelValue: 'KT1234' },
}
