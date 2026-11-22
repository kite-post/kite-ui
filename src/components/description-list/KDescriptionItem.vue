<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KSkeleton from '../skeleton/KSkeleton.vue'
import { descriptionListKey } from './context'

const props = defineProps<{
  label: string
  /** Значення текстом; або слот default. */
  value?: string | number | null
  /** Скільки колонок займає (stacked). */
  span?: 1 | 2 | 3
}>()

defineSlots<{ default?(): unknown; label?(): unknown }>()
const slots = useSlots()
const { t } = useMessages()
const list = inject(descriptionListKey, null)

const layout = computed(() => list?.layout.value ?? 'stacked')
const empty = computed(
  () => !slots.default && (props.value === undefined || props.value === null || props.value === ''),
)
const spans = { 1: '', 2: 'k:sm:col-span-2', 3: 'k:sm:col-span-2 k:lg:col-span-3' }
</script>

<template>
  <div
    :class="
      cn(
        'kite-dl-item k:min-w-0',
        layout === 'stacked'
          ? cn('k:grid k:content-start k:gap-0.5', spans[span ?? 1])
          : 'k:grid k:gap-1 k:py-2 k:sm:grid-cols-[minmax(0,var(--kite-dl-label-width))_minmax(0,1fr)] k:sm:gap-4',
        layout === 'inline' && list?.divided.value && 'k:border-b k:border-line k:last:border-b-0',
      )
    "
  >
    <dt :class="cn('k:text-fg-muted', layout === 'stacked' ? 'k:text-caption' : 'k:text-body-sm')">
      <slot name="label">{{ label }}</slot>
    </dt>
    <dd
      :class="
        cn(
          'k:m-0 k:min-w-0 k:[overflow-wrap:anywhere] k:text-fg',
          list?.size.value === 'sm' ? 'k:text-body-sm' : 'k:text-body',
        )
      "
    >
      <KSkeleton v-if="list?.loading.value" class="k:h-[1.25em] k:w-3/5" />
      <template v-else-if="empty">
        <span class="k:text-fg-muted" aria-hidden="true">—</span>
        <span class="k:sr-only">{{ t('dl.empty') }}</span>
      </template>
      <slot v-else>{{ value }}</slot>
    </dd>
  </div>
</template>
