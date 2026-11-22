import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KSpinner from './KSpinner.vue'

const meta = {
  title: 'Основи/KSpinner',
  component: KSpinner,
  args: { size: 'md', delay: 0 },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof KSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
