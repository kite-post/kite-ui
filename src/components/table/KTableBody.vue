<script setup lang="ts">
import { inject } from 'vue'

import { cn } from '../../lib/cn'
import { tableKey } from './context'

defineSlots<{ default?(): unknown }>()
const ctx = inject(tableKey, null)
</script>

<template>
  <tbody
    :class="
      cn(
        'kite-table-body',
        ctx?.striped.value && 'k:[&>tr:nth-child(even)>*]:bg-surface-sunken',
        'k:[&>tr:last-child>*]:border-b-0',
      )
    "
  >
    <slot />
  </tbody>
</template>
