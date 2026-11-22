<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { computed, useId } from 'vue'

import { cn } from '../../lib/cn'
import KSpinner from '../spinner/KSpinner.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    description?: string
    /** Підпис ліворуч (start, типово) або праворуч (end) від перемикача. */
    labelPosition?: 'start' | 'end'
    size?: 'sm' | 'md'
    /** Зберігається на сервері: перемикач уже в новому стані, на повзунку спінер. */
    loading?: boolean
    disabled?: boolean
    name?: string
    id?: string
    class?: string
  }>(),
  { labelPosition: 'start', size: 'md', loading: false, disabled: false },
)

const model = defineModel<boolean>({ default: false })
defineSlots<{ default?(): unknown }>()

const autoId = `kite-switch-${useId()}`
const id = computed(() => props.id ?? autoId)
const descId = computed(() => `${id.value}-desc`)
// Ціль натискання ≥ 40 px: невидима зона довкола треку.
const hitArea = "k:after:absolute k:after:-inset-x-1 k:after:-inset-y-2 k:after:content-['']"
</script>

<template>
  <label
    :class="
      cn(
        'kite-switch k:flex k:min-h-10 k:items-start k:gap-4 k:text-fg',
        labelPosition === 'start'
          ? 'k:justify-between'
          : 'k:flex-row-reverse k:justify-end k:gap-3',
        disabled ? 'k:cursor-not-allowed k:text-fg-disabled' : 'k:cursor-pointer',
        props.class,
      )
    "
    :data-state="model ? 'checked' : 'unchecked'"
    :data-disabled="disabled ? '' : undefined"
  >
    <span v-if="label || $slots.default || description" class="k:min-w-0">
      <span class="k:block k:text-body"
        ><slot>{{ label }}</slot></span
      >
      <span v-if="description" :id="descId" class="k:block k:text-caption k:text-fg-muted">
        {{ description }}
      </span>
    </span>
    <SwitchRoot
      :id="id"
      v-model="model"
      :name="name"
      :disabled="disabled"
      :aria-busy="loading ? 'true' : undefined"
      :aria-describedby="description ? descId : undefined"
      :class="
        cn(
          'k:relative k:inline-flex k:shrink-0 k:items-center k:rounded-full k:p-0.5 k:outline-none',
          'k:bg-switch-off k:transition-colors k:duration-150 k:ease-out',
          'k:data-[state=checked]:bg-success-solid',
          'k:focus-visible:outline-2 k:focus-visible:outline-offset-2 k:focus-visible:outline-focus-ring',
          'k:data-disabled:cursor-not-allowed k:data-disabled:bg-surface-active',
          hitArea,
          size === 'sm' ? 'k:h-5 k:w-8' : 'k:h-6 k:w-10',
        )
      "
    >
      <SwitchThumb
        :class="
          cn(
            'k:grid k:place-items-center k:rounded-full k:bg-surface k:shadow-sm',
            'k:transition-transform k:duration-150 k:ease-out',
            'k:data-disabled:bg-bg-subtle k:data-disabled:shadow-none',
            size === 'sm'
              ? 'k:size-4 k:data-[state=checked]:translate-x-3'
              : 'k:size-5 k:data-[state=checked]:translate-x-4',
          )
        "
      >
        <KSpinner v-if="loading" decorative :delay="0" size="xs" class="k:text-fg-muted" />
      </SwitchThumb>
    </SwitchRoot>
  </label>
</template>
