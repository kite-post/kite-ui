<script setup lang="ts">
import { User } from '@lucide/vue'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { computed } from 'vue'

import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'

const props = withDefaults(
  defineProps<{
    src?: string
    /** Ім'я: ініціали, alt і колір фону. */
    name?: string
    size?: 'sm' | 'md' | 'lg'
    /** circle — люди, square — організації. */
    shape?: 'circle' | 'square'
    /** Ім'я вже видно поруч текстом — аватар декоративний. */
    decorative?: boolean
    class?: string
  }>(),
  { size: 'md', shape: 'circle', decorative: false },
)

/** «Ольга Ковальчук» → «ОК». */
const initials = computed(() =>
  (props.name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => [...w][0]!.toLocaleUpperCase('uk-UA'))
    .join(''),
)

// Колір — з хешу імені: та сама людина завжди того самого кольору (без red — схоже на помилку).
const palette = ['sky', 'green', 'amber', 'coral', 'slate'] as const
const tone = computed(() => {
  let h = 0
  for (const ch of props.name ?? '') h = (h * 31 + ch.codePointAt(0)!) >>> 0
  return palette[h % palette.length]!
})
const toneStyle = computed(() => ({
  backgroundColor: `var(--kite-${tone.value}-${tone.value === 'slate' ? 200 : 100})`,
  color: `var(--kite-${tone.value}-800)`,
}))

const sizes = {
  sm: 'k:size-6 k:text-caption k:font-semibold',
  md: 'k:size-8 k:text-label k:font-semibold',
  lg: 'k:size-12 k:text-h4 k:font-bold',
}
// Назву несе корінь (role="img"), тож фото має alt="", а ініціали приховані — інакше
// скрінрідер прочитає «ОК» замість імені.
const a11y = computed(() =>
  props.decorative || !props.name
    ? { 'aria-hidden': 'true' as const }
    : { role: 'img', 'aria-label': props.name },
)
</script>

<template>
  <AvatarRoot
    :class="
      cn(
        'kite-avatar k:inline-flex k:shrink-0 k:items-center k:justify-center k:overflow-hidden k:align-middle k:leading-none k:select-none',
        shape === 'square' ? 'k:rounded-sm' : 'k:rounded-full',
        sizes[size],
        props.class,
      )
    "
    :style="toneStyle"
    v-bind="a11y"
    :data-size="size"
  >
    <AvatarImage v-if="src" :src="src" alt="" class="k:size-full k:object-cover" />
    <AvatarFallback class="k:flex k:size-full k:items-center k:justify-center" aria-hidden="true">
      <template v-if="initials">{{ initials }}</template>
      <KIcon v-else :icon="User" :size="size === 'lg' ? 'lg' : 'sm'" />
    </AvatarFallback>
  </AvatarRoot>
</template>
