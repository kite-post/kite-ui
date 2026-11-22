<script setup lang="ts">
import { Toggle } from 'reka-ui'
import { computed, type Component } from 'vue'

import { cn } from '../../lib/cn'
import { buttonVariants, iconButtonSize, type ButtonSize } from '../button/variants'
import KIcon from '../icon/KIcon.vue'

const props = withDefaults(
  defineProps<{
    defaultValue?: boolean
    variant?: 'ghost' | 'secondary'
    size?: ButtonSize
    icon?: Component
    /** Назва для скрінрідера; обов'язкова, якщо в слоті немає тексту. */
    label?: string
    disabled?: boolean
    class?: string
  }>(),
  { defaultValue: false, variant: 'ghost', size: 'md', disabled: false },
)

const model = defineModel<boolean | undefined>({ default: undefined })

// Некерований режим: без v-model стан тримає сам компонент, стартуючи з defaultValue.
if (model.value === undefined) model.value = props.defaultValue
const pressed = computed({
  get: () => model.value ?? false,
  set: (v: boolean) => (model.value = v),
})

const slots = defineSlots<{ default?(): unknown }>()
const iconOnly = computed(() => !!props.icon && !slots.default)
</script>

<template>
  <Toggle
    v-model="pressed"
    :disabled="disabled"
    :aria-label="iconOnly || label ? label : undefined"
    :data-variant="variant"
    :data-size="size"
    :class="
      cn(
        buttonVariants({ variant, size }),
        'kite-toggle',
        // Увімкнено — заливка всього контрола, а не лише колір тексту (специфікація toggle.md).
        'k:data-[state=on]:bg-primary-subtle k:data-[state=on]:text-primary-text',
        'k:not-data-disabled:data-[state=on]:hover:bg-primary-subtle',
        variant === 'secondary' && 'k:data-[state=on]:border-primary',
        iconOnly && iconButtonSize[size],
        props.class,
      )
    "
  >
    <KIcon v-if="icon" :icon="icon" :size="size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'" />
    <slot />
  </Toggle>
</template>
