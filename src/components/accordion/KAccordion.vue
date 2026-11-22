<script setup lang="ts">
import { AccordionRoot } from 'reka-ui'
import { computed, provide } from 'vue'

import { cn } from '../../lib/cn'
import { accordionKey } from './context'

type Value = string | string[] | null

const props = withDefaults(
  defineProps<{
    defaultValue?: Value
    type?: 'single' | 'multiple'
    /** Для single: можна закрити всі секції. */
    collapsible?: boolean
    variant?: 'divided' | 'cards'
    headingLevel?: 2 | 3 | 4
    disabled?: boolean
    class?: string
  }>(),
  {
    defaultValue: undefined,
    type: 'single',
    collapsible: true,
    variant: 'divided',
    headingLevel: 3,
    disabled: false,
  },
)

const model = defineModel<Value | undefined>({ default: undefined })
defineSlots<{ default?(): unknown }>()

if (model.value === undefined)
  model.value = props.defaultValue ?? (props.type === 'multiple' ? [] : null)

// Reka позначає «нічого не відкрито» як undefined, кіт — як null.
const value = computed({
  get: () => (props.type === 'multiple' ? (model.value ?? []) : (model.value ?? undefined)),
  set: (v: string | string[] | undefined) => {
    model.value = props.type === 'multiple' ? (Array.isArray(v) ? v : []) : (v as string) || null
  },
})

provide(accordionKey, {
  variant: computed(() => props.variant),
  headingLevel: computed(() => props.headingLevel),
})
</script>

<template>
  <AccordionRoot
    v-model="value"
    :type="type"
    :collapsible="collapsible"
    :disabled="disabled"
    :data-variant="variant"
    :class="
      cn(
        'kite-accordion',
        variant === 'cards' ? 'k:grid k:gap-2' : 'k:border-y k:border-line',
        props.class,
      )
    "
  >
    <slot />
  </AccordionRoot>
</template>
