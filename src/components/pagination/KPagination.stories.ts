import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KPagination from './KPagination.vue'

const meta = {
  title: 'Навігація/KPagination',
  component: KPagination,
  args: { page: 5, pageSize: 50, total: 1240, variant: 'full', size: 'md', siblingCount: 1 },
  argTypes: {
    variant: { control: 'inline-radio', options: ['full', 'simple', 'cursor'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof KPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Prosta: Story = { name: 'Проста', args: { variant: 'simple', pageSizes: false } }
export const Kursor: Story = {
  name: 'Курсор',
  args: { variant: 'cursor', page: 2, hasPrev: true, hasNext: true },
}
