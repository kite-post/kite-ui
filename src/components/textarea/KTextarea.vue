<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch,
  watchEffect,
} from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { controlClasses } from '../field/control-styles'
import { useFieldControl } from '../field/context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    rows?: number
    maxRows?: number
    /** Висота росте з вмістом від rows до maxRows. */
    autosize?: boolean
    size?: 'sm' | 'md'
    placeholder?: string
    maxlength?: number
    showCount?: boolean
    /** Ctrl/⌘ + Enter відправляє найближчу форму. */
    submitOnModEnter?: boolean
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    rows: 3,
    maxRows: 8,
    autosize: true,
    size: 'md',
    showCount: false,
    submitOnModEnter: false,
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

const model = defineModel<string>({ default: '' })

const attrs = useAttrs()
const { t, announce } = useMessages()
const control = useFieldControl(props, `kite-textarea-${useId()}`)
const el = ref<HTMLTextAreaElement>()

const lineHeight = computed(() => (props.size === 'sm' ? 20 : 24))
const padY = computed(() => (props.size === 'sm' ? 6 : 8))
const textareaAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

function resize() {
  const node = el.value
  if (!node || !props.autosize) return
  const min = props.rows * lineHeight.value
  const max = props.maxRows * lineHeight.value
  node.style.height = 'auto'
  const content = node.scrollHeight - padY.value * 2
  node.style.height = `${Math.min(Math.max(content, min), max) + padY.value * 2}px`
  node.style.overflowY = content > max ? 'auto' : 'hidden'
}

let observer: ResizeObserver | undefined
onMounted(() => {
  resize()
  if (typeof ResizeObserver !== 'undefined' && el.value) {
    observer = new ResizeObserver(() => resize())
    observer.observe(el.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch(model, () => nextTick(resize))

// Лічильник у KField; оголошуємо лише, коли лишилось ≤ 20 символів.
watchEffect(() => {
  if (!props.showCount || props.maxlength === undefined) return
  control.counter.value = t('input.count', { n: model.value.length, max: props.maxlength })
})
watch(
  () => (props.maxlength === undefined ? null : props.maxlength - model.value.length),
  (left, prev) => {
    if (left !== null && left <= 20 && left !== prev && left % 5 === 0)
      announce(t('textarea.remain', { n: left }))
  },
)

function onKeydown(event: KeyboardEvent) {
  if (props.submitOnModEnter && event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    el.value?.form?.requestSubmit()
  }
}

defineExpose({ focus: () => el.value?.focus(), el })
</script>

<template>
  <div
    :class="
      cn(
        controlClasses({
          size: 'md',
          autoHeight: true,
          invalid: control.invalid.value,
          disabled: control.disabled.value,
          readonly: control.readonly.value,
        }),
        'k:items-stretch',
        attrs.class as string,
      )
    "
    :style="attrs.style as string"
    :data-invalid="control.invalid.value ? '' : undefined"
    :data-disabled="control.disabled.value ? '' : undefined"
  >
    <textarea
      ref="el"
      v-model="model"
      v-bind="{ ...textareaAttrs, ...control.ariaAttrs.value }"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="control.disabled.value"
      :readonly="control.readonly.value"
      :required="control.required.value"
      :class="
        cn(
          'k:w-full k:min-w-0 k:flex-1 k:resize-none k:border-0 k:bg-transparent k:px-0 k:text-inherit',
          'k:outline-none k:placeholder:text-fg-muted k:focus-visible:outline-none',
          'k:disabled:cursor-not-allowed',
          size === 'sm' ? 'k:py-1.5 k:text-body k:sm:text-body-sm' : 'k:py-2 k:text-body',
          !autosize && 'k:resize-y',
        )
      "
      @keydown="onKeydown"
    />
  </div>
</template>
