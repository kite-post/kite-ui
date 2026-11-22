import { Bell, Inbox, LayoutDashboard, Package } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KAvatar from '../avatar/KAvatar.vue'
import KButton from '../button/KButton.vue'
import KIconButton from '../icon-button/KIconButton.vue'
import KSearchInput from '../search-input/KSearchInput.vue'
import KSidebar from '../sidebar/KSidebar.vue'
import KAppShell from './KAppShell.vue'
import KAppShellPageHeader from './KAppShellPageHeader.vue'

const nav = [
  { items: [{ label: 'Огляд', icon: LayoutDashboard, href: '#' }] },
  {
    label: 'Операції',
    items: [
      { label: 'Прийом', icon: Inbox, href: '#', active: true, count: 12 },
      { label: 'Сортування', icon: Package, href: '#' },
    ],
  },
]
const meta = {
  title: 'Оболонка/KAppShell',
  component: KAppShell,
  subcomponents: { KAppShellPageHeader },
  args: { contentWidth: 'full', appName: 'Kite Ops' },
  argTypes: { contentWidth: { control: 'inline-radio', options: ['full', 'wide'] } },
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: {
      KAppShell,
      KAppShellPageHeader,
      KSidebar,
      KSearchInput,
      KIconButton,
      KAvatar,
      KButton,
    },
    setup: () => ({ args, nav, Bell }),
    template: `<KAppShell v-bind="args">
      <template #sidebar="{ inSheet }"><KSidebar :items="nav" :in-sheet="inSheet" :shortcut="false" /></template>
      <template #header-start><span class="k:text-label k:font-semibold">Хаб Київ</span></template>
      <template #header-center><KSearchInput label="Пошук" placeholder="Пошук" class="k:w-full k:max-w-[28rem]" /></template>
      <template #header-end><KIconButton :icon="Bell" label="Сповіщення" /><KAvatar name="Ольга Ковальчук" size="sm" /></template>
      <KAppShellPageHeader title="Прийом" description="Посилки, які чекають на прийом у хабі." :breadcrumbs="[{ label: 'Операції', href: '#' }, { label: 'Прийом' }]" :set-document-title="false">
        <template #actions><KButton variant="primary">Прийняти</KButton></template>
      </KAppShellPageHeader>
      <p class="k:text-fg-muted">Вміст сторінки.</p>
    </KAppShell>`,
  }),
} satisfies Meta<typeof KAppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
