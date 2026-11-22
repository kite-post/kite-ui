<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui'
import { computed, useId } from 'vue'

import { cn } from '../../lib/cn'
import { choiceBoxClasses } from '../checkbox/context'
import { useRadioGroup } from './context'

const props = withDefaults(
  defineProps<{
    value: string
    label?: string
    description?: string
    disabled?: boolean
    class?: string
  }>(),
  { disabled: false },
)

defineSlots<{ default?(): unknown; aside?(): unknown }>()

const group = useRadioGroup()
const id = `kite-radio-${useId()}`
const descId = `${id}-desc`
const isCard = computed(() => group.variant.value === 'card')
const checked = computed(() => group.modelValue.value === props.value)
</script>

<template>
  <label
    :class="
      cn(
        'kite-radio k:group/choice k:flex k:items-start k:gap-2 k:text-fg',
        group.size.value === 'sm' && !isCard ? 'k:text-body-sm' : 'k:text-body',
        disabled ? 'k:cursor-not-allowed k:text-fg-disabled' : 'k:cursor-pointer',
        isCard && [
          'k:relative k:gap-3 k:rounded-md k:border k:border-line k:bg-surface k:p-4',
          'k:transition-[border-color,box-shadow] k:duration-100',
          !disabled && 'k:hover:border-line-strong',
          checked &&
            'k:border-primary k:shadow-[0_0_0_1px_var(--kite-color-primary)] k:hover:border-primary',
        ],
        props.class,
      )
    "
    :data-state="checked ? 'checked' : 'unchecked'"
    :data-disabled="disabled ? '' : undefined"
  >
    <RadioGroupItem
      :id="id"
      :value="value"
      :disabled="disabled"
      :aria-describedby="description ? descId : undefined"
      :class="
        cn(
          choiceBoxClasses(isCard ? 'md' : group.size.value),
          'k:rounded-full',
          group.invalid.value && 'k:border-danger-text',
        )
      "
    >
      <RadioGroupIndicator class="k:size-2 k:rounded-full k:bg-fg-inverse" />
    </RadioGroupItem>
    <span class="k:min-w-0 k:flex-1">
      <span :class="isCard && 'k:block k:font-semibold'">
        <slot>{{ label }}</slot>
      </span>
      <span
        v-if="description"
        :id="descId"
        :class="cn('k:block k:text-fg-muted', isCard ? 'k:text-body-sm' : 'k:text-caption')"
      >
        {{ description }}
      </span>
    </span>
    <span v-if="$slots.aside" class="kite-num k:ml-auto k:shrink-0 k:text-right k:font-semibold">
      <slot name="aside" />
    </span>
  </label>
</template>
