<script setup lang="ts">
import { computed } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { formatTrackingNumber, trackingGroups } from '../../lib/format'
import KCopyButton from '../copy-button/KCopyButton.vue'
import KLink from '../link/KLink.vue'

const props = withDefaults(
  defineProps<{
    /** 'KT123456785UA' */
    value: string
    size?: 'sm' | 'md' | 'lg'
    copyable?: boolean
    /** Зробити посиланням на сторінку посилки. */
    to?: string | Record<string, unknown>
    href?: string
    /** Виділити останні 4 цифри перед контрольною — їх звіряють оператори. */
    emphasis?: boolean
    class?: string
  }>(),
  { size: 'md', copyable: true, emphasis: false },
)

const { t } = useMessages()
const clean = computed(() => props.value.replace(/\s/g, '').toUpperCase())
const groups = computed(() => trackingGroups(clean.value))
const pretty = computed(() => formatTrackingNumber(clean.value))
// Скрінрідер читає посимвольно з паузами між групами: «K T, 1 2 3 4, …».
const spoken = computed(() => groups.value.map((g) => [...g].join(' ')).join(', '))

// Ручне копіювання виділеного тексту — без групувальних пробілів.
function onCopy(event: ClipboardEvent) {
  const selected = window.getSelection()?.toString() ?? ''
  if (!selected) return
  event.preventDefault()
  event.clipboardData?.setData('text/plain', selected.replace(/\s/g, ''))
}

const text = { sm: 'k:text-mono k:text-[0.875rem]', md: 'k:text-mono', lg: 'k:text-mono-lg' }
</script>

<template>
  <span
    :class="
      cn('kite-tracking-number k:inline-flex k:items-center k:gap-1 k:align-middle', props.class)
    "
    :data-size="size"
  >
    <component
      :is="to || href ? KLink : 'span'"
      v-bind="
        to || href
          ? {
              to,
              href,
              variant: 'standalone',
              'aria-label': t('tracking.link', { number: pretty }),
            }
          : {}
      "
      :class="cn('k:inline-flex k:font-mono k:whitespace-nowrap', text[size])"
      @copy="onCopy"
    >
      <span aria-hidden="true" class="k:inline-flex">
        <span
          v-for="(g, i) in groups"
          :key="i"
          :class="cn(i > 0 && 'k:ml-[0.4em]', emphasis && i === 2 && 'k:font-semibold')"
          >{{ g }}</span
        >
      </span>
      <span v-if="!(to || href)" class="k:sr-only">{{ spoken }}</span>
    </component>
    <KCopyButton
      v-if="copyable"
      :value="clean"
      :label="t('tracking.copy')"
      :size="size === 'lg' ? 'md' : 'sm'"
    />
  </span>
</template>
