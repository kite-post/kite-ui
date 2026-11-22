<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'
import { computed, provide } from 'vue'

import { cn } from '../../lib/cn'
import KFieldset from '../field/KFieldset.vue'
import { radioGroupKey } from './context'
import KRadio from './KRadio.vue'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Легенда групи. Обов'язкова. */
    label: string
    options?: RadioOption[]
    variant?: 'default' | 'card'
    /** Колонки для variant="card" (на мобільному завжди 1). */
    columns?: 1 | 2 | 3
    orientation?: 'vertical' | 'horizontal'
    size?: 'sm' | 'md'
    hint?: string
    error?: string | null
    optional?: boolean
    disabled?: boolean
    required?: boolean
    name?: string
    class?: string
  }>(),
  {
    variant: 'default',
    columns: 1,
    orientation: 'vertical',
    size: 'md',
    error: null,
    optional: false,
    disabled: false,
    required: false,
  },
)

const model = defineModel<string | null>({ default: null })
defineSlots<{ default?(): unknown }>()

provide(radioGroupKey, {
  variant: computed(() => props.variant),
  size: computed(() => props.size),
  invalid: computed(() => !!props.error),
  modelValue: computed(() => model.value),
})

const layout = computed(() => {
  if (props.variant === 'card')
    return cn(
      'k:grid k:gap-3',
      { 1: '', 2: 'k:sm:grid-cols-2', 3: 'k:sm:grid-cols-2 k:lg:grid-cols-3' }[props.columns],
    )
  return props.orientation === 'horizontal'
    ? 'k:flex k:flex-wrap k:gap-x-6 k:gap-y-3'
    : 'k:grid k:gap-3'
})

// Reka працює з undefined як «нічого не обрано», кіт — з null.
const value = computed({
  get: () => model.value ?? undefined,
  set: (v: string | undefined) => (model.value = v ?? null),
})
</script>

<template>
  <KFieldset
    v-slot="{ legendId, describedBy }"
    :label="label"
    :hint="hint"
    :error="error"
    :optional="optional"
    :disabled="disabled"
    :class="props.class"
  >
    <RadioGroupRoot
      v-model="value"
      :name="name"
      :required="required"
      :disabled="disabled"
      :orientation="orientation === 'horizontal' ? 'horizontal' : 'vertical'"
      :aria-labelledby="legendId"
      :aria-describedby="describedBy"
      :aria-invalid="error ? 'true' : undefined"
      :class="layout"
      :data-variant="variant"
    >
      <slot>
        <KRadio
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          :label="o.label"
          :description="o.description"
          :disabled="o.disabled"
        />
      </slot>
    </RadioGroupRoot>
  </KFieldset>
</template>
