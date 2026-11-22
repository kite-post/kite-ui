<script setup lang="ts">
import { ToggleGroupRoot } from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'

import { cn } from '../../lib/cn'
import { useField } from '../field/context'
import { toggleGroupKey } from './context'

type Value = string | null | string[]

const props = withDefaults(
  defineProps<{
    type?: 'single' | 'multiple'
    defaultValue?: Value
    /** Для single: не дозволяє зняти вибір. */
    required?: boolean
    size?: 'sm' | 'md' | 'lg'
    /** Сегменти ділять ширину порівну. */
    block?: boolean
    disabled?: boolean
    /** Назва групи (або підпис KField). */
    label?: string
    class?: string
  }>(),
  {
    type: 'single',
    defaultValue: undefined,
    required: false,
    size: 'md',
    block: false,
    disabled: false,
  },
)

const model = defineModel<Value | undefined>({ default: undefined })
defineSlots<{ default?(): unknown }>()

const field = useField()
const isDisabled = computed(() => props.disabled || (field?.disabled.value ?? false))

if (model.value === undefined)
  model.value = props.defaultValue ?? (props.type === 'multiple' ? [] : null)

// Reka позначає «нічого не обрано» як undefined / '', кіт — як null.
const value = computed({
  get: () => (props.type === 'multiple' ? (model.value ?? []) : (model.value ?? '')),
  set: (v: string | string[] | undefined) => {
    if (props.type === 'multiple') {
      model.value = Array.isArray(v) ? v : []
      return
    }
    const next = typeof v === 'string' && v !== '' ? v : null
    if (next === null && props.required) return
    model.value = next
  },
})

provide(toggleGroupKey, {
  size: computed(() => props.size),
  block: computed(() => props.block),
  sliding: computed(() => props.type === 'single'),
})

// Індикатор обраного сегмента для single: позицію беремо з DOM після кожної зміни.
const root = ref<InstanceType<typeof ToggleGroupRoot>>()
const indicator = ref<{ left: number; width: number } | null>(null)
const animate = ref(false)

function measure() {
  const el = root.value?.$el as HTMLElement | undefined
  const on = el?.querySelector<HTMLElement>(':scope > [data-state="on"]')
  indicator.value = on ? { left: on.offsetLeft, width: on.offsetWidth } : null
}

let observer: ResizeObserver | undefined
onMounted(() => {
  measure()
  const el = root.value?.$el as HTMLElement | undefined
  if (el && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    observer.observe(el)
  }
  // Перший замір без анімації: індикатор не має «виїжджати» при завантаженні.
  requestAnimationFrame(() => (animate.value = true))
})
onBeforeUnmount(() => observer?.disconnect())
watch(
  () => model.value,
  () => nextTick(measure),
  { deep: true },
)

const heights = { sm: 'k:h-8', md: 'k:h-10', lg: 'k:h-12' }
</script>

<template>
  <ToggleGroupRoot
    ref="root"
    v-model="value"
    :type="type"
    :disabled="isDisabled"
    :aria-label="label"
    :aria-labelledby="!label && field ? field.labelId.value : undefined"
    :aria-describedby="field?.describedBy.value"
    role="group"
    :data-size="size"
    :class="
      cn(
        'kite-toggle-group k:relative k:isolate k:items-center k:gap-0.5 k:rounded-full k:bg-bg-subtle k:p-(--kite-toggle-group-padding) k:shadow-[inset_0_0_0_1px_var(--kite-color-border)] k:[--kite-toggle-group-padding:0.25rem]',
        block ? 'k:flex k:w-full' : 'k:inline-flex',
        heights[size],
        isDisabled && 'k:cursor-not-allowed',
        props.class,
      )
    "
  >
    <span
      v-if="type === 'single' && indicator"
      aria-hidden="true"
      :class="
        cn(
          'kite-toggle-group-indicator k:absolute k:top-(--kite-toggle-group-padding) k:bottom-(--kite-toggle-group-padding) k:left-0 k:-z-10 k:rounded-full k:bg-surface-raised k:shadow-[var(--kite-shadow-sm),inset_0_0_0_1px_var(--kite-color-raised-border)]',
          animate &&
            'k:transition-[translate,width] k:duration-200 k:ease-in-out k:motion-reduce:transition-none',
        )
      "
      :style="{ width: `${indicator.width}px`, translate: `${indicator.left}px 0` }"
    />
    <slot />
  </ToggleGroupRoot>
</template>
