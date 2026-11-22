<script setup lang="ts">
import { CircleCheck, ScanLine } from '@lucide/vue'
import { computed, nextTick, ref, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import { formatTrackingNumber, isValidS10, parseTrackingNumber } from '../../lib/format'
import { caretAfter, countMeaningful, skipSeparatorOnBackspace } from '../../lib/mask'
import type { ControlSize } from '../field/control-styles'
import KIconButton from '../icon-button/KIconButton.vue'
import KIcon from '../icon/KIcon.vue'
import KInput from '../input/KInput.vue'

defineOptions({ inheritAttrs: false })

export type TrackingValidity = 'empty' | 'incomplete' | 'bad-format' | 'bad-check-digit' | 'valid'

withDefaults(
  defineProps<{
    /** Кнопка «Сканувати» (подія scan). */
    scan?: boolean
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
    scan: false,
    placeholder: 'KT 1234 5678 5 UA',
    clearable: false,
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

/** 'KT123456785UA' (без пробілів, великі літери); неповний — null. */
const model = defineModel<string | null>({ default: null })
const emit = defineEmits<{
  validity: [state: TrackingValidity]
  scan: []
  complete: [value: string]
}>()

const { t, announce } = useMessages()
const hintId = `kite-tracking-${useId()}-hint`
const input = ref<InstanceType<typeof KInput>>()
const ALNUM = /[A-Z0-9]/

/** Лише символи на своїх місцях: 2 літери, 9 цифр, 2 літери; решта відкидається. */
function sanitize(raw: string): string {
  let out = ''
  for (const ch of raw.toUpperCase()) {
    if (out.length >= 13) break
    const i = out.length
    const wantLetter = i < 2 || i >= 11
    if (wantLetter ? /[A-Z]/.test(ch) : /\d/.test(ch)) out += ch
  }
  return out
}

const raw = ref(sanitize(model.value ?? ''))
watch(model, (v) => {
  const current = raw.value.length === 13 ? raw.value : null
  if (v !== current) raw.value = sanitize(v ?? '')
})

const validity = computed<TrackingValidity>(() => {
  const v = raw.value
  if (!v) return 'empty'
  if (v.length < 13) return 'incomplete'
  if (!/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(v)) return 'bad-format'
  return isValidS10(v) ? 'valid' : 'bad-check-digit'
})

watch(validity, (state) => {
  emit('validity', state)
  if (state === 'valid') {
    announce(t('tracking.valid'))
    emit('complete', raw.value)
  }
})

function commit(next: string, caretCount: number) {
  raw.value = next
  model.value = next.length === 13 ? next : null
  const el = input.value?.el as HTMLInputElement | undefined
  nextTick(() => {
    if (!el || document.activeElement !== el) return
    const shown = formatTrackingNumber(next)
    el.value = shown
    const pos = caretAfter(shown, Math.min(caretCount, next.length), ALNUM)
    el.setSelectionRange(pos, pos)
  })
}

const value = computed({
  get: () => formatTrackingNumber(raw.value),
  set: (text: string) => {
    const el = input.value?.el as HTMLInputElement | undefined
    const caret = el?.selectionStart ?? text.length
    const next = sanitize(text)
    commit(next, countMeaningful(text.toUpperCase(), caret, ALNUM))
  },
})

// Вставка з тексту («Ваша посилка KT123456785UA прямує…») — беремо перший номер.
function onPaste(event: ClipboardEvent) {
  const found = parseTrackingNumber(event.clipboardData?.getData('text') ?? '')
  if (!found) return
  event.preventDefault()
  commit(found, 13)
}

function onKeydown(event: KeyboardEvent) {
  skipSeparatorOnBackspace(event)
  if (event.key === 'Enter' && validity.value === 'valid') emit('complete', raw.value)
}

defineExpose({ focus: () => input.value?.focus(), validity })
</script>

<template>
  <KInput
    :id="id"
    ref="input"
    v-model="value"
    v-bind="$attrs"
    type="text"
    inputmode="text"
    autocapitalize="characters"
    autocomplete="off"
    :spellcheck="false"
    :size="size"
    :placeholder="placeholder"
    :clearable="clearable"
    :invalid="invalid"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :aria-describedby="hintId"
    :data-valid="validity === 'valid' ? '' : undefined"
    class="kite-tracking-input k:font-mono"
    @keydown="onKeydown"
    @paste="onPaste"
  >
    <template #trailing>
      <span :id="hintId" class="k:sr-only">{{ t('tracking.format') }}</span>
      <KIcon
        v-if="validity === 'valid'"
        :icon="CircleCheck"
        :size="size === 'sm' ? 'sm' : 'md'"
        :label="t('tracking.valid')"
        class="k:text-success-text"
      />
      <KIconButton
        v-if="scan"
        :icon="ScanLine"
        :label="t('tracking.scan')"
        size="sm"
        :disabled="disabled"
        class="k:-mr-1.5"
        @click="emit('scan')"
      />
    </template>
  </KInput>
</template>
