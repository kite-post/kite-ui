<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    shape?: 'text' | 'rect' | 'circle'
    /** Кількість рядків для shape="text"; останній — 60 % ширини. */
    lines?: number
    width?: string
    height?: string
    class?: string
  }>(),
  { shape: 'text', lines: 1, width: '100%' },
)

// Колір — surface-hover: на світлій slate-100, на темній slate-800, видно на будь-якій поверхні.
const base =
  'kite-skeleton k:block k:bg-surface-hover k:animate-[kite-pulse_1.5s_var(--kite-ease-in-out)_infinite]'

const items = computed(() =>
  Array.from({ length: props.shape === 'text' ? Math.max(1, props.lines) : 1 }, (_, i) => i),
)
</script>

<template>
  <span
    v-if="shape === 'text'"
    :class="cn('k:grid k:gap-2', props.class)"
    :style="{ width }"
    aria-hidden="true"
  >
    <span
      v-for="i in items"
      :key="i"
      :class="cn(base, 'k:h-[0.6lh] k:rounded-xs')"
      :style="{ width: lines > 1 && i === lines - 1 ? '60%' : '100%', height }"
    />
  </span>
  <span
    v-else
    :class="cn(base, shape === 'circle' ? 'k:rounded-full' : 'k:rounded-sm', props.class)"
    :style="{ width, height: height ?? (shape === 'circle' ? width : '1rem') }"
    aria-hidden="true"
  />
</template>
