import { Ellipsis, Printer } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { h, type DefineComponent } from 'vue'

import { formatDate, formatMoney, formatNumber } from '../../lib/format'
import { shipments, type Shipment } from '../../stories/fixtures'
import KButton from '../button/KButton.vue'
import KDropdownMenu from '../dropdown-menu/KDropdownMenu.vue'
import KIconButton from '../icon-button/KIconButton.vue'
import KParcelStatus from '../parcel-status/KParcelStatus.vue'
import { PARCEL_STATUSES } from '../parcel-status/meta'
import KTrackingNumber from '../tracking-number/KTrackingNumber.vue'
import KDataTable from './KDataTable.vue'
import type { DataTableColumn } from './types'

const columns: DataTableColumn<Shipment>[] = [
  { id: 'number', header: 'Номер', sortable: true },
  { id: 'recipient', header: 'Отримувач', sortable: true },
  {
    id: 'city',
    header: 'Місто',
    sortable: true,
    hideable: true,
    filter: {
      type: 'select',
      multiple: true,
      options: ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Вінниця', 'Ужгород'].map((c) => ({
        value: c,
        label: c,
      })),
    },
  },
  {
    id: 'status',
    header: 'Статус',
    filter: {
      type: 'select',
      multiple: true,
      options: PARCEL_STATUSES.map((s) => ({ value: s, label: s })),
    },
    cell: ({ value }) =>
      h(KParcelStatus, { status: value as Shipment['status'], audience: 'staff', size: 'sm' }),
  },
  {
    id: 'weight',
    header: 'Вага, кг',
    numeric: true,
    sortable: true,
    hideable: true,
    cell: ({ value }) => formatNumber(value as number, { precision: 1 }),
  },
  {
    id: 'cod',
    header: 'Післяплата',
    numeric: true,
    sortable: true,
    hideable: true,
    defaultHidden: true,
    cell: ({ value }) => (value == null ? '—' : formatMoney(value as number)),
  },
  {
    id: 'created',
    header: 'Створено',
    sortable: true,
    hideable: true,
    filter: { type: 'dateRange' },
    cell: ({ value }) => formatDate(value as string, 'short'),
  },
]

// KDataTable узагальнений (generic Row) — Storybook його сигнатуру не виводить.
const Table = KDataTable as unknown as DefineComponent

const meta = {
  title: 'Дані/KDataTable',
  component: Table,
  args: {
    label: 'Відправлення',
    columns: columns as never,
    rows: shipments as never,
    selection: 'multiple',
    expandable: true,
    loading: false,
    error: null,
    pageSize: 10,
    rowLabel: ((r: Shipment) => r.number) as never,
  },
  argTypes: {
    selection: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    columns: { control: false },
    rows: { control: false },
  },
  parameters: { layout: 'padded' },
  render: (args) => ({
    components: { KDataTable: Table, KTrackingNumber, KButton, KDropdownMenu, KIconButton },
    setup: () => ({ args, Printer, Ellipsis }),
    template: `<KDataTable v-bind="args">
      <template #cell-number="{ value }"><KTrackingNumber :value="value" size="sm" :copyable="false" /></template>
      <template #bulk-actions="{ selected }"><KButton size="sm" :leading-icon="Printer">Друкувати етикетки</KButton></template>
      <template #row-actions="{ row }">
        <KDropdownMenu :items="[{ label: 'Друкувати етикетку' }, { label: 'Переадресувати' }]">
          <template #trigger><KIconButton :icon="Ellipsis" :label="'Дії для ' + row.number" size="sm" :tooltip="false" /></template>
        </KDropdownMenu>
      </template>
      <template #expanded="{ row }"><div class="k:text-body-sm k:text-fg-muted">{{ row.recipient }} · {{ row.city }}</div></template>
    </KDataTable>`,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<Record<string, unknown>>

export const Playground: Story = {}
export const VybirIFiltr: Story = {
  name: 'Вибір і фільтр',
  args: { selected: ['1', '2', '3'] as never, filters: { city: ['Київ', 'Львів'] } as never },
}
export const Zavantazhennia: Story = {
  name: 'Завантаження',
  args: { rows: [] as never, loading: true },
}
export const Pomylka: Story = {
  name: 'Помилка',
  args: { rows: [] as never, error: 'Сервер не відповідає' },
}
export const Porozhno: Story = { name: 'Порожньо', args: { rows: [] as never } }
