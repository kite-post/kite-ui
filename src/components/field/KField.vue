<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
import { computed, provide, ref, useId } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import { fieldKey } from './context'

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    /** Текст помилки (масив — показується перше). Наявність помилки = invalid. */
    error?: string | string[] | null
    /** Показати «(необов'язково)». */
    optional?: boolean
    /** Передає required контролу; візуально не позначається. */
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    id?: string
    orientation?: 'vertical' | 'horizontal'
    labelWidth?: string
    /** Підпис лише для скрінрідера. */
    hideLabel?: boolean
    /** Резервувати рядок під підказку, щоб форма не «стрибала». */
    reserveMessageSpace?: boolean
    class?: string
  }>(),
  {
    error: null,
    optional: false,
    required: false,
    disabled: false,
    readonly: false,
    orientation: 'vertical',
    labelWidth: '12.5rem',
    hideLabel: false,
    reserveMessageSpace: false,
  },
)

defineSlots<{
  default(props: { id: string; describedBy: string | undefined; invalid: boolean }): unknown
  label?(): unknown
  hint?(): unknown
  labelAction?(): unknown
}>()

const { t } = useMessages()
const autoId = useId()
const id = computed(() => props.id ?? `kite-field-${autoId}`)
const labelId = computed(() => `${id.value}-label`)
const hintId = computed(() => `${id.value}-hint`)
const errorId = computed(() => `${id.value}-error`)
const counterId = computed(() => `${id.value}-count`)
const counter = ref<string | null>(null)

const errorText = computed(() => {
  const e = props.error
  if (Array.isArray(e)) return e[0] ?? null
  return e || null
})
const invalid = computed(() => errorText.value !== null)
const hasHint = computed(() => !!props.hint)

const describedBy = computed(() => {
  const ids: string[] = []
  if (invalid.value) ids.push(errorId.value)
  else if (hasHint.value) ids.push(hintId.value)
  if (counter.value) ids.push(counterId.value)
  return ids.length ? ids.join(' ') : undefined
})

provide(fieldKey, {
  id,
  labelId,
  describedBy,
  invalid,
  required: computed(() => props.required),
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  counter,
})

const horizontal = computed(() => props.orientation === 'horizontal')
</script>

<template>
  <div
    :class="
      cn(
        'kite-field k:grid k:min-w-0 k:gap-1',
        horizontal &&
          'k:md:grid-cols-[var(--kite-field-label-width)_minmax(0,1fr)] k:md:gap-x-4 k:md:gap-y-1',
        props.class,
      )
    "
    :style="horizontal ? { '--kite-field-label-width': labelWidth } : undefined"
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <div
      :class="
        cn(
          'k:flex k:items-baseline k:justify-between k:gap-2',
          hideLabel && 'k:sr-only',
          horizontal && 'k:md:pt-2.5',
        )
      "
    >
      <label
        :id="labelId"
        :for="id"
        :class="cn('k:text-label k:text-fg', disabled && 'k:text-fg-disabled')"
      >
        <slot name="label">{{ label }}</slot>
        <span v-if="optional" class="k:ml-1 k:font-normal k:text-fg-muted">{{
          t('field.optional')
        }}</span>
      </label>
      <slot name="labelAction" />
    </div>

    <div :class="cn('k:min-w-0', horizontal && 'k:md:col-start-2')">
      <slot :id="id" :described-by="describedBy" :invalid="invalid" />
    </div>

    <div
      v-if="invalid || hasHint || counter || reserveMessageSpace"
      :class="
        cn(
          'k:flex k:min-h-4 k:items-start k:justify-between k:gap-2 k:text-caption',
          horizontal && 'k:md:col-start-2',
        )
      "
    >
      <p
        v-if="invalid"
        :id="errorId"
        class="k:m-0 k:flex k:items-start k:gap-1.5 k:font-medium k:text-danger-text"
        aria-live="polite"
      >
        <KIcon :icon="CircleAlert" size="sm" />
        <span>{{ errorText }}</span>
      </p>
      <p v-else-if="hasHint" :id="hintId" class="k:m-0 k:text-fg-muted">
        <slot name="hint">{{ hint }}</slot>
      </p>
      <span v-else />
      <span v-if="counter" :id="counterId" class="kite-num k:shrink-0 k:text-fg-muted">
        {{ counter }}
      </span>
    </div>
  </div>
</template>
