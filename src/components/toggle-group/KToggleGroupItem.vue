<script setup lang="ts">
import { ToggleGroupItem } from 'reka-ui'
import { computed, inject, type Component } from 'vue'

import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import { toggleGroupKey } from './context'

const props = defineProps<{
  value: string
  icon?: Component
  /** Назва для скрінрідера; обов'язкова, якщо немає тексту. */
  label?: string
  disabled?: boolean
  class?: string
}>()

const slots = defineSlots<{ default?(): unknown }>()
const group = inject(toggleGroupKey, null)
const size = computed(() => group?.size.value ?? 'md')
const iconOnly = computed(() => !!props.icon && !slots.default)

const sizes = {
  sm: 'k:h-6 k:px-2.5 k:text-label',
  md: 'k:h-8 k:px-3 k:text-body-sm',
  lg: 'k:h-10 k:px-4 k:text-body',
}
const square = { sm: 'k:w-6 k:px-0', md: 'k:w-8 k:px-0', lg: 'k:w-10 k:px-0' }
</script>

<template>
  <ToggleGroupItem
    :value="value"
    :disabled="disabled"
    :aria-label="iconOnly || label ? label : undefined"
    :class="
      cn(
        'kite-toggle-group-item k:inline-flex k:cursor-pointer k:items-center k:justify-center k:gap-1.5 k:rounded-full k:border-0 k:bg-transparent k:font-sans k:font-medium k:whitespace-nowrap k:text-fg-muted k:select-none',
        'k:transition-colors k:duration-100 k:not-data-disabled:hover:text-fg',
        'k:data-[state=on]:font-semibold k:data-[state=on]:text-fg',
        // У multiple кожен обраний сегмент має власну поверхню, у single — спільний індикатор.
        !group?.sliding.value &&
          'k:data-[state=on]:bg-surface-raised k:data-[state=on]:shadow-[var(--kite-shadow-sm),inset_0_0_0_1px_var(--kite-color-raised-border)]',
        'k:data-disabled:cursor-not-allowed k:data-disabled:text-fg-disabled',
        sizes[size],
        iconOnly && square[size],
        group?.block.value && 'k:flex-1',
        props.class,
      )
    "
  >
    <KIcon v-if="icon" :icon="icon" :size="size === 'lg' ? 'md' : 'sm'" />
    <slot />
  </ToggleGroupItem>
</template>
