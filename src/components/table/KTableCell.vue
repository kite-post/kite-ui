<script setup lang="ts">
import { inject } from 'vue'

import { cn } from '../../lib/cn'
import { alignClass, tableKey, type CellAlign } from './context'

const props = withDefaults(
  defineProps<{
    align?: CellAlign
    /** Праворуч + tabular-nums. */
    numeric?: boolean
    /** Обрізати довгий текст трикрапкою. */
    truncate?: boolean
    /** Заголовок рядка: <th scope="row">. */
    rowHeader?: boolean
    class?: string
  }>(),
  { numeric: false, truncate: false, rowHeader: false },
)
defineSlots<{ default?(): unknown }>()
const ctx = inject(tableKey, null)
</script>

<template>
  <component
    :is="rowHeader ? 'th' : 'td'"
    :scope="rowHeader ? 'row' : undefined"
    :class="
      cn(
        'kite-table-cell k:border-b k:border-line k:bg-surface k:px-3 k:align-middle k:font-normal k:first:pl-4 k:last:pr-4',
        ctx?.density.value === 'compact' ? 'k:h-10 k:py-1.5' : 'k:h-12 k:py-2',
        alignClass[align ?? (numeric ? 'end' : 'start')],
        numeric && 'kite-num k:tabular-nums',
        truncate && 'k:max-w-0 k:truncate',
        ctx?.stickyFirstColumn.value && 'k:first:sticky k:first:left-0 k:first:z-[1]',
        props.class,
      )
    "
  >
    <slot />
  </component>
</template>
