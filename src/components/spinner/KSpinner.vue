<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    size?: SpinnerSize
    /** Затримка появи, мс: швидкі відповіді не «блимають». 0 — одразу. */
    delay?: number
    /** Текст для скрінрідера. */
    label?: string
    /** Без ролі status: стан оголошує власник (кнопка з aria-busy). */
    decorative?: boolean
    class?: string
  }>(),
  { size: 'md', delay: 300, decorative: false },
)

const { t } = useMessages()
const visible = ref(props.delay <= 0)
let timer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  if (!visible.value) timer = setTimeout(() => (visible.value = true), props.delay)
})
onBeforeUnmount(() => clearTimeout(timer))

const px: Record<SpinnerSize, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 }
const text = computed(() => props.label ?? t('spinner.label'))
</script>

<template>
  <span
    :class="cn('kite-spinner k:inline-flex k:shrink-0', props.class)"
    :data-size="size"
    :role="decorative ? undefined : 'status'"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <svg
      v-if="visible"
      :width="px[size]"
      :height="px[size]"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      class="kite-spinner__svg"
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.2" />
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-dasharray="15 60"
      />
    </svg>
    <span v-if="!decorative" class="k:sr-only">{{ text }}</span>
  </span>
</template>
