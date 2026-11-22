import type { Component, VNode } from 'vue'

import type { SelectOption } from '../select/KSelect.vue'

export type DataTableFilter =
  | { type: 'select'; options: SelectOption[]; multiple?: boolean }
  | { type: 'dateRange' }
  | { type: 'text' }

export interface DataTableColumn<Row> {
  id: string
  header: string
  accessor?: keyof Row | ((row: Row) => unknown)
  /** Вміст комірки; або слот cell-{id}. */
  cell?: (ctx: { row: Row; value: unknown }) => VNode | string
  align?: 'start' | 'end' | 'center'
  numeric?: boolean
  width?: string
  minWidth?: string
  sortable?: boolean
  /** З'являється в меню «Стовпці». */
  hideable?: boolean
  defaultHidden?: boolean
  filter?: DataTableFilter
}

export type SortingState = { id: string; desc: boolean }[]
export type Density = 'comfortable' | 'compact'

/** Значення фільтрів за id стовпця: string[] (select multiple), string, { start, end }. */
export type FiltersState = Record<string, unknown>

export type { Component }
