<script setup lang="ts">
import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    selected?: boolean
    /** Ховер рядка: рядок відкриває сторінку або реагує на клік. */
    interactive?: boolean
    class?: string
  }>(),
  { selected: false, interactive: false },
)
defineSlots<{ default?(): unknown }>()
</script>

<template>
  <tr
    :class="
      cn(
        'kite-table-row k:relative',
        interactive && 'k:cursor-pointer k:hover:[&>td]:bg-surface-hover',
        selected && 'k:[&>td]:bg-selection-bg k:hover:[&>td]:bg-selection-bg',
        props.class,
      )
    "
    :data-selected="selected ? '' : undefined"
    :aria-selected="selected ? 'true' : undefined"
  >
    <slot />
  </tr>
</template>
