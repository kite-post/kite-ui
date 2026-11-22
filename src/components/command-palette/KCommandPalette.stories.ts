import { Package } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KCommandPalette from './KCommandPalette.vue'
import type { CommandSource } from './types'

const actions: CommandSource = {
  id: 'actions',
  label: 'Дії',
  search: (q) =>
    [
      { id: 'new', label: 'Створити накладну', shortcut: ['mod', 'n'], onSelect: () => {} },
      {
        id: 'redirect',
        label: 'Переадресувати…',
        description: 'Оберіть місто',
        onSelect: () => {},
      },
    ].filter((a) => a.label.toLowerCase().includes(q.toLowerCase())),
}
const pages: CommandSource = {
  id: 'pages',
  label: 'Розділи',
  search: (q) =>
    ['Прийом', 'Сортування', 'Рейси']
      .filter((p) => p.toLowerCase().includes(q.toLowerCase()))
      .map((p) => ({ id: p, label: p, icon: Package, onSelect: () => {} })),
}
const meta = {
  title: 'Оверлеї/KCommandPalette',
  component: KCommandPalette,
  args: {
    open: true,
    sources: [actions, pages],
    recentKey: 'storybook-cmd-recent',
    openShipment: () => {},
  },
  argTypes: { sources: { control: false }, openShipment: { control: false } },
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: { KCommandPalette },
    setup: () => ({ args }),
    template: `<div class="k:min-h-[32rem]"><KCommandPalette v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof KCommandPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Vidkryta: Story = { name: 'Відкрита' }
