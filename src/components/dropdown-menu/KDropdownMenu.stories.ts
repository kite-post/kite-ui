import { Ellipsis, ExternalLink, Printer, Route, Trash2 } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KIconButton from '../icon-button/KIconButton.vue'
import KDropdownMenu from './KDropdownMenu.vue'
import type { MenuItem } from './types'

const items: MenuItem[] = [
  { label: 'Відкрити', icon: ExternalLink },
  { label: 'Друкувати етикетку', icon: Printer, shortcut: ['mod', 'p'] },
  {
    type: 'sub',
    label: 'Переадресувати',
    icon: Route,
    items: [{ label: 'У відділення' }, { label: 'У Kite Box' }],
  },
  { type: 'checkbox', label: 'Показувати габарити', checked: true, onUpdate: () => {} },
  { type: 'separator' },
  { label: 'Скасувати накладну', icon: Trash2, danger: true },
]
const meta = {
  title: 'Оверлеї/KDropdownMenu',
  component: KDropdownMenu,
  args: { items, open: true, align: 'start', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] }, items: { control: false } },
  render: (args) => ({
    components: { KDropdownMenu, KIconButton },
    setup: () => ({ args, Ellipsis }),
    template: `<div class="k:min-h-80"><KDropdownMenu v-bind="args"><template #trigger><KIconButton :icon="Ellipsis" label="Ще дії" :tooltip="false" /></template></KDropdownMenu></div>`,
  }),
} satisfies Meta<typeof KDropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Vidkryte: Story = { name: 'Відкрите' }
