import { cn } from '../../lib/cn'

// Спільні класи календаря для KDatePicker і KDateRangePicker (специфікація date-picker.md).
export const calendarContent = cn(
  'kite-calendar kite-pop k:z-[1000] k:flex k:max-w-[calc(100vw-1rem)] k:gap-4 k:rounded-md k:border k:border-raised-border k:bg-surface-raised k:p-3 k:text-fg k:shadow-lg',
  'k:[--kite-calendar-cell-size:2.5rem]',
)

export const calendarHeader = 'k:flex k:items-center k:justify-between k:gap-2 k:pb-2'
export const calendarHeading = 'k:text-body-strong k:first-letter:uppercase'
export const navButton = cn(
  'k:grid k:size-8 k:cursor-pointer k:place-items-center k:rounded-full k:border-0 k:bg-transparent k:text-fg',
  'k:hover:bg-surface-hover k:disabled:cursor-not-allowed k:disabled:text-fg-disabled k:disabled:hover:bg-transparent',
)
export const gridClass = 'k:border-collapse k:select-none'
export const headCell =
  'k:size-(--kite-calendar-cell-size) k:p-0 k:text-caption k:font-medium k:text-fg-muted k:capitalize'

export const dayCell = cn(
  'kite-day k:relative k:grid k:size-(--kite-calendar-cell-size) k:cursor-pointer k:place-items-center k:rounded-full k:text-body-sm k:text-fg k:tabular-nums k:outline-none',
  'k:hover:bg-surface-hover k:focus-visible:shadow-[0_0_0_2px_var(--kite-color-focus-ring)]',
  'k:not-data-disabled:data-outside-view:text-fg-muted',
  'k:data-today:font-semibold k:data-today:shadow-[inset_0_0_0_1px_var(--kite-color-border-strong)]',
  'k:data-selected:bg-fg k:data-selected:text-fg-inverse k:data-selected:hover:bg-fg',
  'k:data-disabled:cursor-not-allowed k:data-disabled:text-fg-disabled k:data-disabled:hover:bg-transparent',
  'k:data-unavailable:cursor-not-allowed k:data-unavailable:text-fg-disabled k:data-unavailable:line-through k:data-unavailable:hover:bg-transparent',
)

export const presetButton = cn(
  'k:flex k:h-9 k:w-full k:cursor-pointer k:items-center k:rounded-sm k:border-0 k:bg-transparent k:px-3 k:text-left k:text-body-sm k:whitespace-nowrap k:text-fg',
  'k:hover:bg-surface-hover k:data-active:bg-surface-active k:data-active:font-semibold',
)

export const literal = 'k:text-fg-muted'
export const segment = cn(
  'k:rounded-xs k:tabular-nums k:outline-none',
  'k:focus:bg-selection-bg k:focus:text-selection-text k:data-placeholder:text-fg-muted',
)
