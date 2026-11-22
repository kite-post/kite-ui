import { Inbox, LayoutDashboard, Package, Route, Settings, Truck, Users } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KAvatar from '../avatar/KAvatar.vue'
import KSidebar from './KSidebar.vue'
import type { SidebarGroup } from './types'

const items: SidebarGroup[] = [
  { items: [{ label: 'Огляд', icon: LayoutDashboard, href: '#', active: true }] },
  {
    label: 'Операції',
    collapsible: true,
    items: [
      { label: 'Прийом', icon: Inbox, href: '#', count: 12, countLabel: 'очікують прийому' },
      { label: 'Сортування', icon: Package, href: '#' },
      {
        label: 'Рейси',
        icon: Truck,
        href: '#',
        children: [
          { label: 'Сьогодні', href: '#' },
          { label: 'Архів', href: '#' },
        ],
      },
      { label: 'Маршрути', icon: Route, href: '#', disabled: true },
    ],
  },
  {
    label: 'Адміністрування',
    items: [
      { label: 'Користувачі', icon: Users, href: '#' },
      { label: 'Налаштування', icon: Settings, href: '#' },
    ],
  },
]
const meta = {
  title: 'Навігація/KSidebar',
  component: KSidebar,
  args: { items, collapsed: false, shortcut: false },
  argTypes: { items: { control: false } },
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: { KSidebar, KAvatar },
    setup: () => ({ args }),
    template: `<div class="k:h-[40rem]"><KSidebar v-bind="args">
      <template #header="{ collapsed }"><div class="k:flex k:h-8 k:items-center k:gap-2 k:px-1 k:font-display k:text-h4"><span class="k:grid k:size-8 k:shrink-0 k:place-items-center k:rounded-sm k:bg-primary k:text-on-primary">K</span><span v-if="!collapsed">Kite Ops</span></div></template>
      <template #footer="{ collapsed }"><div class="k:flex k:items-center k:gap-2 k:px-1"><KAvatar name="Ольга Ковальчук" size="sm" decorative /><span v-if="!collapsed" class="k:truncate k:text-label">Ольга Ковальчук</span></div></template>
    </KSidebar></div>`,
  }),
} satisfies Meta<typeof KSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Rozhornuta: Story = { name: 'Розгорнута' }
export const Zhornuta: Story = { name: 'Згорнута', args: { collapsed: true } }
