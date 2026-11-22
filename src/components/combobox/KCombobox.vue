<script setup lang="ts">
import { Check, ChevronDown, Plus, X } from '@lucide/vue'
import {
  ComboboxAnchor,
  ComboboxCancel,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { computed, onBeforeUnmount, ref, useAttrs, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { normalizeSearch } from '../../lib/intl'
import { controlClasses, nativeInputClasses, type ControlSize } from '../field/control-styles'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'
import type { SelectOption } from '../select/KSelect.vue'
import KSpinner from '../spinner/KSpinner.vue'

defineOptions({ inheritAttrs: false })

export type ComboboxOption = SelectOption
type Value = string | null | string[]

const props = withDefaults(
  defineProps<{
    options?: ComboboxOption[]
    /** Текст у полі (v-model:search). */
    search?: string
    /** 'auto' — локальний пошук без урахування регістру й апострофів; false — фільтрує сервер. */
    filter?: 'auto' | false | ((option: ComboboxOption, query: string) => boolean)
    loading?: boolean
    /** Для віддалених джерел — зазвичай 2. */
    minSearchLength?: number
    multiple?: boolean
    maxVisibleChips?: number
    /** Пункт «Додати „…“» і подія create. */
    allowCustom?: boolean
    /** Затримка update:search, коли filter=false. */
    debounce?: number
    /** Текст у полі після вибору. */
    displayValue?: (option: ComboboxOption) => string
    clearable?: boolean
    size?: ControlSize
    placeholder?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    options: () => [],
    search: undefined,
    filter: 'auto',
    loading: false,
    minSearchLength: 0,
    multiple: false,
    maxVisibleChips: 3,
    allowCustom: false,
    debounce: 250,
    clearable: false,
    size: 'md',
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

const model = defineModel<Value>({ default: null })
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ 'update:search': [query: string]; create: [text: string] }>()
defineSlots<{
  item?(props: { option: ComboboxOption; selected: boolean; query: string }): unknown
  empty?(): unknown
  footer?(): unknown
}>()

const attrs = useAttrs()
const { t, announce } = useMessages()
const control = useFieldControl(props, `kite-combobox-${useId()}`)
const CREATE = '\u0000kite-create'

// ——— Значення ———
// Запам'ятовуємо побачені варіанти: віддалений список міняється, а чипи й текст поля мають лишитися.
const known = new Map<string, ComboboxOption>()
watch(
  () => props.options,
  (list) => list.forEach((o) => known.set(o.value, o)),
  { immediate: true },
)
const labelOf = (value: string) => {
  const o = known.get(value)
  return o ? (props.displayValue?.(o) ?? o.label) : value
}

const selectedValues = computed<string[]>(() =>
  Array.isArray(model.value) ? model.value : model.value === null ? [] : [model.value],
)

const value = computed({
  get: () => (props.multiple ? selectedValues.value : (model.value ?? undefined)),
  set: (v: string | string[] | undefined) => {
    if (Array.isArray(v)) {
      if (v.includes(CREATE)) {
        emit('create', query.value.trim())
        model.value = v.filter((x) => x !== CREATE)
        return
      }
      model.value = v
      return
    }
    if (v === CREATE) {
      emit('create', query.value.trim())
      return
    }
    model.value = v ?? null
    typed.value = ''
  },
})

// ——— Пошук ———
const query = ref(props.search ?? '')
/** Те, що людина надрукувала (а не текст обраного варіанта в полі). */
const typed = ref('')
watch(
  () => props.search,
  (s) => {
    if (s !== undefined && s !== query.value) query.value = s
  },
)

let timer: ReturnType<typeof setTimeout> | undefined
function onInput() {
  typed.value = query.value
  navigating.value = false
  applyPending()
  clearTimeout(timer)
  if (props.filter === false && props.debounce > 0)
    timer = setTimeout(() => emit('update:search', query.value), props.debounce)
  else emit('update:search', query.value)
}
onBeforeUnmount(() => clearTimeout(timer))

// ——— Стабільний порядок віддалених результатів ———
// Поки людина рухається стрілками, нова відповідь API чекає (специфікація combobox.md).
const navigating = ref(false)
const shown = ref<ComboboxOption[]>(props.options)
let pending: ComboboxOption[] | null = null
watch(
  () => props.options,
  (list) => {
    if (navigating.value) pending = list
    else shown.value = list
  },
)
function applyPending() {
  if (pending) shown.value = pending
  pending = null
}

const tooShort = computed(
  () => props.minSearchLength > 0 && typed.value.trim().length < props.minSearchLength,
)

const filtered = computed(() => {
  if (tooShort.value) return []
  const q = typed.value.trim()
  if (!q || props.filter === false) return shown.value
  if (typeof props.filter === 'function')
    return shown.value.filter((o) =>
      (props.filter as (o: ComboboxOption, q: string) => boolean)(o, q),
    )
  const nq = normalizeSearch(q)
  return shown.value.filter((o) =>
    normalizeSearch(`${o.label} ${o.description ?? ''}`).includes(nq),
  )
})

const groups = computed(() => {
  const map = new Map<string, ComboboxOption[]>()
  for (const o of filtered.value) {
    const key = o.group ?? ''
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(o)
  }
  return [...map.entries()].map(([label, items]) => ({ label, items }))
})

const canCreate = computed(() => {
  const text = typed.value.trim()
  if (!props.allowCustom || !text || props.loading) return false
  const n = normalizeSearch(text)
  return !shown.value.some((o) => normalizeSearch(o.label) === n)
})

/** Частини підпису з позначеним збігом (вага 600, без зміни кольору). */
function highlight(label: string): { text: string; match: boolean }[] {
  const q = typed.value.trim()
  if (!q) return [{ text: label, match: false }]
  const at = normalizeSearch(label).indexOf(normalizeSearch(q))
  if (at < 0) return [{ text: label, match: false }]
  return [
    { text: label.slice(0, at), match: false },
    { text: label.slice(at, at + q.length), match: true },
    { text: label.slice(at + q.length), match: false },
  ].filter((p) => p.text)
}

// Кількість результатів — скрінрідеру, з паузою, щоб не говорити на кожну літеру.
let announceTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => [filtered.value.length, open.value, props.loading] as const,
  ([n, isOpen, loading]) => {
    clearTimeout(announceTimer)
    if (!isOpen || loading || tooShort.value || !typed.value) return
    announceTimer = setTimeout(
      () => announce(n ? t('combobox.results', { n }) : t('combobox.empty')),
      600,
    )
  },
)
onBeforeUnmount(() => clearTimeout(announceTimer))

// ——— Відкриття й клавіатура ———
const isOpen = computed({
  get: () => !control.readonly.value && open.value,
  set: (v: boolean) => {
    if (control.readonly.value) return
    open.value = v
    if (!v) {
      typed.value = ''
      navigating.value = false
      applyPending()
    }
  },
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') navigating.value = true
  if (event.key === 'Backspace' && props.multiple && !query.value && selectedValues.value.length) {
    removeChip(selectedValues.value[selectedValues.value.length - 1]!)
  }
}

function removeChip(v: string) {
  model.value = selectedValues.value.filter((x) => x !== v)
}

const visibleChips = computed(() => selectedValues.value.slice(0, props.maxVisibleChips))
const hiddenChips = computed(() => selectedValues.value.length - visibleChips.value.length)

const canClear = computed(
  () =>
    props.clearable &&
    !control.disabled.value &&
    !control.readonly.value &&
    (selectedValues.value.length > 0 || !!query.value),
)

const inputDisplay = (v: unknown) => (props.multiple || typeof v !== 'string' ? '' : labelOf(v))

const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
// Reka лишає aria-activedescendant на пункт, якого після закриття вже немає в DOM.
const closedAria = computed(() => (isOpen.value ? {} : { 'aria-activedescendant': undefined }))

const iconButton =
  'k:grid k:size-6 k:shrink-0 k:cursor-pointer k:place-items-center k:rounded-full k:border-0 k:bg-transparent k:text-fg-muted k:hover:bg-surface-hover k:hover:text-fg'
const itemClass =
  'kite-combobox-item k:relative k:flex k:min-h-10 k:cursor-pointer k:items-center k:gap-2.5 k:rounded-sm k:py-2 k:pr-9 k:pl-3 k:text-body-sm k:text-fg k:outline-none k:select-none k:data-disabled:cursor-not-allowed k:data-disabled:text-fg-disabled k:data-highlighted:bg-surface-hover'
const statusClass =
  'k:flex k:min-h-10 k:items-center k:gap-2 k:px-3 k:py-2 k:text-body-sm k:text-fg-muted'
</script>

<template>
  <ComboboxRoot
    v-model="value"
    v-model:open="isOpen"
    :multiple="multiple"
    ignore-filter
    :disabled="control.disabled.value"
    :required="control.required.value"
    :reset-model-value-on-clear="clearable && !multiple"
    :class="cn('kite-combobox k:relative k:min-w-0', attrs.class as string)"
    :style="attrs.style as string"
  >
    <ComboboxAnchor
      :class="
        cn(
          controlClasses({
            size,
            invalid: control.invalid.value,
            disabled: control.disabled.value,
            readonly: control.readonly.value,
            autoHeight: multiple,
          }),
          multiple && 'k:flex-wrap k:gap-1.5 k:py-1',
          multiple && (size === 'sm' ? 'k:min-h-8' : size === 'lg' ? 'k:min-h-12' : 'k:min-h-10'),
        )
      "
      :data-size="size"
      :data-invalid="control.invalid.value ? '' : undefined"
      :data-disabled="control.disabled.value ? '' : undefined"
    >
      <template v-if="multiple">
        <span
          v-for="v in visibleChips"
          :key="v"
          class="kite-combobox-chip k:inline-flex k:h-6 k:max-w-48 k:items-center k:gap-0.5 k:rounded-full k:border k:border-line-strong k:pr-0.5 k:pl-2 k:text-caption k:font-medium k:text-fg"
        >
          <span class="k:truncate">{{ labelOf(v) }}</span>
          <button
            v-if="!control.disabled.value && !control.readonly.value"
            type="button"
            tabindex="-1"
            :aria-label="t('combobox.removeChip', { label: labelOf(v) })"
            :class="cn(iconButton, 'k:size-5 k:text-inherit k:hover:bg-current/15')"
            @click.stop="removeChip(v)"
          >
            <KIcon :icon="X" size="xs" />
          </button>
        </span>
        <span
          v-if="hiddenChips > 0"
          class="kite-num k:inline-flex k:h-6 k:items-center k:rounded-full k:bg-bg-subtle k:px-2 k:text-caption k:font-semibold k:text-fg-muted"
        >
          {{ t('combobox.more', { n: hiddenChips }) }}
        </span>
      </template>
      <ComboboxInput
        v-model="query"
        v-bind="{ ...inputAttrs, ...control.ariaAttrs.value, ...closedAria }"
        :display-value="inputDisplay"
        :placeholder="multiple && selectedValues.length ? undefined : placeholder"
        :readonly="control.readonly.value"
        :class="cn(nativeInputClasses(size), multiple && 'k:h-6 k:min-w-16')"
        @input="onInput"
        @keydown="onKeydown"
      />
      <KSpinner v-if="loading" decorative size="sm" class="k:text-fg-muted" />
      <ComboboxCancel
        v-if="canClear"
        :aria-label="t('combobox.clear')"
        tabindex="-1"
        :class="iconButton"
        @click="multiple ? (model = []) : undefined"
      >
        <KIcon :icon="X" size="sm" />
      </ComboboxCancel>
      <ComboboxTrigger
        v-if="!control.readonly.value"
        tabindex="-1"
        :class="cn(iconButton, 'k:group/trigger k:hover:bg-transparent')"
      >
        <KIcon
          :icon="ChevronDown"
          :size="size === 'sm' ? 'sm' : 'md'"
          class="k:transition-transform k:duration-200 k:group-data-[state=open]/trigger:rotate-180"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        :side-offset="4"
        :collision-padding="8"
        class="kite-combobox-content kite-pop k:z-[1000] k:flex k:max-h-[min(22rem,var(--reka-combobox-content-available-height))] k:min-w-(--reka-combobox-trigger-width) k:flex-col k:overflow-hidden k:rounded-md k:border k:border-raised-border k:bg-surface-raised k:shadow-lg"
      >
        <ComboboxViewport class="k:min-h-0 k:flex-1 k:overflow-y-auto k:p-1">
          <div v-if="loading && !filtered.length" :class="statusClass">
            <KSpinner decorative size="sm" />{{ t('combobox.loading') }}
          </div>
          <div v-else-if="tooShort" :class="statusClass">
            {{ t('combobox.minLength', { n: minSearchLength }) }}
          </div>
          <div v-else-if="!filtered.length && !canCreate" :class="statusClass">
            <slot name="empty">{{ t('combobox.empty') }}</slot>
          </div>
          <template v-for="(g, gi) in groups" :key="g.label || gi">
            <ComboboxSeparator v-if="gi > 0" class="k:my-1 k:h-px k:bg-line" />
            <ComboboxGroup>
              <ComboboxLabel
                v-if="g.label"
                class="k:px-3 k:pt-2 k:pb-1 k:text-overline k:text-fg-muted k:uppercase"
              >
                {{ g.label }}
              </ComboboxLabel>
              <ComboboxItem
                v-for="o in g.items"
                :key="o.value"
                :value="o.value"
                :text-value="o.label"
                :disabled="o.disabled"
                :class="itemClass"
              >
                <slot
                  name="item"
                  :option="o"
                  :selected="selectedValues.includes(o.value)"
                  :query="typed"
                >
                  <KIcon v-if="o.icon" :icon="o.icon" size="sm" class="k:text-fg-muted" />
                  <span class="k:min-w-0 k:flex-1">
                    <span class="k:block"
                      ><template v-for="(p, pi) in highlight(o.label)" :key="pi"
                        ><mark
                          v-if="p.match"
                          class="k:bg-transparent k:font-semibold k:text-inherit"
                          >{{ p.text }}</mark
                        ><template v-else>{{ p.text }}</template></template
                      ></span
                    >
                    <span v-if="o.description" class="k:block k:text-caption k:text-fg-muted">
                      {{ o.description }}
                    </span>
                  </span>
                </slot>
                <ComboboxItemIndicator class="k:absolute k:right-3 k:inline-flex">
                  <KIcon :icon="Check" size="sm" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            </ComboboxGroup>
          </template>
          <ComboboxItem v-if="canCreate" :value="CREATE" :text-value="typed" :class="itemClass">
            <KIcon :icon="Plus" size="sm" class="k:text-fg-muted" />
            {{ t('combobox.create', { text: typed.trim() }) }}
          </ComboboxItem>
        </ComboboxViewport>
        <div v-if="$slots.footer" class="k:shrink-0 k:border-t k:border-line k:p-1">
          <slot name="footer" />
        </div>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
