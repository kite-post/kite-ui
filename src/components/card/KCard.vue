<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, provide, type Component } from 'vue'

import { cn } from '../../lib/cn'
import { cardKey } from './context'

const props = withDefaults(
  defineProps<{
    variant?: 'outline' | 'elevated' | 'subtle'
    padding?: 'sm' | 'md'
    /** Лінії між шапкою, вмістом і футером. */
    divided?: boolean
    /** Уся картка клікабельна через посилання в заголовку (KCardHeader titleHref / titleTo). */
    interactive?: boolean
    selected?: boolean
    disabled?: boolean
    as?: string | Component
    class?: string
  }>(),
  {
    variant: 'outline',
    padding: 'md',
    divided: false,
    interactive: false,
    selected: false,
    disabled: false,
    as: 'div',
  },
)

defineSlots<{ default(): unknown }>()

provide(cardKey, {
  padding: computed(() => props.padding),
  divided: computed(() => props.divided),
})

const variantClass = {
  outline: 'k:border k:border-line k:bg-surface',
  elevated: 'k:border k:border-raised-border k:bg-surface k:shadow-sm',
  subtle: 'k:border k:border-transparent k:bg-bg-subtle',
}

const classes = computed(() =>
  cn(
    'kite-card k:relative k:flex k:min-w-0 k:flex-col k:rounded-md k:text-fg',
    variantClass[props.variant],
    props.divided && 'k:divide-y k:divide-line',
    props.interactive &&
      !props.disabled && [
        'k:transition-[box-shadow,border-color] k:duration-100 k:ease-out',
        'k:hover:border-line-strong k:hover:shadow-md k:active:shadow-sm',
        // Фокус посилання-розтяжки малюється навколо всієї картки.
        'k:has-[.kite-card__stretch:focus-visible]:outline-2 k:has-[.kite-card__stretch:focus-visible]:outline-offset-2 k:has-[.kite-card__stretch:focus-visible]:outline-focus-ring',
      ],
    props.selected && 'k:border-transparent k:ring-2 k:ring-primary',
    props.disabled && 'k:opacity-60',
    props.class,
  ),
)
</script>

<template>
  <Primitive
    :as="as"
    :class="classes"
    :data-variant="variant"
    :data-interactive="interactive ? '' : undefined"
    :data-selected="selected ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <slot />
  </Primitive>
</template>
