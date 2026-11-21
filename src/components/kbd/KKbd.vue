<script setup lang="ts">
import { computed } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    /** Клавіші: ['mod', 'k']. mod — ⌘ на macOS і Ctrl на інших системах. */
    keys?: string[]
    size?: 'sm' | 'md'
    /** Для темних поверхонь (тултіп). */
    inverse?: boolean
    class?: string
  }>(),
  { size: 'sm', inverse: false },
)

defineSlots<{ default?(): unknown }>()

const { t } = useMessages()

function isMac(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  const platform = nav.userAgentData?.platform ?? nav.platform ?? ''
  return /mac|iphone|ipad/i.test(platform)
}
const mac = isMac()

interface KeyView {
  glyph: string
  /** Назва для скрінрідера, якщо гліф — символ. */
  spoken?: string
}

const views = computed<KeyView[]>(() =>
  (props.keys ?? []).map((raw) => {
    const k = raw.toLowerCase()
    if (k === 'mod') return mac ? { glyph: '⌘', spoken: t('kbd.command') } : { glyph: t('kbd.mod') }
    if (k === 'shift')
      return mac ? { glyph: '⇧', spoken: t('kbd.shift') } : { glyph: t('kbd.shift') }
    if (k === 'alt') return mac ? { glyph: '⌥', spoken: t('kbd.option') } : { glyph: t('kbd.alt') }
    if (k === 'enter') return { glyph: '↵', spoken: t('kbd.enter') }
    return { glyph: raw.length === 1 ? raw.toUpperCase() : raw }
  }),
)

const keyClass = computed(() =>
  cn(
    'kite-kbd k:inline-flex k:items-center k:justify-center k:rounded-xs k:border k:border-b-2 k:px-1.5',
    'k:font-mono k:text-caption k:font-medium',
    props.size === 'md' ? 'k:h-6 k:min-w-6' : 'k:h-5 k:min-w-5',
    props.inverse
      ? 'k:border-current/40 k:bg-transparent k:text-current'
      : 'k:border-line k:bg-surface-sunken k:text-fg-muted',
  ),
)
</script>

<template>
  <span :class="cn('k:inline-flex k:items-center k:gap-1', props.class)">
    <template v-if="keys">
      <kbd v-for="(v, i) in views" :key="i" :class="keyClass">
        <span :aria-hidden="v.spoken ? 'true' : undefined">{{ v.glyph }}</span>
        <span v-if="v.spoken" class="k:sr-only">{{ v.spoken }}</span>
      </kbd>
    </template>
    <kbd v-else :class="keyClass"><slot /></kbd>
  </span>
</template>
