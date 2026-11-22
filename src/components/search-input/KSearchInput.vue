<script setup lang="ts">
import { Search } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import type { ControlSize } from '../field/control-styles'
import KIcon from '../icon/KIcon.vue'
import KInput from '../input/KInput.vue'
import KKbd from '../kbd/KKbd.vue'
import KSpinner from '../spinner/KSpinner.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Затримка події search, мс. */
    debounce?: number
    /** Клавіша для фокусу з будь-якого місця: '/', 'mod+k'. */
    shortcut?: string
    loading?: boolean
    variant?: 'outline' | 'filled'
    size?: ControlSize
    placeholder?: string
    /** Доступна назва: видимого підпису в пошуку зазвичай немає. */
    label?: string
    disabled?: boolean
    class?: string
  }>(),
  { debounce: 250, loading: false, variant: 'outline', size: 'md', disabled: false },
)

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ search: [query: string]; clear: [] }>()

const { t } = useMessages()
const input = ref<InstanceType<typeof KInput>>()
const focused = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
function schedule(value: string) {
  clearTimeout(timer)
  if (props.debounce <= 0) emit('search', value)
  else timer = setTimeout(() => emit('search', value), props.debounce)
}
const value = computed({
  get: () => model.value,
  set: (v: string) => {
    model.value = v
    schedule(v)
  },
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    clearTimeout(timer)
    emit('search', model.value)
  } else if (event.key === 'Escape' && !model.value) {
    // Непорожнє поле очищає сам KInput (і подія clear), порожнє — знімаємо фокус.
    ;(event.target as HTMLElement).blur()
  }
}

function clear() {
  model.value = ''
  clearTimeout(timer)
  emit('clear')
  emit('search', '')
}

// ——— Гаряча клавіша ———
const keys = computed(() => props.shortcut?.split('+').map((k) => k.trim().toLowerCase()) ?? [])
function isTyping(el: EventTarget | null) {
  const node = el as HTMLElement | null
  return !!node && (node.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(node.tagName))
}
function onGlobalKeydown(event: KeyboardEvent) {
  if (!keys.value.length || props.disabled || isTyping(event.target)) return
  const key = keys.value[keys.value.length - 1]
  const needMod = keys.value.includes('mod')
  const mod = event.metaKey || event.ctrlKey
  if (event.key.toLowerCase() !== key || needMod !== mod) return
  event.preventDefault()
  input.value?.focus()
}
onMounted(() => document.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobalKeydown)
  clearTimeout(timer)
})

const showHint = computed(() => keys.value.length && !focused.value && !model.value)

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div role="search" :class="cn('kite-search k:min-w-0', props.class)">
    <KInput
      ref="input"
      v-model="value"
      v-bind="$attrs"
      type="search"
      :size="size"
      :placeholder="placeholder ?? t('search.placeholder')"
      :aria-label="label ?? t('search.label')"
      :disabled="disabled"
      clearable
      enterkeyhint="search"
      autocomplete="off"
      :class="
        cn(
          variant === 'filled' &&
            'k:border-transparent k:bg-surface-hover k:focus-within:bg-surface k:hover:border-transparent',
        )
      "
      @keydown="onKeydown"
      @focus="focused = true"
      @blur="focused = false"
      @clear="clear"
    >
      <template #leading>
        <KSpinner v-if="loading" decorative size="sm" class="k:text-fg-muted" />
        <KIcon v-else :icon="Search" :size="size === 'sm' ? 'sm' : 'md'" class="k:text-fg-muted" />
      </template>
      <template v-if="showHint" #trailing>
        <KKbd :keys="keys" class="k:pointer-events-none" />
      </template>
    </KInput>
  </div>
</template>
