<script setup lang="ts">
import { cn } from '../../lib/cn'
import { useOverlayKind } from './context'

// Кнопки праворуч, головна — остання. На мобільному на всю ширину, головна зверху.
const props = defineProps<{ class?: string }>()
defineSlots<{ default(): unknown }>()
const kind = useOverlayKind()
</script>

<template>
  <div
    :class="
      cn(
        'kite-dialog__footer k:flex k:shrink-0 k:flex-col-reverse k:gap-3 k:px-6 k:sm:flex-row k:sm:justify-end',
        'k:[&>*]:w-full k:sm:[&>*]:w-auto',
        kind === 'sheet' ? 'k:border-t k:border-line k:py-4' : 'k:pb-6',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
