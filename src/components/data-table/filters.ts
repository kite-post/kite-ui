import { normalizeSearch } from '../../lib/intl'
import type { DataTableFilter } from './types'

/** Чи проходить значення комірки фільтр стовпця (client-режим). */
export function matchesFilter(value: unknown, filter: DataTableFilter, wanted: unknown): boolean {
  if (wanted === undefined || wanted === null || wanted === '') return true
  if (filter.type === 'select') {
    const list = Array.isArray(wanted) ? wanted : [wanted]
    return list.length === 0 || list.includes(String(value))
  }
  if (filter.type === 'text')
    return normalizeSearch(String(value ?? '')).includes(normalizeSearch(String(wanted)))
  if (filter.type === 'dateRange') {
    const { start, end } = wanted as { start?: string; end?: string }
    const day = String(value ?? '').slice(0, 10)
    if (!day) return false
    return (!start || day >= start) && (!end || day <= end)
  }
  return true
}

/** Чи фільтр щось обмежує (порожній масив / рядок — ні). */
export function isActive(wanted: unknown): boolean {
  if (wanted === undefined || wanted === null || wanted === '') return false
  if (Array.isArray(wanted)) return wanted.length > 0
  return true
}
