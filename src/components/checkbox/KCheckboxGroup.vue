<script setup lang="ts">
import { computed, provide } from 'vue'

import { cn } from '../../lib/cn'
import KFieldset from '../field/KFieldset.vue'
import { checkboxGroupKey } from './context'
import KCheckbox from './KCheckbox.vue'

export interface CheckboxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Легенда групи. Обов'язкова. */
    label: string
    options?: CheckboxOption[]
    hint?: string
    error?: string | null
    optional?: boolean
    disabled?: boolean
    /** Для групи означає «хоча б один»; пишіть це в підказці словами. */
    required?: boolean
    orientation?: 'vertical' | 'horizontal'
    size?: 'sm' | 'md'
    name?: string
    class?: string
  }>(),
  {
    error: null,
    optional: false,
    disabled: false,
    required: false,
    orientation: 'vertical',
    size: 'md',
  },
)

const model = defineModel<string[]>({ default: () => [] })
defineSlots<{ default?(): unknown }>()

provide(checkboxGroupKey, {
  isChecked: (value) => model.value.includes(value),
  toggle: (value, checked) => {
    const set = new Set(model.value)
    if (checked) set.add(value)
    else set.delete(value)
    model.value = [...set]
  },
  disabled: computed(() => props.disabled),
  invalid: computed(() => !!props.error),
  size: computed(() => props.size),
  name: computed(() => props.name),
})
</script>

<template>
  <KFieldset
    :label="label"
    :hint="hint"
    :error="error"
    :optional="optional"
    :disabled="disabled"
    :class="props.class"
  >
    <div
      :class="
        cn(
          orientation === 'horizontal'
            ? 'k:flex k:flex-wrap k:gap-x-6 k:gap-y-3'
            : 'k:grid k:gap-3',
        )
      "
      :data-required="required ? '' : undefined"
    >
      <slot>
        <KCheckbox
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          :label="o.label"
          :description="o.description"
          :disabled="o.disabled"
        />
      </slot>
    </div>
  </KFieldset>
</template>
