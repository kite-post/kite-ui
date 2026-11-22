<script setup lang="ts" generic="Row extends Record<string, any>">
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Columns3,
  X,
} from '@lucide/vue'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type Updater,
} from '@tanstack/vue-table'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { formatDate } from '../../lib/format'
import { normalizeSearch } from '../../lib/intl'
import KButton from '../button/KButton.vue'
import KCheckbox from '../checkbox/KCheckbox.vue'
import KCheckboxGroup from '../checkbox/KCheckboxGroup.vue'
import KDateRangePicker from '../date-range-picker/KDateRangePicker.vue'
import KDropdownMenu from '../dropdown-menu/KDropdownMenu.vue'
import type { MenuItem } from '../dropdown-menu/types'
import KEmptyState from '../empty-state/KEmptyState.vue'
import KIcon from '../icon/KIcon.vue'
import KInput from '../input/KInput.vue'
import KLink from '../link/KLink.vue'
import KPagination from '../pagination/KPagination.vue'
import KPopover from '../popover/KPopover.vue'
import KProgress from '../progress/KProgress.vue'
import KRadioGroup from '../radio-group/KRadioGroup.vue'
import KSearchInput from '../search-input/KSearchInput.vue'
import KSkeleton from '../skeleton/KSkeleton.vue'
import KTable from '../table/KTable.vue'
import KTableBody from '../table/KTableBody.vue'
import KTableCell from '../table/KTableCell.vue'
import KTableEmpty from '../table/KTableEmpty.vue'
import KTableHead from '../table/KTableHead.vue'
import KTableHeader from '../table/KTableHeader.vue'
import KTableRow from '../table/KTableRow.vue'
import { isActive, matchesFilter } from './filters'
import RenderNode from './RenderNode'
import type { DataTableColumn, Density, FiltersState, SortingState } from './types'

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn<Row>[]
    rows: Row[]
    /** Назва таблиці (aria-label). */
    label: string
    rowKey?: keyof Row | ((row: Row) => string)
    /** client — кіт сортує, фільтрує й гортає; server — лише віддає стан. */
    mode?: 'client' | 'server'
    /** Для server: усього записів. */
    total?: number
    selection?: 'none' | 'single' | 'multiple'
    /** Зберігати видимість стовпців і щільність у localStorage під цим ключем. */
    persistKey?: string
    loading?: boolean
    error?: string | null
    expandable?: boolean
    /** Рядок відкриває сторінку: посилання в першій змістовній комірці. */
    rowTo?: (row: Row) => string | Record<string, unknown>
    /** Підпис рядка для чекбокса й меню дій: «Обрати KT …». Типово — перша комірка. */
    rowLabel?: (row: Row) => string
    searchable?: boolean
    pageSizes?: number[] | false
  }>(),
  {
    rowKey: 'id' as never,
    mode: 'client',
    selection: 'none',
    loading: false,
    error: null,
    expandable: false,
    searchable: true,
    pageSizes: () => [10, 25, 50, 100],
  },
)

const sorting = defineModel<SortingState>('sorting', { default: () => [] })
const filters = defineModel<FiltersState>('filters', { default: () => ({}) })
const search = defineModel<string>('search', { default: '' })
const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 25 })
const selected = defineModel<string[] | 'all'>('selected', { default: () => [] })
const visibility = defineModel<Record<string, boolean>>('columnVisibility', { default: () => ({}) })
const density = defineModel<Density>('density', { default: 'comfortable' })

const emit = defineEmits<{ retry: []; 'row-click': [row: Row] }>()
const slots = defineSlots<
  Record<`cell-${string}`, (props: { row: Row; value: unknown }) => unknown> &
    Record<`header-${string}`, () => unknown> & {
      'toolbar-start'?(): unknown
      'toolbar-end'?(): unknown
      'bulk-actions'?(props: { selected: string[] | 'all'; clear: () => void }): unknown
      'row-actions'?(props: { row: Row }): unknown
      expanded?(props: { row: Row }): unknown
      empty?(): unknown
    }
>()

const { t, locale, announce } = useMessages()
const uid = useId()
const instance = getCurrentInstance()
const hasRowClick = computed(() => !!instance?.vnode.props?.onRowClick)

const keyOf = (row: Row): string =>
  typeof props.rowKey === 'function' ? props.rowKey(row) : String(row[props.rowKey as keyof Row])

// ——— Збереження налаштувань ———
onMounted(() => {
  // Стовпці, приховані типово.
  const hidden = Object.fromEntries(
    props.columns.filter((c) => c.defaultHidden).map((c) => [c.id, false] as const),
  )
  if (!Object.keys(visibility.value).length && Object.keys(hidden).length) visibility.value = hidden
  if (!props.persistKey) return
  try {
    const saved = JSON.parse(localStorage.getItem(props.persistKey) ?? 'null') as {
      columnVisibility?: Record<string, boolean>
      density?: Density
    } | null
    if (saved?.columnVisibility) visibility.value = saved.columnVisibility
    if (saved?.density) density.value = saved.density
  } catch {
    /* пошкоджений запис — ігноруємо */
  }
})
watch([visibility, density], () => {
  if (!props.persistKey) return
  try {
    localStorage.setItem(
      props.persistKey,
      JSON.stringify({ columnVisibility: visibility.value, density: density.value }),
    )
  } catch {
    /* приватний режим */
  }
})

// ——— TanStack ———
const server = computed(() => props.mode === 'server')
const resolve = <T,>(u: Updater<T>, old: T): T =>
  typeof u === 'function' ? (u as (o: T) => T)(old) : u

const columnFilters = computed(() =>
  Object.entries(filters.value)
    .filter(([, v]) => isActive(v))
    .map(([id, value]) => ({ id, value })),
)
const rowSelection = computed<Record<string, boolean>>(() =>
  selected.value === 'all'
    ? Object.fromEntries(props.rows.map((r) => [keyOf(r), true]))
    : Object.fromEntries(selected.value.map((id) => [id, true])),
)
const expanded = ref<Record<string, boolean>>({})

const defs = computed<ColumnDef<Row>[]>(() =>
  props.columns.map((c) => ({
    id: c.id,
    accessorFn:
      typeof c.accessor === 'function'
        ? c.accessor
        : (row: Row) => row[(c.accessor ?? c.id) as keyof Row],
    enableSorting: !!c.sortable,
    sortingFn: (a, b, id) => {
      const x = a.getValue(id)
      const y = b.getValue(id)
      if (typeof x === 'number' && typeof y === 'number') return x - y
      return String(x ?? '').localeCompare(String(y ?? ''), 'uk', { numeric: true })
    },
    filterFn: (row, id, wanted) =>
      c.filter ? matchesFilter(row.getValue(id), c.filter, wanted) : true,
  })),
)

const table = useVueTable<Row>({
  get data() {
    return props.rows
  },
  get columns() {
    return defs.value
  },
  getRowId: (row) => keyOf(row),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get globalFilter() {
      return search.value
    },
    get pagination() {
      return { pageIndex: page.value - 1, pageSize: pageSize.value }
    },
    get rowSelection() {
      return rowSelection.value
    },
    get columnVisibility() {
      return visibility.value
    },
    get expanded() {
      return expanded.value
    },
  },
  onSortingChange: (u) => (sorting.value = resolve(u, sorting.value)),
  onPaginationChange: (u) => {
    const next = resolve(u, { pageIndex: page.value - 1, pageSize: pageSize.value })
    page.value = next.pageIndex + 1
    pageSize.value = next.pageSize
  },
  onRowSelectionChange: (u) => {
    const next = resolve(u, rowSelection.value)
    selected.value = Object.keys(next).filter((k) => next[k])
  },
  onColumnVisibilityChange: (u) => (visibility.value = resolve(u, visibility.value)),
  onExpandedChange: (u) => (expanded.value = resolve(u, expanded.value) as Record<string, boolean>),
  getColumnCanGlobalFilter: () => true,
  globalFilterFn: (row, id, q) =>
    normalizeSearch(String(row.getValue(id) ?? '')).includes(normalizeSearch(String(q))),
  enableRowSelection: () => props.selection !== 'none',
  enableMultiRowSelection: () => props.selection === 'multiple',
  enableSortingRemoval: true,
  // Порядок однаковий для всіх стовпців: ↑ → ↓ → без сортування (TanStack для чисел починає з ↓).
  sortDescFirst: false,
  autoResetPageIndex: false,
  get manualSorting() {
    return server.value
  },
  get manualFiltering() {
    return server.value
  },
  get manualPagination() {
    return server.value
  },
  get rowCount() {
    return server.value ? (props.total ?? props.rows.length) : undefined
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})

const pageRows = computed(() => table.getRowModel().rows)
const filteredCount = computed(() =>
  server.value ? (props.total ?? props.rows.length) : table.getFilteredRowModel().rows.length,
)
const visibleColumns = computed(() => props.columns.filter((c) => visibility.value[c.id] !== false))
const colCount = computed(
  () =>
    visibleColumns.value.length +
    (props.selection !== 'none' ? 1 : 0) +
    (props.expandable ? 1 : 0) +
    (hasRowActions.value ? 1 : 0),
)
const hasRowActions = computed(() => !!slots['row-actions'])

// Новий фільтр чи пошук — на першу сторінку.
watch([filters, search], () => (page.value = 1), { deep: true })

// ——— Вибір ———
const selectedIds = computed(() => (selected.value === 'all' ? [] : selected.value))
const selectedCount = computed(() =>
  selected.value === 'all' ? filteredCount.value : selected.value.length,
)
const visibleIds = computed(
  () =>
    new Set(
      (server.value ? props.rows : table.getFilteredRowModel().rows.map((r) => r.original)).map(
        keyOf,
      ),
    ),
)
const hiddenSelected = computed(
  () => selectedIds.value.filter((id) => !visibleIds.value.has(id)).length,
)
const pageIds = computed(() => pageRows.value.map((r) => r.id))
const pageState = computed<boolean | 'indeterminate'>(() => {
  if (selected.value === 'all') return true
  const set = new Set(selectedIds.value)
  const n = pageIds.value.filter((id) => set.has(id)).length
  return n === 0 ? false : n === pageIds.value.length ? true : 'indeterminate'
})
function setPage(checked: boolean | 'indeterminate') {
  const set = new Set(selectedIds.value)
  for (const id of pageIds.value) {
    if (checked === true) set.add(id)
    else set.delete(id)
  }
  selected.value = [...set]
}
function clearSelection() {
  selected.value = []
}

let lastIndex: number | null = null
let shift = false
// Shift запам'ятовуємо до того, як чекбокс змінить значення (клік чи Space).
function rememberShift(event: MouseEvent | KeyboardEvent) {
  shift = event.shiftKey
}
function toggleRow(index: number, id: string, checked: boolean | 'indeterminate') {
  const on = checked === true
  if (props.selection === 'single') {
    selected.value = on ? [id] : []
    return
  }
  const set = new Set(selectedIds.value)
  // Shift + клік — діапазон від попереднього обраного рядка.
  if (shift && lastIndex !== null) {
    const [a, b] = [Math.min(lastIndex, index), Math.max(lastIndex, index)]
    for (const rid of pageIds.value.slice(a, b + 1)) {
      if (on) set.add(rid)
      else set.delete(rid)
    }
  } else if (on) set.add(id)
  else set.delete(id)
  lastIndex = index
  selected.value = [...set]
}
watch(selectedCount, (n) => announce(n ? t('table.selected', { n }) : t('table.clearSelection')))

// ——— Фільтри ———
const filterColumns = computed(() => props.columns.filter((c) => c.filter))
function setFilter(id: string, value: unknown) {
  const next = { ...filters.value }
  if (isActive(value)) next[id] = value
  else delete next[id]
  filters.value = next
}
function filterText(col: DataTableColumn<Row>): string {
  const v = filters.value[col.id]
  const f = col.filter
  if (!f || !isActive(v)) return ''
  if (f.type === 'select') {
    const list = Array.isArray(v) ? v : [v]
    return list.map((x) => f.options.find((o) => o.value === x)?.label ?? String(x)).join(', ')
  }
  if (f.type === 'dateRange') {
    const r = v as { start: string; end: string }
    return `${formatDate(r.start, 'short', locale.value)}–${formatDate(r.end, 'short', locale.value)}`
  }
  return String(v)
}
const activeFilters = computed(() =>
  filterColumns.value
    .filter((c) => isActive(filters.value[c.id]))
    .map((c) => ({ id: c.id, label: `${c.header}: ${filterText(c)}` })),
)
const filtered = computed(() => activeFilters.value.length > 0 || !!search.value)
function resetFilters() {
  filters.value = {}
  search.value = ''
}

// Кількість після пошуку чи фільтра — у live-регіон.
let resultsTimer: ReturnType<typeof setTimeout> | undefined
watch(filteredCount, (n) => {
  if (!filtered.value) return
  clearTimeout(resultsTimer)
  resultsTimer = setTimeout(() => announce(t('table.results', { n })), 500)
})
onBeforeUnmount(() => clearTimeout(resultsTimer))

// ——— Меню «Стовпці» ———
const columnsMenu = computed<MenuItem[]>(() => [
  { type: 'label', label: t('table.columns') },
  ...props.columns
    .filter((c) => c.hideable)
    .map((c): MenuItem => ({
      type: 'checkbox',
      label: c.header,
      checked: visibility.value[c.id] !== false,
      onUpdate: (v: boolean) => (visibility.value = { ...visibility.value, [c.id]: v }),
    })),
  { type: 'separator' },
  { type: 'label', label: t('table.density') },
  {
    type: 'radio',
    value: density.value,
    onUpdate: (v: string) => (density.value = v as Density),
    options: [
      { value: 'comfortable', label: t('table.density.comfortable') },
      { value: 'compact', label: t('table.density.compact') },
    ],
  },
])

// ——— Клавіатура в таблиці ———
function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (
    /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) &&
    target.getAttribute('type') !== 'checkbox'
  )
    return
  if (
    props.selection === 'multiple' &&
    (event.metaKey || event.ctrlKey) &&
    event.key.toLowerCase() === 'a'
  ) {
    event.preventDefault()
    setPage(true)
  } else if (event.key === 'Escape' && selectedCount.value) {
    clearSelection()
  }
}

// ——— Комірки ———
const firstColumnId = computed(() => visibleColumns.value[0]?.id)
const rowLabelOf = (row: Row) =>
  props.rowLabel?.(row) ??
  String(firstColumnId.value ? (table.getRow(keyOf(row))?.getValue(firstColumnId.value) ?? '') : '')

function onRowClick(event: MouseEvent, row: Row) {
  if (!hasRowClick.value || props.rowTo) return
  if ((event.target as HTMLElement).closest('a,button,input,label,[role="menu"]')) return
  emit('row-click', row)
}

const sortIcon = (dir: false | 'asc' | 'desc') =>
  dir === 'asc' ? ArrowUp : dir === 'desc' ? ArrowDown : ArrowUpDown
const ariaSort = (dir: false | 'asc' | 'desc') =>
  dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'
// Посилання рядка розтягується на весь рядок (як у KCard), не ламаючи виділення тексту.
const stretched = "k:after:absolute k:after:inset-0 k:after:content-['']"

const firstLoad = computed(() => props.loading && !props.rows.length)
</script>

<template>
  <div
    class="kite-data-table k:grid k:min-w-0 k:gap-3"
    :aria-busy="loading ? 'true' : undefined"
    @keydown="onKeydown"
  >
    <!-- Панель масових дій замінює тулбар, коли щось обрано. -->
    <div
      v-if="selection === 'multiple' && selectedCount > 0"
      class="k:flex k:min-h-10 k:flex-wrap k:items-center k:gap-2 k:rounded-md k:bg-selection-bg k:px-3 k:py-1.5"
    >
      <span class="k:text-label k:text-fg">
        {{
          selected === 'all'
            ? t('table.allSelected', { total: filteredCount })
            : t('table.selected', { n: selectedCount })
        }}
      </span>
      <span v-if="hiddenSelected" class="k:text-caption k:text-fg-muted">
        · {{ t('table.selectedHidden', { n: hiddenSelected }) }}
      </span>
      <div class="k:flex k:flex-wrap k:items-center k:gap-2">
        <slot name="bulk-actions" :selected="selected" :clear="clearSelection" />
      </div>
      <KButton
        v-if="selected !== 'all' && pageState === true && filteredCount > pageIds.length"
        variant="link"
        size="sm"
        @click="selected = 'all'"
      >
        {{ t('table.selectAll', { total: filteredCount }) }}
      </KButton>
      <KButton variant="ghost" size="sm" class="k:ml-auto" @click="clearSelection">
        {{ t('table.clearSelection') }}
      </KButton>
    </div>

    <template v-else>
      <div class="k:flex k:flex-wrap k:items-center k:gap-2">
        <KSearchInput
          v-if="searchable"
          v-model="search"
          :label="t('table.search')"
          :placeholder="t('table.search')"
          variant="filled"
          size="sm"
          :debounce="server ? 300 : 0"
          class="k:w-full k:sm:w-64"
        />
        <KPopover v-for="col in filterColumns" :key="col.id" :title="col.header" align="start">
          <template #trigger>
            <KButton size="sm" :trailing-icon="ChevronDown">{{ col.header }}</KButton>
          </template>
          <KCheckboxGroup
            v-if="col.filter?.type === 'select' && col.filter.multiple"
            :label="col.header"
            :options="col.filter.options"
            :model-value="(filters[col.id] as string[] | undefined) ?? []"
            size="sm"
            class="k:[&>legend]:sr-only"
            @update:model-value="setFilter(col.id, $event)"
          />
          <KRadioGroup
            v-else-if="col.filter?.type === 'select'"
            :label="col.header"
            :options="col.filter.options"
            :model-value="(filters[col.id] as string | undefined) ?? null"
            size="sm"
            class="k:[&>legend]:sr-only"
            @update:model-value="setFilter(col.id, $event)"
          />
          <KDateRangePicker
            v-else-if="col.filter?.type === 'dateRange'"
            :model-value="(filters[col.id] as { start: string; end: string } | undefined) ?? null"
            size="sm"
            :aria-label="col.header"
            @update:model-value="setFilter(col.id, $event)"
          />
          <KInput
            v-else
            :model-value="(filters[col.id] as string | undefined) ?? ''"
            size="sm"
            :aria-label="col.header"
            clearable
            @update:model-value="setFilter(col.id, $event)"
          />
        </KPopover>
        <slot name="toolbar-start" />
        <div class="k:ml-auto k:flex k:items-center k:gap-2">
          <slot name="toolbar-end" />
          <KDropdownMenu :items="columnsMenu" size="sm">
            <template #trigger>
              <KButton size="sm" :leading-icon="Columns3">{{ t('table.columns') }}</KButton>
            </template>
          </KDropdownMenu>
        </div>
      </div>
      <div v-if="activeFilters.length" class="k:flex k:flex-wrap k:items-center k:gap-2">
        <button
          v-for="f in activeFilters"
          :key="f.id"
          type="button"
          :aria-label="t('table.removeFilter', { label: f.label })"
          class="k:inline-flex k:h-7 k:cursor-pointer k:items-center k:gap-1 k:rounded-full k:border k:border-line-strong k:bg-surface k:pr-1.5 k:pl-2.5 k:text-caption k:font-medium k:text-fg k:hover:bg-surface-hover"
          @click="setFilter(f.id, undefined)"
        >
          {{ f.label }}<KIcon :icon="X" size="xs" />
        </button>
        <KButton variant="link" size="sm" @click="resetFilters">{{
          t('table.resetFilters')
        }}</KButton>
      </div>
    </template>

    <div class="k:relative">
      <KProgress
        v-if="loading && rows.length"
        :value="null"
        size="sm"
        :label="t('spinner.label')"
        hide-label
        class="k:absolute k:inset-x-0 k:top-0 k:z-[4]"
      />
      <KTable
        :label="label"
        :density="density"
        :row-count="server ? filteredCount : undefined"
        sticky-header
      >
        <KTableHeader>
          <tr>
            <KTableHead v-if="expandable" width="2.5rem"
              ><span class="k:sr-only">{{ t('table.expand') }}</span></KTableHead
            >
            <KTableHead v-if="selection !== 'none'" width="2.75rem">
              <KCheckbox
                v-if="selection === 'multiple'"
                :model-value="pageState"
                size="sm"
                :disabled="!pageIds.length"
                @update:model-value="setPage"
              >
                <span class="k:sr-only">{{ t('table.selectAllPage') }}</span>
              </KCheckbox>
            </KTableHead>
            <KTableHead
              v-for="col in visibleColumns"
              :key="col.id"
              :align="col.align"
              :numeric="col.numeric"
              :width="col.width"
              :style="col.minWidth ? { minWidth: col.minWidth } : undefined"
              :aria-sort="
                col.sortable ? ariaSort(table.getColumn(col.id)?.getIsSorted() ?? false) : undefined
              "
            >
              <button
                v-if="col.sortable"
                type="button"
                :class="
                  cn(
                    'k:group/sort k:-mx-1 k:inline-flex k:cursor-pointer k:items-center k:gap-1 k:rounded-xs k:border-0 k:bg-transparent k:px-1 k:font-[inherit] k:text-[length:inherit] k:text-inherit k:hover:text-fg',
                    col.numeric && 'k:flex-row-reverse',
                  )
                "
                @click="table.getColumn(col.id)?.toggleSorting(undefined, false)"
              >
                <slot :name="`header-${col.id}`">{{ col.header }}</slot>
                <KIcon
                  :icon="sortIcon(table.getColumn(col.id)?.getIsSorted() ?? false)"
                  size="xs"
                  :class="
                    cn(
                      !table.getColumn(col.id)?.getIsSorted() &&
                        'k:opacity-0 k:group-hover/sort:opacity-100 k:group-focus-visible/sort:opacity-100',
                    )
                  "
                />
              </button>
              <slot v-else :name="`header-${col.id}`">{{ col.header }}</slot>
            </KTableHead>
            <KTableHead v-if="hasRowActions" width="3rem"
              ><span class="k:sr-only">{{ t('menu.moreActions') }}</span></KTableHead
            >
          </tr>
        </KTableHeader>
        <KTableBody>
          <template v-if="firstLoad">
            <tr v-for="i in 8" :key="i">
              <KTableCell v-for="c in colCount" :key="c"
                ><KSkeleton class="k:h-4 k:w-3/4"
              /></KTableCell>
            </tr>
          </template>
          <KTableEmpty v-else-if="error" :colspan="colCount">
            <KEmptyState
              kind="error"
              size="sm"
              :description="error"
              :retrying="loading"
              @retry="emit('retry')"
            />
          </KTableEmpty>
          <KTableEmpty v-else-if="!pageRows.length" :colspan="colCount">
            <slot name="empty">
              <KEmptyState v-if="filtered" kind="no-results" size="sm" @reset="resetFilters" />
              <KEmptyState v-else kind="initial" size="sm" />
            </slot>
          </KTableEmpty>
          <template v-for="(r, ri) in pageRows" v-else :key="r.id">
            <KTableRow
              :selected="r.getIsSelected()"
              :interactive="!!rowTo || hasRowClick"
              @click="onRowClick($event, r.original)"
            >
              <KTableCell v-if="expandable">
                <button
                  type="button"
                  :aria-expanded="r.getIsExpanded()"
                  :aria-label="`${t('table.expand')}: ${rowLabelOf(r.original)}`"
                  class="k:relative k:z-[1] k:grid k:size-7 k:cursor-pointer k:place-items-center k:rounded-full k:border-0 k:bg-transparent k:text-fg-muted k:hover:bg-surface-hover"
                  @click="r.toggleExpanded()"
                >
                  <KIcon
                    :icon="ChevronRight"
                    size="sm"
                    :class="cn('k:transition-transform', r.getIsExpanded() && 'k:rotate-90')"
                  />
                </button>
              </KTableCell>
              <KTableCell
                v-if="selection !== 'none'"
                @pointerdown.capture="rememberShift"
                @keydown.capture="rememberShift"
              >
                <KCheckbox
                  :model-value="r.getIsSelected()"
                  size="sm"
                  class="k:relative k:z-[1]"
                  @update:model-value="toggleRow(ri, r.id, $event)"
                >
                  <span class="k:sr-only">{{
                    t('table.selectRow', { label: rowLabelOf(r.original) })
                  }}</span>
                </KCheckbox>
              </KTableCell>
              <KTableCell
                v-for="col in visibleColumns"
                :key="col.id"
                :align="col.align"
                :numeric="col.numeric"
              >
                <KLink
                  v-if="rowTo && col.id === firstColumnId"
                  :to="rowTo(r.original)"
                  variant="standalone"
                  size="sm"
                  :class="stretched"
                >
                  <slot :name="`cell-${col.id}`" :row="r.original" :value="r.getValue(col.id)">
                    <RenderNode
                      v-if="col.cell"
                      :node="col.cell({ row: r.original, value: r.getValue(col.id) })"
                    />
                    <template v-else>{{ r.getValue(col.id) ?? '—' }}</template>
                  </slot>
                </KLink>
                <slot v-else :name="`cell-${col.id}`" :row="r.original" :value="r.getValue(col.id)">
                  <RenderNode
                    v-if="col.cell"
                    :node="col.cell({ row: r.original, value: r.getValue(col.id) })"
                  />
                  <template
                    v-else-if="
                      r.getValue(col.id) === null ||
                      r.getValue(col.id) === undefined ||
                      r.getValue(col.id) === ''
                    "
                  >
                    <span class="k:text-fg-muted">—</span>
                  </template>
                  <template v-else>{{ r.getValue(col.id) }}</template>
                </slot>
              </KTableCell>
              <KTableCell v-if="hasRowActions" align="end">
                <span class="k:relative k:z-[1] k:inline-flex">
                  <slot name="row-actions" :row="r.original" />
                </span>
              </KTableCell>
            </KTableRow>
            <tr v-if="expandable && r.getIsExpanded()" :id="`${uid}-x-${r.id}`">
              <td :colspan="colCount" class="k:border-b k:border-line k:bg-bg-subtle k:px-4 k:py-3">
                <slot name="expanded" :row="r.original" />
              </td>
            </tr>
          </template>
        </KTableBody>
      </KTable>
    </div>

    <KPagination
      v-if="filteredCount > Math.min(...(pageSizes || [pageSize])) || page > 1"
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="filteredCount"
      :page-sizes="pageSizes"
      size="sm"
    />
  </div>
</template>
