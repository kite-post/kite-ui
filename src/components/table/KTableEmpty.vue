<script setup lang="ts">
import { cn } from '../../lib/cn'

// colspan із запасом: браузер обмежує його кількістю стовпців.
const props = withDefaults(defineProps<{ colspan?: number; class?: string }>(), { colspan: 999 })
defineSlots<{ default?(): unknown }>()
</script>

<template>
  <tr class="kite-table-empty">
    <td :colspan="colspan" :class="cn('k:border-b-0 k:bg-surface k:px-4 k:py-8', props.class)">
      <slot />
    </td>
  </tr>
</template>
