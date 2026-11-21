<script setup lang="ts">
import { computed, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import { badgeVariants, type BadgeSize, type BadgeTone, type BadgeVariant } from './variants'

const props = withDefaults(
  defineProps<{
    tone?: BadgeTone
    variant?: BadgeVariant
    size?: BadgeSize
    icon?: Component
    /** Крапка кольору тону замість іконки. */
    dot?: boolean
    /** Режим лічильника: текст слоту ігнорується. */
    count?: number
    /** Межа лічильника: понад неї — «99+». */
    max?: number
    /** Контекст для скрінрідера: «3 непрочитані». */
    label?: string
    class?: string
  }>(),
  {
    tone: 'neutral',
    variant: 'subtle',
    size: 'md',
    dot: false,
    max: 99,
  },
)

defineSlots<{ default?(): unknown }>()

const { t } = useMessages()
const isCount = computed(() => props.count !== undefined)
const countText = computed(() =>
  props.count !== undefined && props.count > props.max
    ? t('badge.overflow', { max: props.max })
    : String(props.count ?? ''),
)
</script>

<template>
  <span
    :class="cn(badgeVariants({ tone, variant, size, count: isCount }), props.class)"
    :data-tone="tone"
    :data-variant="variant"
    :data-size="size"
  >
    <template v-if="isCount">
      <span :aria-hidden="label ? 'true' : undefined">{{ countText }}</span>
      <span v-if="label" class="k:sr-only">{{ label }}</span>
    </template>
    <template v-else>
      <span
        v-if="dot"
        class="k:size-1.5 k:shrink-0 k:rounded-full k:bg-(--kb-solid)"
        aria-hidden="true"
      />
      <KIcon v-else-if="icon" :icon="icon" :size="size === 'sm' ? 'xs' : 'sm'" />
      <slot />
    </template>
  </span>
</template>
