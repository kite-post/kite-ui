<script setup lang="ts">
import { Printer, Truck, UserCheck } from '@lucide/vue'
import { h, ref } from 'vue'

import {
  formatDate,
  formatDimensions,
  formatMoney,
  formatNumber,
  formatPhone,
  formatRelative,
  KButton,
  KCard,
  KCardContent,
  KCardHeader,
  KDataTable,
  KDropdownMenu,
  KField,
  KIconButton,
  KParcelStatus,
  KPhoneInput,
  KTable,
  KTableBody,
  KTableCell,
  KTableFooter,
  KTableHead,
  KTableHeader,
  KTableRow,
  KTimeline,
  KTrackingNumber,
  KTrackingNumberInput,
  PARCEL_STATUSES,
  plural,
  type DataTableColumn,
  type TimelineItem,
} from '../src'
import { shipments, type Shipment } from './data'
import { Ellipsis } from '@lucide/vue'

const phone = ref<string | null>('+380671234567')
const phoneState = ref('')
const tracking = ref<string | null>(null)
const trackingState = ref('')

const now = Date.now()
const ago = (min: number) => new Date(now - min * 60_000).toISOString()
const events: TimelineItem[] = [
  { id: 'f', title: 'Отримання', time: new Date(now + 86_400_000).toISOString(), state: 'future' },
  {
    id: '4',
    title: 'Можна забирати',
    description: 'Відділення №12, Львів, вул. Городоцька, 10',
    time: ago(35),
    state: 'current',
    tone: 'success',
  },
  { id: '3', title: 'Їде до Львова', description: 'Kite Hub Київ', time: ago(60 * 9) },
  { id: '2', title: 'У сортувальному центрі Київ', time: ago(60 * 26) },
  { id: '1', title: 'Прийнято', description: 'Відділення №3, Київ', time: ago(60 * 30) },
  { id: '0', title: 'Накладну створено', time: ago(60 * 50) },
]
const log: TimelineItem[] = [
  { id: 'a', title: 'Олена Т. переадресувала у Kite Box', time: ago(5), icon: Truck, tone: 'info' },
  { id: 'b', title: 'Друк етикетки A6', time: ago(40), icon: Printer },
  { id: 'c', title: 'Видано отримувачу', time: ago(120), icon: UserCheck, tone: 'success' },
]

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
const selected = ref<string[] | 'all'>([])
const loading = ref(false)
const error = ref<string | null>(null)
const rows = ref(shipments)
function reload() {
  loading.value = true
  error.value = null
  setTimeout(() => (loading.value = false), 900)
}
</script>

<template>
  <h2 class="k:m-0 k:font-display k:text-h2">Хвиля 6</h2>

  <KCard>
    <KCardHeader title="Форматери" />
    <KCardContent>
      <ul class="kite-num k:m-0 k:grid k:gap-1 k:pl-5 k:text-body-sm">
        <li>{{ formatMoney(125000) }} · {{ formatMoney(8750) }} · {{ formatMoney(-8750) }}</li>
        <li>
          {{ formatNumber(2.4, { unit: 'kg', precision: 1 }) }} · {{ formatDimensions(40, 30, 20) }}
        </li>
        <li>
          {{ formatDate('2026-11-24') }} · {{ formatDate('2025-03-08') }} ·
          {{ formatDate('2026-11-24', 'short') }}
        </li>
        <li>{{ formatRelative(ago(5)) }} · {{ formatRelative(ago(60 * 26)) }}</li>
        <li>
          {{ formatPhone('+380671234567') }} · 3
          {{ plural(3, { one: 'посилка', few: 'посилки', many: 'посилок' }) }} · 11
          {{ plural(11, { one: 'посилка', few: 'посилки', many: 'посилок' }) }}
        </li>
      </ul>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="PhoneInput, TrackingNumberInput, TrackingNumber" />
    <KCardContent class="k:grid k:gap-4 k:sm:grid-cols-2">
      <KField label="Телефон отримувача" :hint="`v-model: ${phone} · ${phoneState}`">
        <KPhoneInput v-model="phone" clearable @validity="phoneState = $event" />
      </KField>
      <KField label="Номер відправлення" :hint="`v-model: ${tracking} · ${trackingState}`">
        <KTrackingNumberInput
          v-model="tracking"
          scan
          clearable
          @validity="trackingState = $event"
        />
      </KField>
      <div class="k:grid k:gap-2 k:sm:col-span-2">
        <KTrackingNumber value="KT123456785UA" size="sm" />
        <KTrackingNumber value="KT123456785UA" emphasis />
        <KTrackingNumber value="KT123456785UA" size="lg" href="#parcel" />
      </div>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="ParcelStatus" />
    <KCardContent class="k:grid k:gap-4">
      <div class="k:flex k:flex-wrap k:gap-2">
        <KParcelStatus
          v-for="s in PARCEL_STATUSES"
          :key="s"
          :status="s"
          :params="{ city: 'Львова', date: '2026-11-28' }"
        />
        <KParcelStatus status="READY_FOR_PICKUP" partial />
        <KParcelStatus status="IN_TRANSIT" audience="staff" :params="{ city: 'Львів' }" size="sm" />
        <KParcelStatus status="IN_TRANSIT" />
      </div>
      <div class="k:grid k:gap-4 k:sm:grid-cols-2">
        <KParcelStatus
          status="READY_FOR_PICKUP"
          variant="detailed"
          detail="Відділення №12, Львів · до 28 листопада"
        />
        <KParcelStatus
          status="LOST"
          variant="detailed"
          detail="Диспетчер уже шукає, напишемо до кінця дня"
        />
      </div>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="Timeline" />
    <KCardContent class="k:grid k:gap-8 k:md:grid-cols-2">
      <KTimeline :items="events" :collapsible="4" />
      <div class="k:grid k:content-start k:gap-6">
        <KTimeline :items="log" size="sm" :group-by-day="false" />
        <KTimeline :items="[]" />
        <KTimeline :items="[]" loading />
      </div>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="Table" />
    <KCardContent>
      <KTable caption="Тарифи за вагою" striped>
        <KTableHeader>
          <tr>
            <KTableHead>Вага</KTableHead>
            <KTableHead numeric>До відділення</KTableHead>
            <KTableHead numeric>Kite Box</KTableHead>
            <KTableHead numeric>Кур’єр</KTableHead>
          </tr>
        </KTableHeader>
        <KTableBody>
          <KTableRow
            v-for="(r, i) in [
              ['до 2 кг', 6500, 5500, 12000],
              ['до 10 кг', 8000, 7000, 14000],
              ['до 30 кг', 14000, null, 22000],
            ]"
            :key="i"
          >
            <KTableCell row-header>{{ r[0] }}</KTableCell>
            <KTableCell numeric>{{ formatMoney(r[1] as number) }}</KTableCell>
            <KTableCell numeric>{{ r[2] ? formatMoney(r[2] as number) : '—' }}</KTableCell>
            <KTableCell numeric>{{ formatMoney(r[3] as number) }}</KTableCell>
          </KTableRow>
        </KTableBody>
        <KTableFooter>
          <tr>
            <KTableCell>Страхування</KTableCell>
            <KTableCell numeric colspan="3">0,5 % від оголошеної вартості</KTableCell>
          </tr>
        </KTableFooter>
      </KTable>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="DataTable" />
    <KCardContent class="k:grid k:gap-3">
      <div class="k:flex k:gap-2">
        <KButton size="sm" @click="reload">Оновити (loading)</KButton>
        <KButton size="sm" @click="error = error ? null : 'Сервер не відповідає'">Помилка</KButton>
        <KButton size="sm" @click="rows = rows.length ? [] : shipments">Порожньо / дані</KButton>
      </div>
      <KDataTable
        v-model:selected="selected"
        label="Відправлення"
        :columns="columns"
        :rows="rows"
        selection="multiple"
        expandable
        :loading="loading"
        :error="error"
        persist-key="playground-shipments"
        :row-label="(r) => r.number"
        @retry="reload"
      >
        <template #cell-number="{ value }">
          <KTrackingNumber :value="value as string" size="sm" :copyable="false" />
        </template>
        <template #bulk-actions="{ selected: sel }">
          <KButton size="sm" :leading-icon="Printer"
            >Друкувати етикетки ({{ sel === 'all' ? 'усі' : sel.length }})</KButton
          >
        </template>
        <template #row-actions="{ row }">
          <KDropdownMenu
            :items="[
              { label: 'Друкувати етикетку' },
              { label: 'Переадресувати' },
              { type: 'separator' },
              { label: 'Скасувати', danger: true },
            ]"
          >
            <template #trigger>
              <KIconButton
                :icon="Ellipsis"
                :label="`Дії для ${row.number}`"
                size="sm"
                :tooltip="false"
              />
            </template>
          </KDropdownMenu>
        </template>
        <template #expanded="{ row }">
          <div class="k:text-body-sm k:text-fg-muted">
            {{ row.recipient }} · {{ row.city }} · створено {{ formatRelative(row.created) }}
          </div>
        </template>
      </KDataTable>
    </KCardContent>
  </KCard>
</template>
