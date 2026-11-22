import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KCopyButton from './KCopyButton.vue'

const meta = {
  title: 'Дії/KCopyButton',
  component: KCopyButton,
  args: {
    value: 'KT123456785UA',
    label: 'Копіювати номер',
    size: 'sm',
    withLabel: false,
    toast: false,
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof KCopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const ZPidpysom: Story = { name: 'З підписом', args: { withLabel: true, size: 'md' } }
