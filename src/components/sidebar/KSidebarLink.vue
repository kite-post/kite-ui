<script setup lang="ts">
import { computed, getCurrentInstance, type Component } from 'vue'

import { cn } from '../../lib/cn'
import KBadge from '../badge/KBadge.vue'
import KIcon from '../icon/KIcon.vue'
import KTooltip from '../tooltip/KTooltip.vue'
import type { SidebarItem } from './types'

const props = defineProps<{
  item: SidebarItem
  collapsed: boolean
  nested?: boolean
}>()

const RouterLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined
const useRouter = computed(() => !!props.item.to && !!RouterLink && !props.item.disabled)

const base = computed(() =>
  cn(
    'kite-sidebar-link k:relative k:flex k:min-h-10 k:items-center k:gap-3 k:rounded-sm k:text-label k:font-medium k:text-fg k:no-underline k:outline-none',
    'k:transition-colors k:duration-100 k:hover:bg-surface-hover k:focus-visible:shadow-[0_0_0_2px_var(--kite-color-focus-ring)]',
    'k:aria-[current=page]:bg-primary-subtle k:aria-[current=page]:font-semibold k:aria-[current=page]:text-primary-text',
    "k:aria-[current=page]:before:absolute k:aria-[current=page]:before:inset-y-2 k:aria-[current=page]:before:-left-2 k:aria-[current=page]:before:w-[3px] k:aria-[current=page]:before:rounded-full k:aria-[current=page]:before:bg-primary k:aria-[current=page]:before:content-['']",
    props.nested ? 'k:pr-3 k:pl-11 k:font-normal' : 'k:px-3',
    props.collapsed && 'k:justify-center k:px-0',
    props.item.disabled && 'k:pointer-events-none k:text-fg-disabled',
  ),
)
const tag = computed<string | Component>(() =>
  props.item.disabled ? 'span' : useRouter.value ? RouterLink! : 'a',
)
const linkAttrs = computed(() => {
  if (props.item.disabled) return { 'aria-disabled': 'true' }
  if (useRouter.value) return { to: props.item.to, ariaCurrentValue: 'page' }
  return {
    href: props.item.href ?? (typeof props.item.to === 'string' ? props.item.to : undefined),
    'aria-current': props.item.active ? 'page' : undefined,
  }
})
</script>

<template>
  <KTooltip :content="item.label" side="right" :disabled="!collapsed">
    <component :is="tag" v-bind="linkAttrs" :class="base">
      <KIcon v-if="item.icon" :icon="item.icon" />
      <span :class="cn('k:min-w-0 k:flex-1 k:truncate', collapsed && 'k:sr-only')">{{
        item.label
      }}</span>
      <template v-if="item.count !== undefined">
        <KBadge
          :count="item.count"
          size="sm"
          :label="item.countLabel ? `${item.count} ${item.countLabel}` : undefined"
          :class="collapsed ? 'k:absolute k:top-0.5 k:right-1' : undefined"
        />
      </template>
    </component>
  </KTooltip>
</template>
