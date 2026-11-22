import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { formatMoney } from '../../lib/format'
import KTable from './KTable.vue'
import KTableBody from './KTableBody.vue'
import KTableCell from './KTableCell.vue'
import KTableEmpty from './KTableEmpty.vue'
import KTableFooter from './KTableFooter.vue'
import KTableHead from './KTableHead.vue'
import KTableHeader from './KTableHeader.vue'
import KTableRow from './KTableRow.vue'

const rows = [
  ['до 2 кг', 6500, 5500, 12000],
  ['до 10 кг', 8000, 7000, 14000],
  ['до 30 кг', 14000, null, 22000],
] as const
const meta = {
  title: 'Дані/KTable',
  component: KTable,
  subcomponents: {
    KTableHeader,
    KTableBody,
    KTableFooter,
    KTableRow,
    KTableHead,
    KTableCell,
    KTableEmpty,
  },
  args: {
    caption: 'Тарифи за вагою',
    density: 'comfortable',
    striped: false,
    bordered: true,
    stickyHeader: false,
  },
  argTypes: { density: { control: 'inline-radio', options: ['comfortable', 'compact'] } },
  render: (args) => ({
    components: {
      KTable,
      KTableHeader,
      KTableBody,
      KTableFooter,
      KTableRow,
      KTableHead,
      KTableCell,
    },
    setup: () => ({ args, rows, formatMoney }),
    template: `<KTable v-bind="args">
      <KTableHeader><tr><KTableHead>Вага</KTableHead><KTableHead numeric>До відділення</KTableHead><KTableHead numeric>Kite Box</KTableHead><KTableHead numeric>Кур’єр</KTableHead></tr></KTableHeader>
      <KTableBody>
        <KTableRow v-for="(r, i) in rows" :key="i" :selected="i === 1">
          <KTableCell row-header>{{ r[0] }}</KTableCell>
          <KTableCell numeric>{{ formatMoney(r[1]) }}</KTableCell>
          <KTableCell numeric>{{ r[2] ? formatMoney(r[2]) : '—' }}</KTableCell>
          <KTableCell numeric>{{ formatMoney(r[3]) }}</KTableCell>
        </KTableRow>
      </KTableBody>
      <KTableFooter><tr><KTableCell>Страхування</KTableCell><KTableCell numeric colspan="3">0,5 % від оголошеної вартості</KTableCell></tr></KTableFooter>
    </KTable>`,
  }),
} satisfies Meta<typeof KTable>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const ZiSmuhamy: Story = { name: 'Зі смугами', args: { striped: true, density: 'compact' } }
