<script setup lang="ts">
import { PinInputInput, PinInputRoot } from 'reka-ui'
import { computed, nextTick, ref, useId } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { useFieldControl } from '../field/context'

const props = withDefaults(
  defineProps<{
    length?: number
    /** Розбиття на групи: [3, 3] → «482 913». */
    groups?: number[]
    type?: 'numeric' | 'alphanumeric'
    /** Показувати • замість символів. */
    mask?: boolean
    /** autocomplete="one-time-code" для кодів із SMS. */
    otp?: boolean
    size?: 'md' | 'lg'
    name?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    required?: boolean
    class?: string
  }>(),
  {
    length: 6,
    type: 'numeric',
    mask: false,
    otp: false,
    size: 'md',
    invalid: false,
    disabled: false,
    required: false,
  },
)

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ complete: [value: string] }>()

const { t } = useMessages()
const control = useFieldControl(props, `kite-pin-${useId()}`)
const root = ref<{ $el: HTMLElement }>()

const allowed = computed(() => (props.type === 'numeric' ? /[0-9]/ : /[0-9a-zA-Z]/))
const sanitize = (raw: string) =>
  [...raw]
    .filter((c) => allowed.value.test(c))
    .join('')
    .slice(0, props.length)
const normalizeCase = (v: string) => (props.type === 'alphanumeric' ? v.toUpperCase() : v)

// Reka тримає масив символів за комірками, кіт — рядок без пробілів.
const cells = computed({
  get: () => [...model.value],
  set: (v: string[]) => {
    const next = normalizeCase(sanitize(v.map((c) => c ?? '').join('')))
    model.value = next
    if (next.length === props.length) emit('complete', next)
  },
})

// Індекси, після яких іде проміжок між групами.
const groupEnds = computed(() => {
  const ends = new Set<number>()
  let acc = 0
  for (const g of props.groups ?? []) {
    acc += g
    if (acc < props.length) ends.add(acc - 1)
  }
  return ends
})

function inputs(): HTMLInputElement[] {
  const el = root.value?.$el as HTMLElement | undefined
  return el ? ([...el.querySelectorAll('input:not([type="hidden"])')] as HTMLInputElement[]) : []
}

// Вставка в будь-яку комірку заповнює всі; пробіли, дефіси та інше відкидаємо (WCAG 3.3.8).
async function onPaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text') ?? ''
  event.preventDefault()
  event.stopPropagation()
  cells.value = [...sanitize(text)]
  await nextTick()
  const list = inputs()
  list[Math.min(model.value.length, props.length - 1)]?.focus()
}

// Home / End — перша й остання комірки.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Home' && event.key !== 'End') return
  const list = inputs()
  event.preventDefault()
  ;(event.key === 'Home' ? list[0] : list[list.length - 1])?.focus()
}

// Неприпустимий символ не потрапляє в комірку (для alphanumeric Reka приймає будь-що).
function onBeforeInput(event: InputEvent) {
  if (event.data && !allowed.value.test(event.data)) event.preventDefault()
}

defineExpose({ focus: () => inputs()[0]?.focus() })

const cellSize = {
  md: 'k:w-(--kite-pin-cell-w-md) k:h-(--kite-pin-cell-h-md)',
  lg: 'k:w-(--kite-pin-cell-w-lg) k:h-(--kite-pin-cell-h-lg)',
}
</script>

<template>
  <PinInputRoot
    ref="root"
    v-model="cells"
    type="text"
    :mask="mask"
    :otp="otp"
    :name="name"
    :disabled="control.disabled.value"
    :required="control.required.value"
    role="group"
    :aria-labelledby="control.field ? control.field.labelId.value : undefined"
    :aria-describedby="control.field?.describedBy.value"
    :data-invalid="control.invalid.value ? '' : undefined"
    :class="
      cn(
        'kite-pin-input k:inline-flex k:items-center k:gap-2',
        'k:[--kite-pin-cell-h-lg:4rem] k:[--kite-pin-cell-h-md:3.5rem] k:[--kite-pin-cell-w-lg:3.5rem] k:[--kite-pin-cell-w-md:3rem]',
        props.class,
      )
    "
    @paste.capture="onPaste"
    @keydown="onKeydown"
    @beforeinput.capture="onBeforeInput"
  >
    <template v-for="i in length" :key="i">
      <PinInputInput
        :id="i === 1 ? control.id.value : undefined"
        :index="i - 1"
        :aria-label="t('pin.cell', { i, n: length })"
        :aria-invalid="control.invalid.value ? 'true' : undefined"
        :inputmode="type === 'numeric' ? 'numeric' : 'text'"
        :autocapitalize="type === 'alphanumeric' ? 'characters' : undefined"
        :class="
          cn(
            'kite-pin-cell k:rounded-sm k:border k:border-line-input k:bg-surface k:p-0 k:text-center k:font-mono k:text-mono-lg k:text-fg k:uppercase k:caret-transparent',
            'k:transition-[border-color,box-shadow] k:duration-100 k:outline-none k:hover:border-line-input-hover',
            'k:focus:border-line-focus k:focus:shadow-[0_0_0_1px_var(--kite-color-border-focus)]',
            control.invalid.value &&
              'k:border-danger-text k:text-danger-text k:hover:border-danger-text k:focus:border-danger-text k:focus:shadow-[0_0_0_1px_var(--kite-color-danger-text)]',
            'k:disabled:cursor-not-allowed k:disabled:border-line k:disabled:bg-bg-subtle k:disabled:text-fg-disabled',
            cellSize[size],
          )
        "
      />
      <span v-if="groupEnds.has(i - 1)" class="k:w-0 k:shrink-0" aria-hidden="true" />
    </template>
  </PinInputRoot>
</template>
