<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import { groupPhone, isValidUaMobile, parsePhone, phoneDigits } from '../../lib/format'
import { caretAfter, skipSeparatorOnBackspace } from '../../lib/mask'
import type { ControlSize } from '../field/control-styles'
import KInput from '../input/KInput.vue'

defineOptions({ inheritAttrs: false })

export type PhoneValidity = 'empty' | 'incomplete' | 'invalid-operator' | 'valid'

withDefaults(
  defineProps<{
    size?: ControlSize
    placeholder?: string
    clearable?: boolean
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    placeholder: '67 123 45 67',
    clearable: false,
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

/** E.164: '+380671234567'; неповний номер — null. */
const model = defineModel<string | null>({ default: null })
const emit = defineEmits<{ validity: [state: PhoneValidity] }>()

const { t } = useMessages()
const hintId = `kite-phone-${useId()}-hint`
const input = ref<InstanceType<typeof KInput>>()
const display = ref(model.value ? groupPhone(phoneDigits(model.value)) : '')
const DIGIT = /\d/

watch(model, (v) => {
  if (parsePhone(display.value) !== v) display.value = v ? groupPhone(phoneDigits(v)) : ''
})

const validity = computed<PhoneValidity>(() => {
  const d = phoneDigits(display.value)
  if (!d) return 'empty'
  if (d.length < 9) return 'incomplete'
  return isValidUaMobile(`+380${d}`) ? 'valid' : 'invalid-operator'
})
const touched = ref(false)
watch(validity, (v) => touched.value && emit('validity', v))

const value = computed({
  get: () => display.value,
  set: (raw: string) => {
    const el = input.value?.el as HTMLInputElement | undefined
    const caret = el?.selectionStart ?? raw.length
    // Вставка «+38 (067) …» чи «067…»: цифри до курсора рахуємо вже після зрізання префікса.
    const before = phoneDigits(raw.slice(0, caret)).length
    const digits = phoneDigits(raw)
    const next = groupPhone(digits)
    display.value = next
    model.value = digits.length === 9 ? `+380${digits}` : null
    nextTick(() => {
      if (!el || document.activeElement !== el) return
      el.value = next
      const pos = caretAfter(next, Math.min(before, digits.length), DIGIT)
      el.setSelectionRange(pos, pos)
    })
  },
})

function onBlur() {
  touched.value = true
  emit('validity', validity.value)
}

defineExpose({ focus: () => input.value?.focus(), validity })
</script>

<template>
  <KInput
    :id="id"
    ref="input"
    v-model="value"
    v-bind="$attrs"
    type="tel"
    inputmode="tel"
    autocomplete="tel-national"
    :size="size"
    :placeholder="placeholder"
    :clearable="clearable"
    :invalid="invalid"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :aria-describedby="hintId"
    class="kite-phone-input kite-num"
    @keydown="skipSeparatorOnBackspace"
    @blur="onBlur"
  >
    <template #leading>
      <span
        class="k:-ml-0.5 k:flex k:shrink-0 k:items-center k:self-stretch k:border-r k:border-line k:pr-2 k:leading-[inherit] k:text-fg-muted"
        aria-hidden="true"
        >+380</span
      >
      <span :id="hintId" class="k:sr-only">{{ t('phone.prefixHint') }}</span>
    </template>
  </KInput>
</template>
