<script setup lang="ts">
import { computed, nextTick, ref, useId, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { daysAgo, formatDate, formatTime } from '../../lib/format'
import KButton from '../button/KButton.vue'
import KIcon from '../icon/KIcon.vue'
import KSkeleton from '../skeleton/KSkeleton.vue'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  /** ISO */
  time: string
  state?: 'past' | 'current' | 'future'
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  icon?: Component
}

const props = withDefaults(
  defineProps<{
    items: TimelineItem[]
    order?: 'asc' | 'desc'
    groupByDay?: boolean
    /** Скільки подій показати до «Показати всі». */
    collapsible?: number | false
    size?: 'sm' | 'md'
    loading?: boolean
    class?: string
  }>(),
  { order: 'desc', groupByDay: true, collapsible: false, size: 'md', loading: false },
)

defineSlots<{ item?(props: { item: TimelineItem }): unknown }>()

const { t, locale } = useMessages()
const uid = `kite-timeline-${useId()}`
const expanded = ref(false)
const list = ref<HTMLElement>()

const sorted = computed(() =>
  [...props.items].sort((a, b) => {
    const d = new Date(a.time).getTime() - new Date(b.time).getTime()
    return props.order === 'asc' ? d : -d
  }),
)
const visible = computed(() =>
  props.collapsible && !expanded.value ? sorted.value.slice(0, props.collapsible) : sorted.value,
)

function dayLabel(iso: string) {
  const d = daysAgo(iso)
  if (d === 0) return t('timeline.today')
  if (d === 1) return t('timeline.yesterday')
  return formatDate(iso, 'long', locale.value)
}
function dayKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

interface Row {
  item: TimelineItem
  last: boolean
  /** Лінія до наступної події пунктирна, якщо та ще очікується. */
  dashed: boolean
}
/** Групи за днями (майбутні — без заголовка); кожна — окремий <ol> із підписом. */
const groups = computed(() => {
  const out: { key: string; label: string | null; rows: Row[] }[] = []
  visible.value.forEach((item, i) => {
    const future = item.state === 'future'
    const key = !props.groupByDay ? 'all' : future ? 'future' : dayKey(item.time)
    let group = out[out.length - 1]
    if (!group || group.key !== key) {
      group = { key, label: props.groupByDay && !future ? dayLabel(item.time) : null, rows: [] }
      out.push(group)
    }
    const next = visible.value[i + 1]
    group.rows.push({ item, last: !next, dashed: next?.state === 'future' || future })
  })
  return out
})

async function toggle() {
  const before = visible.value.length
  expanded.value = !expanded.value
  if (!expanded.value) return
  // Фокус — на першу щойно показану подію.
  await nextTick()
  const items = list.value?.querySelectorAll<HTMLElement>('li[data-event]')
  items?.[before]?.focus()
}

const solid = {
  neutral: 'k:bg-neutral-solid k:shadow-[0_0_0_4px_var(--kite-color-neutral-subtle)]',
  info: 'k:bg-info-solid k:shadow-[0_0_0_4px_var(--kite-color-info-subtle)]',
  success: 'k:bg-success-solid k:shadow-[0_0_0_4px_var(--kite-color-success-subtle)]',
  warning: 'k:bg-warning-solid k:shadow-[0_0_0_4px_var(--kite-color-warning-subtle)]',
  danger: 'k:bg-danger-solid k:shadow-[0_0_0_4px_var(--kite-color-danger-subtle)]',
}
const iconTone = {
  neutral: 'k:bg-neutral-subtle k:text-neutral-text',
  info: 'k:bg-info-subtle k:text-info-text',
  success: 'k:bg-success-subtle k:text-success-text',
  warning: 'k:bg-warning-subtle k:text-warning-text',
  danger: 'k:bg-danger-subtle k:text-danger-text',
}

function marker(item: TimelineItem) {
  const state = item.state ?? 'past'
  const sm = props.size === 'sm'
  if (item.icon)
    return cn(
      'k:grid k:size-6 k:place-items-center k:rounded-full',
      iconTone[item.tone ?? 'neutral'],
    )
  return cn(
    'k:rounded-full',
    sm ? 'k:size-2' : 'k:size-3',
    state === 'current' && solid[item.tone ?? 'info'],
    state === 'past' && 'k:bg-line-strong',
    state === 'future' && 'k:border k:border-dashed k:border-line-strong k:bg-surface',
  )
}
</script>

<template>
  <div :class="cn('kite-timeline k:min-w-0', props.class)" :data-size="size">
    <ol v-if="loading" class="k:m-0 k:grid k:list-none k:gap-5 k:p-0" aria-busy="true">
      <li v-for="i in 3" :key="i" class="k:flex k:gap-3">
        <KSkeleton class="k:mt-1 k:size-3 k:rounded-full" />
        <div class="k:grid k:flex-1 k:gap-1.5">
          <KSkeleton class="k:h-4 k:w-2/5" />
          <KSkeleton class="k:h-3 k:w-3/5" />
        </div>
      </li>
    </ol>
    <p v-else-if="!items.length" class="k:m-0 k:py-4 k:text-body-sm k:text-fg-muted">
      {{ t('timeline.empty') }}
    </p>
    <template v-else>
      <div ref="list" aria-live="polite" aria-relevant="additions">
        <template v-for="(group, gi) in groups" :key="group.key">
          <p
            v-if="group.label"
            :id="`${uid}-g${gi}`"
            :class="
              cn('k:m-0 k:pb-2 k:text-overline k:text-fg-muted k:uppercase', gi > 0 && 'k:pt-1')
            "
          >
            {{ group.label }}
          </p>
          <ol
            class="k:m-0 k:list-none k:p-0"
            :aria-labelledby="group.label ? `${uid}-g${gi}` : undefined"
          >
            <li
              v-for="row in group.rows"
              :key="row.item.id"
              data-event=""
              tabindex="-1"
              :aria-current="row.item.state === 'current' ? 'step' : undefined"
              :data-state="row.item.state ?? 'past'"
              :class="
                cn(
                  'kite-timeline-item k:relative k:flex k:gap-3 k:outline-none',
                  size === 'sm' ? 'k:pb-3' : 'k:pb-5',
                  row.last && 'k:pb-0',
                )
              "
            >
              <span class="k:relative k:flex k:w-6 k:shrink-0 k:justify-center" aria-hidden="true">
                <span
                  v-if="!row.last"
                  :class="
                    cn(
                      'k:absolute k:top-3 k:-bottom-1.5 k:left-1/2 k:-translate-x-1/2',
                      row.dashed
                        ? 'k:border-l-2 k:border-dashed k:border-line'
                        : 'k:w-0.5 k:bg-line',
                    )
                  "
                />
                <span :class="cn('k:relative k:mt-1.5', marker(row.item))">
                  <KIcon v-if="row.item.icon" :icon="row.item.icon" size="sm" />
                </span>
              </span>
              <div class="k:grid k:min-w-0 k:flex-1 k:gap-0.5">
                <div class="k:flex k:flex-wrap k:items-baseline k:justify-between k:gap-x-3">
                  <span
                    :class="
                      cn(
                        size === 'sm' ? 'k:text-body-sm' : 'k:text-body',
                        row.item.state === 'current'
                          ? 'k:font-semibold k:text-fg'
                          : row.item.state === 'future'
                            ? 'k:text-fg-muted'
                            : 'k:text-fg',
                      )
                    "
                  >
                    <span v-if="row.item.state === 'future'" class="k:sr-only"
                      >{{ t('timeline.expected') }}
                    </span>
                    {{ row.item.title }}
                  </span>
                  <time
                    :datetime="row.item.time"
                    class="k:shrink-0 k:text-caption k:text-fg-muted k:tabular-nums"
                  >
                    <template v-if="row.item.state === 'future'">
                      {{ formatDate(row.item.time, 'long', locale) }}
                    </template>
                    <template v-else-if="groupByDay">{{
                      formatTime(row.item.time, locale)
                    }}</template>
                    <template v-else>
                      {{ formatDate(row.item.time, 'long', locale) }},
                      {{ formatTime(row.item.time, locale) }}
                    </template>
                  </time>
                </div>
                <p v-if="row.item.description" class="k:m-0 k:text-body-sm k:text-fg-muted">
                  {{ row.item.description }}
                </p>
                <slot name="item" :item="row.item" />
              </div>
            </li>
          </ol>
        </template>
      </div>
      <KButton
        v-if="collapsible && sorted.length > collapsible"
        variant="link"
        size="sm"
        class="k:mt-3 k:ml-9"
        @click="toggle"
      >
        {{ expanded ? t('timeline.showLess') : t('timeline.showAll', { n: sorted.length }) }}
      </KButton>
    </template>
  </div>
</template>
