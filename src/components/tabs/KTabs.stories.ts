import { Inbox, Package, Truck } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KTab from './KTab.vue'
import KTabs from './KTabs.vue'
import KTabsList from './KTabsList.vue'
import KTabsPanel from './KTabsPanel.vue'

const meta = {
  title: 'Навігація/KTabs',
  component: KTabs,
  subcomponents: { KTabsList, KTab, KTabsPanel },
  args: {
    defaultValue: 'incoming',
    variant: 'line',
    size: 'md',
    activation: 'automatic',
    label: 'Відправлення',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'pills'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    activation: { control: 'inline-radio', options: ['automatic', 'manual'] },
  },
  render: (args) => ({
    components: { KTabs, KTabsList, KTab, KTabsPanel },
    setup: () => ({ args, Inbox, Truck, Package }),
    template: `<KTabs v-bind="args">
      <KTabsList>
        <KTab value="all">Усі</KTab>
        <KTab value="incoming" :icon="Inbox" :count="12">Вхідні</KTab>
        <KTab value="outgoing" :icon="Truck" :count="3">Вихідні</KTab>
        <KTab value="archive" :icon="Package">Архів</KTab>
        <KTab value="off" disabled>Недоступно</KTab>
      </KTabsList>
      <KTabsPanel value="all">Усі відправлення</KTabsPanel>
      <KTabsPanel value="incoming">12 вхідних відправлень</KTabsPanel>
      <KTabsPanel value="outgoing">3 вихідні</KTabsPanel>
      <KTabsPanel value="archive">Архів</KTabsPanel>
    </KTabs>`,
  }),
} satisfies Meta<typeof KTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Tabletky: Story = { name: 'Таблетки', args: { variant: 'pills', size: 'sm' } }
export const Marshrutni: Story = {
  name: 'Маршрутні',
  render: () => ({
    components: { KTabs, KTabsList, KTab },
    template: `<KTabs routing label="Розділи організації"><KTabsList>
      <KTab value="p" href="#profile" active>Профіль</KTab><KTab value="u" href="#users">Користувачі</KTab><KTab value="b" href="#billing">Оплата</KTab>
    </KTabsList></KTabs>`,
  }),
}
