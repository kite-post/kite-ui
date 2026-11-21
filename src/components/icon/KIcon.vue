<script setup lang="ts">
import { computed, type Component } from 'vue'

import { cn } from '../../lib/cn'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const props = withDefaults(
  defineProps<{
    /** Компонент іконки з @lucide/vue. */
    icon: Component
    size?: IconSize
    /** Якщо задано — іконка змістовна (role="img"). Інакше декоративна. */
    label?: string
    class?: string
  }>(),
  { size: 'md' },
)

const px: Record<IconSize, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, '2xl': 48 }

const a11y = computed(() =>
  props.label
    ? { role: 'img', 'aria-label': props.label }
    : { 'aria-hidden': 'true' as const, focusable: 'false' },
)
</script>

<template>
  <component
    :is="icon"
    :size="px[size]"
    :stroke-width="1.5"
    :absolute-stroke-width="false"
    :class="cn('kite-icon k:shrink-0', props.class)"
    :data-size="size"
    v-bind="a11y"
  />
</template>
