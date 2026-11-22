import { Printer, Truck, UserCheck } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KTimeline, { type TimelineItem } from './KTimeline.vue'

// Фіксовані дати, щоб знімки не змінювалися з часом (групи «Сьогодні» / «Вчора» —
// у застосунку, тут — конкретні дні).
const items: TimelineItem[] = [
  { id: 'f', title: 'Отримання', time: '2026-11-25T12:00:00', state: 'future' },
  {
    id: '4',
    title: 'Можна забирати',
    description: 'Відділення №12, Львів, вул. Городоцька, 10',
    time: '2026-11-24T09:12:00',
    state: 'current',
    tone: 'success',
  },
  { id: '3', title: 'Їде до Львова', description: 'Kite Hub Київ', time: '2026-11-23T18:40:00' },
  { id: '2', title: 'У сортувальному центрі Київ', time: '2026-11-23T08:05:00' },
  { id: '1', title: 'Прийнято', description: 'Відділення №3, Київ', time: '2026-11-22T16:30:00' },
]
const log: TimelineItem[] = [
  {
    id: 'a',
    title: 'Олена Т. переадресувала у Kite Box',
    time: '2026-11-24T10:05:00',
    icon: Truck,
    tone: 'info',
  },
  { id: 'b', title: 'Друк етикетки A6', time: '2026-11-24T09:40:00', icon: Printer },
  {
    id: 'c',
    title: 'Видано отримувачу',
    time: '2026-11-24T08:10:00',
    icon: UserCheck,
    tone: 'success',
  },
]
const meta = {
  title: 'Дані/KTimeline',
  component: KTimeline,
  args: { items, order: 'desc', groupByDay: true, collapsible: false, size: 'md', loading: false },
  argTypes: {
    order: { control: 'inline-radio', options: ['asc', 'desc'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  render: (args) => ({
    components: { KTimeline },
    setup: () => ({ args }),
    template: `<KTimeline v-bind="args" class="k:max-w-[36rem]" />`,
  }),
} satisfies Meta<typeof KTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Zhurnal: Story = {
  name: 'Журнал',
  args: { items: log, size: 'sm', groupByDay: false },
}
export const Zhornutyi: Story = { name: 'Згорнутий', args: { collapsible: 3 } }
export const Porozhnii: Story = { name: 'Порожній', args: { items: [] } }
