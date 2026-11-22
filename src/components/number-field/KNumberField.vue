<script setup lang="ts">
import { Minus, Plus } from '@lucide/vue'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { intlLocale } from '../../lib/intl'
import { controlClasses, nativeInputClasses, type ControlSize } from '../field/control-styles'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    /** Shift + стрілка, PageUp / PageDown. Типово step × 10. */
    largeStep?: number
    /** Знаків після коми. Для money — завжди 2. */
    precision?: number
    /** money: значення в копійках, показ у гривнях. */
    format?: 'decimal' | 'money' | 'percent'
    /** Суфікс одиниць: кг, см, шт. */
    unit?: string
    stepper?: boolean
    /** Притягнути до меж при виході з поля. */
    clampOnBlur?: boolean
    size?: ControlSize
    placeholder?: string
    name?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    step: 1,
    precision: 0,
    format: 'decimal',
    stepper: true,
    clampOnBlur: true,
    size: 'md',
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

const model = defineModel<number | null>({ default: null })

const attrs = useAttrs()
const { t, locale } = useMessages()
const control = useFieldControl(props, `kite-number-${useId()}`)

const isMoney = computed(() => props.format === 'money')
const digits = computed(() => (isMoney.value ? 2 : props.precision))
const suffix = computed(
  () => props.unit ?? (isMoney.value ? '₴' : props.format === 'percent' ? '%' : undefined),
)

// Для money Reka працює в гривнях, а v-model — у копійках (без похибок float у сумах).
const scale = computed(() => (isMoney.value ? 100 : 1))
const toInner = (v: number | undefined) => (v === undefined ? undefined : v / scale.value)
const value = computed({
  get: () => (model.value === null ? undefined : model.value / scale.value),
  set: (v: number | undefined) => {
    if (v === undefined || Number.isNaN(v)) model.value = null
    else model.value = isMoney.value ? Math.round(v * 100) : v
  },
})

const formatOptions = computed<Intl.NumberFormatOptions>(() => ({
  minimumFractionDigits: digits.value,
  maximumFractionDigits: digits.value,
  useGrouping: true,
}))

const formatter = computed(
  () => new Intl.NumberFormat(intlLocale(locale.value), formatOptions.value),
)
const valueText = computed(() => {
  if (value.value === undefined) return undefined
  const text = formatter.value.format(value.value)
  return suffix.value ? `${text} ${suffix.value}` : text
})

const big = computed(() => props.largeStep ?? props.step * 10)

// Великий крок: Reka знає лише step, тож Shift+стрілки й PageUp/PageDown обробляємо самі
// у фазі capture, до її обробників.
function onKeydownCapture(event: KeyboardEvent) {
  if (control.disabled.value || control.readonly.value) return
  const dir =
    event.key === 'PageUp' || (event.shiftKey && event.key === 'ArrowUp')
      ? 1
      : event.key === 'PageDown' || (event.shiftKey && event.key === 'ArrowDown')
        ? -1
        : 0
  if (!dir) return
  event.preventDefault()
  event.stopPropagation()
  const current = value.value ?? toInner(props.min) ?? 0
  let next = current + dir * toInner(big.value)!
  if (props.min !== undefined) next = Math.max(toInner(props.min)!, next)
  if (props.max !== undefined) next = Math.min(toInner(props.max)!, next)
  value.value = Number(next.toFixed(digits.value))
}

const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const stepButton = cn(
  'k:grid k:h-full k:w-(--kite-number-field-stepper-width) k:shrink-0 k:cursor-pointer k:place-items-center k:border-0 k:bg-transparent k:text-fg-muted',
  'k:hover:bg-surface-hover k:hover:text-fg k:disabled:cursor-not-allowed k:disabled:bg-transparent k:disabled:text-fg-disabled',
)
</script>

<template>
  <NumberFieldRoot
    v-model="value"
    :min="toInner(min)"
    :max="toInner(max)"
    :step="toInner(step)"
    :format-options="formatOptions"
    :locale="intlLocale(locale)"
    :disabled="control.disabled.value"
    :readonly="control.readonly.value"
    :required="control.required.value"
    :allow-invalid="!clampOnBlur"
    :name="name"
    disable-wheel-change
    :step-snapping="false"
    :class="
      cn(
        controlClasses({
          size,
          invalid: control.invalid.value,
          disabled: control.disabled.value,
          readonly: control.readonly.value,
        }),
        'kite-number-field k:[--kite-number-field-stepper-width:2.25rem]',
        stepper && !control.readonly.value && 'k:overflow-hidden k:pr-0',
        attrs.class as string,
      )
    "
    :style="attrs.style as string"
    :data-size="size"
    :data-invalid="control.invalid.value ? '' : undefined"
    :data-disabled="control.disabled.value ? '' : undefined"
    @keydown.capture="onKeydownCapture"
  >
    <NumberFieldInput
      v-bind="{ ...inputAttrs, ...control.ariaAttrs.value }"
      :placeholder="placeholder"
      :aria-valuetext="valueText"
      :class="cn(nativeInputClasses(size), 'kite-num k:text-right')"
    />
    <span v-if="suffix" class="k:shrink-0 k:text-fg-muted">{{ suffix }}</span>
    <template v-if="stepper && !control.readonly.value">
      <span class="k:ml-1 k:flex k:h-full k:shrink-0 k:border-l k:border-line">
        <NumberFieldDecrement :aria-label="t('number.decrement')" :class="stepButton">
          <KIcon :icon="Minus" size="sm" />
        </NumberFieldDecrement>
        <NumberFieldIncrement
          :aria-label="t('number.increment')"
          :class="cn(stepButton, 'k:border-l k:border-line')"
        >
          <KIcon :icon="Plus" size="sm" />
        </NumberFieldIncrement>
      </span>
    </template>
  </NumberFieldRoot>
</template>
