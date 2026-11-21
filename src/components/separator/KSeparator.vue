<script setup lang="ts">
import { Separator } from 'reka-ui'
import { computed } from 'vue'

import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    /** false — семантичний роздільник (role="separator") у меню й тулбарах. */
    decorative?: boolean
    /** Текст посередині лінії («або»). */
    label?: string
    class?: string
  }>(),
  { orientation: 'horizontal', decorative: true },
)

const labelClass = computed(() =>
  cn(
    'kite-separator k:flex k:items-center k:gap-3 k:text-caption k:text-fg-muted',
    "k:before:h-px k:before:flex-1 k:before:bg-line k:before:content-['']",
    "k:after:h-px k:after:flex-1 k:after:bg-line k:after:content-['']",
    props.class,
  ),
)

const lineClass = computed(() =>
  cn(
    'kite-separator k:shrink-0 k:bg-line',
    props.orientation === 'horizontal' ? 'k:h-px k:w-full' : 'k:min-h-5 k:w-px k:self-stretch',
    props.class,
  ),
)
</script>

<template>
  <div v-if="label" :class="labelClass" :role="decorative ? 'none' : 'separator'">
    {{ label }}
  </div>
  <Separator v-else :orientation="orientation" :decorative="decorative" :class="lineClass" />
</template>
