import type { ComputedRef, InjectionKey } from 'vue'

export interface TableContext {
  density: ComputedRef<'comfortable' | 'compact'>
  striped: ComputedRef<boolean>
  stickyHeader: ComputedRef<boolean>
  stickyFirstColumn: ComputedRef<boolean>
}

export const tableKey: InjectionKey<TableContext> = Symbol('kite-table')

export type CellAlign = 'start' | 'center' | 'end'
export const alignClass: Record<CellAlign, string> = {
  start: 'k:text-left',
  center: 'k:text-center',
  end: 'k:text-right',
}
