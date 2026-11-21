<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/cn'
import { cardPadding, useCard } from './context'

const props = withDefaults(defineProps<{ align?: 'start' | 'end' | 'between'; class?: string }>(), {
  align: 'end',
})
defineSlots<{ default(): unknown }>()

const card = useCard()
const p = computed(() => cardPadding[card.padding.value])
const justify = { start: 'k:justify-start', end: 'k:justify-end', between: 'k:justify-between' }
</script>

<template>
  <div
    :class="
      cn(
        'kite-card__footer k:relative k:z-[1] k:flex k:flex-wrap k:items-center k:gap-2',
        p.x,
        p.footerY,
        justify[align],
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
