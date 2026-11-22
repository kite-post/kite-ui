<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, ref, useAttrs, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { controlClasses, nativeInputClasses } from '../field/control-styles'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Що розділяє значення. Клавіші — 'Enter', 'Tab'; символи — ',', ';', ' ', '\n'. */
    delimiters?: string[]
    /** Наприклад, номер → без пробілів, великими літерами. Типово trim. */
    normalize?: (raw: string) => string
    /** Текст помилки для невалідного чипа або true. */
    validate?: (value: string) => string | true
    allowDuplicates?: boolean
    max?: number
    size?: 'sm' | 'md'
    placeholder?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    delimiters: () => [',', ';', 'Enter', 'Tab', '\n', ' '],
    normalize: (raw: string) => raw.trim(),
    allowDuplicates: false,
    size: 'md',
    invalid: false,
    disabled: false,
    readonly: false,
  },
)

const model = defineModel<string[]>({ default: () => [] })
const emit = defineEmits<{ invalid: [values: string[]] }>()

const attrs = useAttrs()
const { t, announce } = useMessages()
const control = useFieldControl(props, `kite-tags-${useId()}`)
const errorBase = `kite-tags-${useId()}-err`

const input = ref<HTMLInputElement>()
const text = ref('')
/** Повідомлення про пропущені повтори / межу під полем. */
const note = ref('')
/** Виділений чип (для Backspace / Delete / стрілок); фокус лишається в полі. */
const active = ref<number | null>(null)

const keys = computed<string[]>(() => props.delimiters.filter((d) => d === 'Enter' || d === 'Tab'))
const chars = computed(() => props.delimiters.filter((d) => d.length === 1))
// Вставка розділяється ще й табуляцією: стовпець з Excel приходить через \n, рядок — через \t.
const splitter = computed(() => {
  const escaped = [...chars.value, '\t'].map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`[${escaped.join('')}\\r]+`)
})

const blocked = computed(() => control.disabled.value || control.readonly.value)
const atMax = computed(() => props.max !== undefined && model.value.length >= props.max)

const errors = computed(() =>
  model.value.map((v) => {
    const r = props.validate?.(v)
    return r === undefined || r === true ? null : r
  }),
)
watch(
  errors,
  (list) => {
    const bad = model.value.filter((_, i) => list[i] !== null)
    if (bad.length) emit('invalid', bad)
  },
  { immediate: true },
)

/** Додає значення з тексту; повертає, скільки додано. */
function commit(raw: string): number {
  const parts = raw
    .split(splitter.value)
    .map((p) => props.normalize(p))
    .filter(Boolean)
  if (!parts.length) return 0
  const next = [...model.value]
  let added = 0
  let duplicates = 0
  let overflow = false
  for (const p of parts) {
    if (!props.allowDuplicates && next.includes(p)) {
      duplicates++
      continue
    }
    if (props.max !== undefined && next.length >= props.max) {
      overflow = true
      break
    }
    next.push(p)
    added++
  }
  if (added) model.value = next
  const skipped = [
    duplicates ? t('tags.duplicates', { n: duplicates }) : '',
    overflow && props.max !== undefined ? t('tags.max', { n: props.max }) : '',
  ].filter(Boolean)
  note.value = skipped.join('. ')
  const spoken = [added ? t('tags.added', { n: added }) : '', ...skipped].filter(Boolean)
  if (spoken.length) announce(spoken.join('. '))
  return added
}

function remove(index: number, refocus = true) {
  const value = model.value[index]
  if (value === undefined) return
  model.value = model.value.filter((_, i) => i !== index)
  announce(t('tags.removed', { value }))
  active.value = null
  if (refocus) input.value?.focus()
}

function clearAll() {
  model.value = []
  active.value = null
  note.value = ''
  input.value?.focus()
}

function flush() {
  if (!text.value.trim()) return
  commit(text.value)
  text.value = ''
}

function onKeydown(event: KeyboardEvent) {
  if (blocked.value) return
  const caretAtStart = input.value?.selectionStart === 0 && input.value?.selectionEnd === 0
  const isKeyDelimiter = keys.value.includes(event.key)
  const isCharDelimiter = event.key.length === 1 && chars.value.includes(event.key)

  if (isKeyDelimiter || isCharDelimiter) {
    // Tab без тексту — звичайний перехід далі по формі.
    if (event.key === 'Tab' && !text.value.trim()) return
    if (isCharDelimiter || text.value.trim()) event.preventDefault()
    flush()
    return
  }

  const count = model.value.length
  switch (event.key) {
    case 'Backspace':
      if (!caretAtStart || !count) return
      event.preventDefault()
      if (active.value === null) active.value = count - 1
      else remove(active.value)
      return
    case 'Delete':
      if (active.value === null) return
      event.preventDefault()
      remove(active.value)
      return
    case 'ArrowLeft':
      if (!caretAtStart || !count) return
      event.preventDefault()
      active.value = active.value === null ? count - 1 : Math.max(0, active.value - 1)
      return
    case 'ArrowRight':
      if (active.value === null) return
      event.preventDefault()
      active.value = active.value + 1 < count ? active.value + 1 : null
      return
    case 'Escape':
      if (active.value === null) return
      event.preventDefault()
      active.value = null
      return
    default:
      active.value = null
  }
}

function onPaste(event: ClipboardEvent) {
  if (blocked.value) return
  const pasted = event.clipboardData?.getData('text') ?? ''
  if (!splitter.value.test(pasted)) return
  event.preventDefault()
  commit(text.value + pasted)
  text.value = ''
}

function onInput() {
  // Розділювач, що прийшов не з клавіатури (автозаповнення, IME), теж створює чип.
  if (splitter.value.test(text.value)) {
    const parts = text.value.split(splitter.value)
    const tail = parts.pop() ?? ''
    commit(parts.join(chars.value[0] ?? ','))
    text.value = tail
  }
}

const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="kite-tags-input k:grid k:min-w-0 k:gap-1">
    <div
      :class="
        cn(
          controlClasses({
            size,
            invalid: control.invalid.value,
            disabled: control.disabled.value,
            readonly: control.readonly.value,
            autoHeight: true,
          }),
          'k:flex-wrap k:items-center k:gap-1.5 k:py-1',
          size === 'sm' ? 'k:min-h-8' : 'k:min-h-10',
          attrs.class as string,
        )
      "
      :style="attrs.style as string"
      :data-size="size"
      :data-invalid="control.invalid.value ? '' : undefined"
      :data-disabled="control.disabled.value ? '' : undefined"
      @mousedown.self.prevent="input?.focus()"
    >
      <ul v-if="model.length" role="list" class="k:m-0 k:contents k:list-none k:p-0">
        <li
          v-for="(value, i) in model"
          :key="`${value}-${i}`"
          :data-active="active === i ? '' : undefined"
          :data-invalid="errors[i] ? '' : undefined"
          :aria-describedby="errors[i] ? `${errorBase}-${i}` : undefined"
          :class="
            cn(
              'kite-tag k:inline-flex k:h-6 k:max-w-full k:items-center k:gap-0.5 k:rounded-full k:border k:border-line-strong k:pr-0.5 k:pl-2 k:font-mono k:text-caption k:text-fg',
              'k:data-active:shadow-[0_0_0_2px_var(--kite-color-focus-ring)]',
              'k:data-invalid:border-danger-border k:data-invalid:bg-danger-subtle k:data-invalid:text-danger-text',
            )
          "
        >
          <span class="k:truncate">{{ value }}</span>
          <span v-if="errors[i]" :id="`${errorBase}-${i}`" class="k:sr-only">{{ errors[i] }}</span>
          <button
            v-if="!blocked"
            type="button"
            tabindex="-1"
            :aria-label="t('tags.remove', { value })"
            class="k:grid k:size-5 k:shrink-0 k:cursor-pointer k:place-items-center k:rounded-full k:border-0 k:bg-transparent k:text-inherit k:hover:bg-current/15"
            @click="remove(i)"
          >
            <KIcon :icon="X" size="xs" />
          </button>
        </li>
      </ul>
      <input
        ref="input"
        v-model="text"
        v-bind="{ ...inputAttrs, ...control.ariaAttrs.value }"
        type="text"
        enterkeyhint="enter"
        autocomplete="off"
        :placeholder="model.length ? undefined : placeholder"
        :disabled="control.disabled.value"
        :readonly="control.readonly.value || atMax"
        :class="cn(nativeInputClasses(size), 'k:h-6 k:min-w-24')"
        @keydown="onKeydown"
        @paste="onPaste"
        @input="onInput"
        @blur="(flush(), (active = null))"
      />
      <template v-if="model.length">
        <span
          class="kite-num k:ml-auto k:shrink-0 k:text-caption k:text-fg-muted"
          aria-hidden="true"
        >
          {{ model.length }}
        </span>
        <span class="k:sr-only">{{ t('tags.count', { n: model.length }) }}</span>
        <button
          v-if="!blocked"
          type="button"
          class="k:shrink-0 k:cursor-pointer k:rounded-full k:border-0 k:bg-transparent k:px-1.5 k:text-caption k:font-semibold k:text-fg-muted k:hover:text-fg"
          @click="clearAll"
        >
          {{ t('tags.clearAll') }}
        </button>
      </template>
    </div>
    <p v-if="note" class="k:m-0 k:text-caption k:text-fg-muted">{{ note }}</p>
  </div>
</template>
