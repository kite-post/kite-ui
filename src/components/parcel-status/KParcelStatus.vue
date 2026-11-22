<script setup lang="ts">
import { computed, watchEffect } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { formatDate } from '../../lib/format'
import type { MessageKey } from '../../lib/messages'
import KBadge from '../badge/KBadge.vue'
import KIcon from '../icon/KIcon.vue'
import { parcelStatusMeta, type ParcelStatus } from './meta'

const props = withDefaults(
  defineProps<{
    status: ParcelStatus | (string & {})
    /** Підстановки: «Їде до {city}», «Утримується до {date}» (date — ISO). */
    params?: { city?: string; date?: string }
    /** Частково видано (кілька місць). */
    partial?: boolean
    variant?: 'badge' | 'detailed'
    audience?: 'client' | 'staff'
    size?: 'sm' | 'md' | 'lg'
    /** Другий рядок для detailed: «Відділення №12, Львів». */
    detail?: string
    class?: string
  }>(),
  { partial: false, variant: 'badge', audience: 'client', size: 'md' },
)

const { t, locale } = useMessages()
const meta = computed(() => parcelStatusMeta(props.status))

watchEffect(() => {
  if (!meta.value.known)
    console.warn(`[kite-ui] KParcelStatus: невідомий стан «${props.status}», показуємо як neutral`)
})

const label = computed(() => {
  if (!meta.value.known) return props.status
  const base = `parcel.status.${props.status}.${props.audience}`
  const city = props.params?.city
  const date = props.params?.date ? formatDate(props.params.date, 'long', locale.value) : undefined
  const needs =
    props.status === 'IN_TRANSIT' || props.status === 'AT_HUB'
      ? city
      : props.status === 'ON_HOLD'
        ? date
        : true
  // Без потрібного параметра — коротка форма без підстановки («У дорозі»).
  const key = (needs ? base : `${base}Short`) as MessageKey
  const text = t(key, { city: city ?? '', date: date ?? '' })
  return props.partial ? `${text} ${t('parcel.status.partial')}` : text
})

const circle = {
  neutral: 'k:bg-neutral-subtle k:text-neutral-text',
  info: 'k:bg-info-subtle k:text-info-text',
  success: 'k:bg-success-subtle k:text-success-text',
  warning: 'k:bg-warning-subtle k:text-warning-text',
  danger: 'k:bg-danger-subtle k:text-danger-text',
}
</script>

<template>
  <KBadge
    v-if="variant === 'badge'"
    :tone="meta.tone"
    :size="size"
    :class="cn('kite-parcel-status', props.class)"
    :icon="meta.icon"
    :data-status="status"
  >
    {{ label }}
  </KBadge>
  <div
    v-else
    :class="cn('kite-parcel-status k:flex k:items-start k:gap-3', props.class)"
    :data-status="status"
    :data-tone="meta.tone"
  >
    <span
      :class="
        cn('k:grid k:size-10 k:shrink-0 k:place-items-center k:rounded-full', circle[meta.tone])
      "
      aria-hidden="true"
    >
      <KIcon :icon="meta.icon" size="lg" />
    </span>
    <span class="k:grid k:min-w-0 k:gap-0.5 k:pt-0.5">
      <span class="k:text-body-strong k:text-fg">{{ label }}</span>
      <span v-if="detail" class="k:text-body-sm k:text-fg-muted">{{ detail }}</span>
    </span>
  </div>
</template>
