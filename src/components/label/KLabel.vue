<script setup lang="ts">
import { Label } from 'reka-ui'

import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    for?: string
    /** sm — 14/20 (типово), md — 16/24 біля чекбоксів і радіо. */
    size?: 'sm' | 'md'
    disabled?: boolean
    class?: string
  }>(),
  { size: 'sm', disabled: false },
)

defineSlots<{ default(): unknown }>()
</script>

<template>
  <Label
    :for="props.for"
    :class="
      cn(
        'kite-label k:text-fg',
        size === 'md' ? 'k:text-body' : 'k:text-label',
        disabled && 'k:cursor-not-allowed k:text-fg-disabled',
        props.class,
      )
    "
    :data-disabled="disabled ? '' : undefined"
  >
    <slot />
  </Label>
</template>
