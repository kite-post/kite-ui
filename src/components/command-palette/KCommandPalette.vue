<script setup lang="ts">
import { ChevronRight, Package, Search } from '@lucide/vue'
import {
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxViewport,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import { useMessages } from '../../config/context'
import { formatTrackingNumber, parseTrackingNumber } from '../../lib/format'
import KIcon from '../icon/KIcon.vue'
import KKbd from '../kbd/KKbd.vue'
import KSpinner from '../spinner/KSpinner.vue'
import type { CommandItem, CommandSource } from './types'

const props = withDefaults(
  defineProps<{
    sources: CommandSource[]
    /** Глобальна клавіша відкриття; false — без неї. */
    shortcut?: string | false
    /** Ключ localStorage для нещодавніх. */
    recentKey?: string
    placeholder?: string
    /** Номер накладної в запиті → перший пункт «Відкрити KT …». */
    openShipment?: (number: string) => void
    /** Затримка для асинхронних джерел, мс. */
    debounce?: number
  }>(),
  { shortcut: 'mod+k', recentKey: 'kite-cmd-recent', debounce: 200 },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ select: [item: CommandItem] }>()

const { t, announce } = useMessages()
const query = ref('')
const stack = shallowRef<{ source: CommandSource; label: string }[]>([])
const results = shallowRef(new Map<string, CommandItem[]>())
const loading = ref(false)

// ——— Нещодавні: у пам'яті з обробниками, у localStorage — лише підписи ———
interface Recent {
  id: string
  label: string
  description?: string
  sourceId: string
}
const memory = new Map<string, CommandItem>()
function readRecent(): Recent[] {
  try {
    return JSON.parse(localStorage.getItem(props.recentKey) ?? '[]') as Recent[]
  } catch {
    return []
  }
}
const recent = ref<Recent[]>(readRecent())
function remember(item: CommandItem, sourceId: string) {
  memory.set(`${sourceId}:${item.id}`, item)
  const entry: Recent = {
    id: item.id,
    label: item.label,
    sourceId,
    ...(item.description ? { description: item.description } : {}),
  }
  recent.value = [
    entry,
    ...recent.value.filter((r) => !(r.id === item.id && r.sourceId === sourceId)),
  ].slice(0, 5)
  try {
    localStorage.setItem(props.recentKey, JSON.stringify(recent.value))
  } catch {
    /* приватний режим */
  }
}

// ——— Пошук ———
const activeSources = computed(() => {
  const top = stack.value[stack.value.length - 1]
  return top ? [top.source] : props.sources
})
let controller: AbortController | undefined
let timer: ReturnType<typeof setTimeout> | undefined

async function run(q: string) {
  controller?.abort()
  controller = new AbortController()
  const signal = controller.signal
  const next = new Map<string, CommandItem[]>()
  const pending: Promise<void>[] = []
  for (const source of activeSources.value) {
    if (q.length < (source.minQueryLength ?? 0)) continue
    const out = source.search(q, signal)
    if (out instanceof Promise)
      pending.push(
        out.then(
          (items) => {
            if (!signal.aborted) next.set(source.id, items)
          },
          () => {},
        ),
      )
    else next.set(source.id, out)
  }
  // Локальні джерела — одразу, віддалені — коли відповідять; старі результати лишаються.
  if (!pending.length) {
    results.value = next
    loading.value = false
    return
  }
  results.value = new Map([...results.value, ...next])
  loading.value = true
  await Promise.all(pending)
  if (signal.aborted) return
  results.value = next
  loading.value = false
}

// Пауза у вводі перед запитом; попередні запити скасовуються через AbortSignal.
watch(query, (q) => {
  clearTimeout(timer)
  timer = setTimeout(() => void run(q.trim()), q ? props.debounce : 0)
})
watch(
  open,
  (v) => {
    if (v) {
      recent.value = readRecent()
      void run('')
    } else {
      query.value = ''
      stack.value = []
      controller?.abort()
    }
  },
  { immediate: true },
)

const tracking = computed(() =>
  props.openShipment && !stack.value.length ? parseTrackingNumber(query.value) : null,
)

const groups = computed(() => {
  const out: {
    id: string
    label: string
    items: { key: string; item: CommandItem; sourceId: string }[]
  }[] = []
  if (!query.value && !stack.value.length && recent.value.length) {
    out.push({
      id: '__recent',
      label: t('command.recent'),
      items: recent.value.map((r) => ({
        key: `recent:${r.sourceId}:${r.id}`,
        sourceId: r.sourceId,
        item: memory.get(`${r.sourceId}:${r.id}`) ?? {
          id: r.id,
          label: r.label,
          ...(r.description ? { description: r.description } : {}),
          onSelect: () => void replay(r),
        },
      })),
    })
  }
  for (const source of activeSources.value) {
    const items = results.value.get(source.id)
    if (items?.length)
      out.push({
        id: source.id,
        label: source.label,
        items: items.map((item) => ({ key: `${source.id}:${item.id}`, item, sourceId: source.id })),
      })
  }
  return out
})
// З ignoreFilter Reka сама не підсвічує перший пункт — без цього Enter нічого не робить.
const combobox = ref<{ highlightFirstItem?: () => void }>()
watch(
  () => [groups.value, tracking.value],
  () => nextTick(() => combobox.value?.highlightFirstItem?.()),
)

const count = computed(
  () => groups.value.reduce((n, g) => n + g.items.length, 0) + (tracking.value ? 1 : 0),
)
watch(count, (n) => {
  if (open.value && query.value)
    announce(n ? t('command.results', { n }) : t('command.empty', { query: query.value }))
})

// Нещодавній пункт після перезавантаження: шукаємо його знову в тому самому джерелі.
async function replay(r: Recent) {
  const source = props.sources.find((s) => s.id === r.sourceId)
  if (!source) return
  const items = await source.search(r.label, new AbortController().signal)
  items.find((i) => i.id === r.id)?.onSelect()
}

function choose(key: string) {
  if (key === '__tracking' && tracking.value) {
    props.openShipment?.(tracking.value)
    open.value = false
    return
  }
  const entry = groups.value.flatMap((g) => g.items).find((e) => e.key === key)
  if (!entry) return
  const result = entry.item.onSelect()
  emit('select', entry.item)
  // onSelect може повернути що завгодно (id тосту) — вкладена команда лише { next }.
  if (typeof result === 'object' && result !== null && 'next' in result) {
    stack.value = [
      ...stack.value,
      { source: result.next as CommandSource, label: entry.item.label },
    ]
    query.value = ''
    void run('')
    return
  }
  remember(entry.item, entry.sourceId)
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  // Esc закриває палітру; закриття самого комбобокса (після вибору) палітру не закриває.
  if (event.key === 'Escape') {
    event.preventDefault()
    open.value = false
    return
  }
  // Enter — пункт з aria-activedescendant. Reka інколи тримає застарілий підсвічений елемент
  // після оновлення результатів; якщо вона вже обробила Enter, defaultPrevented = true.
  if (event.key === 'Enter' && !event.defaultPrevented && !event.isComposing) {
    const id = (event.target as HTMLElement).getAttribute('aria-activedescendant')
    const list = (event.target as HTMLElement).closest('.kite-command')
    const el =
      (id ? document.getElementById(id) : null) ??
      list?.querySelector<HTMLElement>('.kite-command-item[data-highlighted]') ??
      list?.querySelector<HTMLElement>('.kite-command-item')
    if (el) {
      event.preventDefault()
      event.stopImmediatePropagation()
      el.click()
    }
    return
  }
  if (event.key === 'Backspace' && !query.value && stack.value.length) {
    event.preventDefault()
    stack.value = stack.value.slice(0, -1)
    void run('')
  }
}

// ——— Глобальна клавіша ———
function onGlobal(event: KeyboardEvent) {
  if (!props.shortcut) return
  const keys = props.shortcut.toLowerCase().split('+')
  const key = keys[keys.length - 1]
  const needMod = keys.includes('mod')
  if (event.key.toLowerCase() !== key || needMod !== (event.metaKey || event.ctrlKey)) return
  event.preventDefault()
  open.value = !open.value
}
onMounted(() => document.addEventListener('keydown', onGlobal))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobal)
  clearTimeout(timer)
  controller?.abort()
})

const itemClass =
  'kite-command-item k:flex k:min-h-11 k:cursor-pointer k:items-center k:gap-3 k:rounded-sm k:px-3 k:py-2 k:text-body-sm k:text-fg k:outline-none k:select-none k:data-highlighted:bg-surface-hover'
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="kite-scrim k:fixed k:inset-0 k:z-[1100] k:bg-scrim" />
      <DialogContent
        :aria-describedby="undefined"
        class="kite-dialog kite-command k:fixed k:inset-0 k:z-[1200] k:flex k:flex-col k:overflow-hidden k:bg-surface-raised k:text-fg k:shadow-xl k:outline-none k:sm:inset-auto k:sm:top-[12vh] k:sm:left-1/2 k:sm:w-[min(40rem,calc(100vw-2rem))] k:sm:-translate-x-1/2 k:sm:rounded-lg k:sm:border k:sm:border-raised-border"
      >
        <DialogTitle class="k:sr-only">{{ t('command.label') }}</DialogTitle>
        <ComboboxRoot
          ref="combobox"
          :open="true"
          ignore-filter
          :reset-search-term-on-blur="false"
          :reset-search-term-on-select="false"
          class="k:flex k:min-h-0 k:flex-1 k:flex-col"
          @update:model-value="(v) => typeof v === 'string' && choose(v)"
        >
          <div
            class="k:flex k:h-14 k:shrink-0 k:items-center k:gap-3 k:border-b k:border-line k:px-4"
          >
            <KSpinner v-if="loading" decorative size="sm" class="k:text-fg-muted" />
            <KIcon v-else :icon="Search" class="k:text-fg-muted" />
            <span
              v-for="(s, i) in stack"
              :key="i"
              class="k:inline-flex k:shrink-0 k:items-center k:gap-1 k:rounded-full k:bg-bg-subtle k:px-2.5 k:py-0.5 k:text-label k:font-medium"
            >
              {{ s.label }}<KIcon :icon="ChevronRight" size="xs" />
            </span>
            <ComboboxInput
              v-model="query"
              :placeholder="placeholder ?? t('command.placeholder')"
              :aria-label="t('command.label')"
              class="k:h-full k:min-w-0 k:flex-1 k:border-0 k:bg-transparent k:p-0 k:text-body k:text-fg k:outline-none k:placeholder:text-fg-muted"
              @keydown="onKeydown"
            />
          </div>
          <ComboboxContent class="k:min-h-0 k:flex-1 k:sm:max-h-[25rem]">
            <ComboboxViewport class="k:max-h-full k:overflow-y-auto k:p-2">
              <ComboboxItem v-if="tracking" value="__tracking" :class="itemClass">
                <KIcon :icon="Package" class="k:text-fg-muted" />
                <span class="k:font-mono">{{
                  t('command.openShipment', { number: formatTrackingNumber(tracking) })
                }}</span>
              </ComboboxItem>
              <ComboboxGroup v-for="g in groups" :key="g.id" class="k:mt-1 k:first:mt-0">
                <ComboboxLabel
                  class="k:px-3 k:pt-2 k:pb-1 k:text-overline k:text-fg-muted k:uppercase"
                >
                  {{ g.label }}
                </ComboboxLabel>
                <ComboboxItem
                  v-for="e in g.items"
                  :key="e.key"
                  :value="e.key"
                  :text-value="e.item.label"
                  :class="itemClass"
                >
                  <KIcon v-if="e.item.icon" :icon="e.item.icon" class="k:text-fg-muted" />
                  <span class="k:grid k:min-w-0 k:flex-1">
                    <span class="k:truncate">{{ e.item.label }}</span>
                    <span
                      v-if="e.item.description"
                      class="k:truncate k:text-caption k:text-fg-muted"
                    >
                      {{ e.item.description }}
                    </span>
                  </span>
                  <KKbd v-if="e.item.shortcut" :keys="e.item.shortcut" />
                </ComboboxItem>
              </ComboboxGroup>
              <p
                v-if="!count && query && !loading"
                class="k:m-0 k:px-3 k:py-6 k:text-center k:text-body-sm k:text-fg-muted"
              >
                {{ t('command.empty', { query }) }}
              </p>
            </ComboboxViewport>
          </ComboboxContent>
          <div
            class="k:hidden k:shrink-0 k:items-center k:gap-4 k:border-t k:border-line k:px-4 k:py-2.5 k:text-caption k:text-fg-muted k:sm:flex"
            aria-hidden="true"
          >
            <span class="k:inline-flex k:items-center k:gap-1"
              ><KKbd :keys="['↑']" /><KKbd :keys="['↓']" /> {{ t('command.select') }}</span
            >
            <span class="k:inline-flex k:items-center k:gap-1"
              ><KKbd :keys="['enter']" /> {{ t('command.open') }}</span
            >
            <span class="k:inline-flex k:items-center k:gap-1"
              ><KKbd :keys="['Esc']" /> {{ t('command.close') }}</span
            >
          </div>
        </ComboboxRoot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
