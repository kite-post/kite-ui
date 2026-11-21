<script setup lang="ts">
import { ExternalLink } from '@lucide/vue'
import { Primitive } from 'reka-ui'
import { computed, getCurrentInstance, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'

type LinkVariant = 'inline' | 'standalone' | 'subtle'

const props = withDefaults(
  defineProps<{
    href?: string
    /** Маршрут Vue Router: рендериться RouterLink, якщо роутер підключено. */
    to?: string | Record<string, unknown>
    variant?: LinkVariant
    /** Для standalone: sm — 14 px, md — 16 px. */
    size?: 'sm' | 'md'
    /** Зовнішнє посилання. Типово визначається за доменом. */
    external?: boolean | undefined
    trailingIcon?: Component
    as?: string | Component
    asChild?: boolean
    class?: string
  }>(),
  {
    variant: 'inline',
    size: 'md',
    // Без явного undefined Vue перетворить відсутній булевий проп на false.
    external: undefined,
    asChild: false,
  },
)

defineSlots<{ default(): unknown }>()

const { t } = useMessages()
const RouterLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined

const isExternal = computed(() => {
  if (props.external !== undefined) return props.external
  if (!props.href || !/^https?:\/\//i.test(props.href)) return false
  if (typeof location === 'undefined') return true
  try {
    return new URL(props.href).host !== location.host
  } catch {
    return false
  }
})

const tag = computed(() => props.as ?? (props.to && RouterLink ? RouterLink : 'a'))
const linkAttrs = computed(() => {
  if (props.to && RouterLink && !props.as) return { to: props.to }
  return {
    href: props.href ?? (typeof props.to === 'string' ? props.to : undefined),
    ...(isExternal.value ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }
})

const variantClass: Record<LinkVariant, string> = {
  inline:
    'k:text-fg-link k:underline k:decoration-1 k:underline-offset-[0.2em] k:hover:text-fg-link-hover k:hover:decoration-2',
  standalone:
    'k:inline-flex k:items-center k:gap-1.5 k:font-medium k:text-fg-link k:no-underline k:underline-offset-[0.2em] k:hover:text-fg-link-hover k:hover:underline',
  subtle:
    'k:text-fg-muted k:no-underline k:underline-offset-[0.2em] k:hover:text-fg k:hover:underline',
}

const classes = computed(() =>
  cn(
    'kite-link k:rounded-xs k:transition-colors k:duration-100',
    'k:aria-[current=page]:font-semibold k:aria-[current=page]:text-fg k:aria-[current=page]:no-underline',
    variantClass[props.variant],
    props.variant === 'standalone' && (props.size === 'sm' ? 'k:text-label' : 'k:text-body'),
    props.variant === 'subtle' && 'k:text-body-sm',
    props.class,
  ),
)

const iconSize = computed(() =>
  props.variant === 'standalone' && props.size === 'md' ? 'md' : 'sm',
)
</script>

<template>
  <Primitive
    :as="tag"
    :as-child="asChild"
    v-bind="linkAttrs"
    :class="classes"
    :data-variant="variant"
  >
    <slot />
    <KIcon v-if="trailingIcon" :icon="trailingIcon" :size="iconSize" />
    <KIcon
      v-else-if="isExternal"
      :icon="ExternalLink"
      :size="iconSize"
      class="k:ml-0.5 k:inline-block k:align-[-0.125em]"
    />
    <span v-if="isExternal" class="k:sr-only"> {{ t('link.newTab') }}</span>
  </Primitive>
</template>
