import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KBreadcrumbs from './KBreadcrumbs.vue'

const meta = {
  title: 'Навігація/KBreadcrumbs',
  component: KBreadcrumbs,
  args: {
    maxItems: 4,
    items: [
      { label: 'Головна', href: '#' },
      { label: 'Відправлення', href: '#' },
      { label: 'Реєстри', href: '#' },
      { label: 'Реєстр 24.11', href: '#' },
      { label: 'KT 1234 5678 5 UA' },
    ],
  },
} satisfies Meta<typeof KBreadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Zhornuti: Story = { name: 'Згорнуті' }
export const Korotki: Story = {
  name: 'Короткі',
  args: { items: [{ label: 'Налаштування', href: '#' }, { label: 'Профіль' }] },
}
