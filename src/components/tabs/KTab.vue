<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'
import { computed, getCurrentInstance, inject, type Component } from 'vue'

import { cn } from '../../lib/cn'
import KBadge from '../badge/KBadge.vue'
import KIcon from '../icon/KIcon.vue'
import { tabsKey } from './context'

const props = withDefaults(
  defineProps<{
    value: string
    icon?: Component
    /** Лічильник поряд з назвою. */
    count?: number
    disabled?: boolean
    /** Для routing: маршрут або адреса. */
    to?: string | Record<string, unknown>
    href?: string
    /** Для routing без Vue Router: позначити поточну вкладку. */
    active?: boolean
    class?: string
  }>(),
  { disabled: false, active: undefined },
)

defineSlots<{ default?(): unknown }>()
const ctx = inject(tabsKey, null)
const size = computed(() => ctx?.size.value ?? 'md')
const pills = computed(() => ctx?.variant.value === 'pills')

const RouterLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined
const link = computed(() =>
  props.to && RouterLink
    ? { is: RouterLink, to: props.to }
    : { is: 'a', href: props.href ?? (typeof props.to === 'string' ? props.to : undefined) },
)

const classes = computed(() =>
  cn(
    'kite-tab k:relative k:inline-flex k:shrink-0 k:cursor-pointer k:items-center k:gap-1.5 k:border-0 k:bg-transparent k:font-sans k:font-medium k:whitespace-nowrap k:text-fg-muted k:no-underline k:outline-none k:select-none',
    'k:transition-colors k:duration-100 k:hover:text-fg k:focus-visible:shadow-[inset_0_0_0_2px_var(--kite-color-focus-ring)]',
    'k:data-[state=active]:font-semibold k:data-[state=active]:text-fg',
    'k:aria-[current=page]:font-semibold k:aria-[current=page]:text-fg',
    'k:data-disabled:cursor-not-allowed k:data-disabled:text-fg-disabled',
    pills.value
      ? cn(
          'k:rounded-full',
          size.value === 'sm' ? 'k:h-6 k:px-2.5 k:text-label' : 'k:h-8 k:px-3 k:text-label',
        )
      : cn(
          'k:rounded-sm k:px-3 k:text-label',
          size.value === 'sm' ? 'k:h-8' : 'k:h-10',
          // У маршрутному режимі немає TabsIndicator — підкреслення малює сама вкладка.
          'k:aria-[current=page]:shadow-[inset_0_-2px_0_var(--kite-color-primary)]',
        ),
    props.class,
  ),
)
</script>

<template>
  <component
    :is="link.is"
    v-if="ctx?.routing.value"
    v-bind="link.is === 'a' ? { href: link.href } : { to: link.to }"
    :aria-current="active === true ? 'page' : undefined"
    :class="classes"
  >
    <KIcon v-if="icon" :icon="icon" size="sm" />
    <slot />
    <KBadge v-if="count !== undefined" :count="count" size="sm" />
  </component>
  <TabsTrigger v-else :value="value" :disabled="disabled" :class="classes">
    <KIcon v-if="icon" :icon="icon" size="sm" />
    <slot />
    <KBadge v-if="count !== undefined" :count="count" size="sm" />
  </TabsTrigger>
</template>
