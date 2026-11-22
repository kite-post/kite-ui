<script setup lang="ts">
import { inject } from 'vue'

import { cn } from '../../lib/cn'
import { alignClass, tableKey, type CellAlign } from './context'

const props = withDefaults(
  defineProps<{
    align?: CellAlign
    width?: string
    /** Числовий стовпець — праворуч. */
    numeric?: boolean
    class?: string
  }>(),
  { numeric: false },
)
defineSlots<{ default?(): unknown }>()
const ctx = inject(tableKey, null)
</script>

<template>
  <th
    scope="col"
    :style="width ? { width } : undefined"
    :class="
      cn(
        'kite-table-head k:h-10 k:border-b k:border-line k:bg-surface-sunken k:px-3 k:py-0 k:align-middle k:text-caption k:font-semibold k:whitespace-nowrap k:text-fg-muted k:first:pl-4 k:last:pr-4',
        alignClass[align ?? (numeric ? 'end' : 'start')],
        ctx?.stickyHeader.value && 'k:sticky k:top-(--kite-table-sticky-top,0) k:z-[2]',
        ctx?.stickyFirstColumn.value && 'k:first:sticky k:first:left-0 k:first:z-[3]',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
