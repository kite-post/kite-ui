<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/cn'
import { cardPadding, useCard } from './context'

const props = defineProps<{ class?: string }>()
defineSlots<{ default(): unknown }>()

const card = useCard()
const p = computed(() => cardPadding[card.padding.value])
</script>

<template>
  <!-- Перший блок — повний верхній відступ; після шапки без ліній — без нього (відступ дає шапка). -->
  <div
    :class="
      cn(
        'kite-card__content k:min-w-0',
        p.x,
        card.divided.value ? [p.contentGap, p.contentBottomDivided] : ['k:pt-0', p.contentBottom],
        p.contentFirst,
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
