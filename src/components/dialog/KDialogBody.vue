<script setup lang="ts">
import { cn } from '../../lib/cn'
import { useOverlayKind } from './context'

// Вміст діалогу чи панелі: прокручується, шапка й футер лишаються на місці.
const props = defineProps<{ class?: string }>()
defineSlots<{ default(): unknown }>()
const kind = useOverlayKind()
</script>

<template>
  <div
    :class="
      cn(
        'kite-dialog__body k:grid k:min-h-0 k:flex-1 k:content-start k:gap-4 k:overflow-y-auto k:px-6',
        kind === 'sheet' ? 'k:py-5' : 'k:pt-5 k:pb-6',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
