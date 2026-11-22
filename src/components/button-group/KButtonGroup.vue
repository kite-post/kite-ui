<script setup lang="ts">
import { computed, provide } from 'vue'

import { cn } from '../../lib/cn'
import type { ButtonSize, ButtonVariant } from '../button/variants'
import { buttonGroupKey } from './context'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    orientation?: 'horizontal' | 'vertical'
    /** Назва групи для скрінрідера. */
    label?: string
    class?: string
  }>(),
  { variant: 'secondary', size: 'md', orientation: 'horizontal' },
)

defineSlots<{ default?(): unknown }>()

provide(buttonGroupKey, {
  variant: computed(() => props.variant),
  size: computed(() => props.size),
})

// Діти — кнопки без проміжків: внутрішні кути прямі, сусідні рамки накладаються в
// роздільник 1 px. Фокус і ховер піднімають кнопку над сусідами, щоб кільце не ховалось.
const layout = {
  horizontal: [
    'k:flex-row',
    'k:*:not-first:-ml-px k:*:not-first:rounded-l-none k:*:not-last:rounded-r-none',
    'k:*:data-[variant=primary]:not-first:border-l-primary-active',
    'k:*:data-[variant=danger]:not-first:border-l-danger-active',
  ],
  vertical: [
    'k:flex-col',
    'k:*:rounded-none k:*:first:rounded-t-md k:*:last:rounded-b-md k:*:not-first:-mt-px',
    'k:*:data-[variant=primary]:not-first:border-t-primary-active',
    'k:*:data-[variant=danger]:not-first:border-t-danger-active',
  ],
}
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    :data-orientation="orientation"
    :class="
      cn(
        'kite-button-group k:isolate k:inline-flex k:*:hover:z-[1] k:*:focus-visible:z-10',
        layout[orientation],
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
