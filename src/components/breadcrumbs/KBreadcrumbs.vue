<script setup lang="ts">
import { ArrowLeft, ChevronRight, Ellipsis } from '@lucide/vue'
import { computed, getCurrentInstance } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KDropdownMenu from '../dropdown-menu/KDropdownMenu.vue'
import type { MenuItem } from '../dropdown-menu/types'
import KIcon from '../icon/KIcon.vue'
import KIconButton from '../icon-button/KIconButton.vue'
import KLink from '../link/KLink.vue'

export interface BreadcrumbItem {
  label: string
  to?: string | Record<string, unknown>
  href?: string
}

const props = withDefaults(
  defineProps<{
    /** Останній — поточна сторінка. */
    items: BreadcrumbItem[]
    /** Понад стільки частин середні ховаються в меню «…». */
    maxItems?: number
    class?: string
  }>(),
  { maxItems: 4 },
)

const { t } = useMessages()
const router = getCurrentInstance()?.appContext.config.globalProperties.$router as
  { push: (to: unknown) => unknown } | undefined

type Part = { kind: 'item'; item: BreadcrumbItem; current: boolean } | { kind: 'more' }

// Перша частина, «…» і хвіст, щоб разом було не більше maxItems.
const hidden = computed(() => {
  const n = props.items.length
  if (n <= props.maxItems || props.maxItems < 3) return []
  return props.items.slice(1, n - (props.maxItems - 2))
})
const parts = computed<Part[]>(() => {
  const last = props.items.length - 1
  const asPart = (item: BreadcrumbItem, i: number): Part => ({
    kind: 'item',
    item,
    current: i === last,
  })
  if (!hidden.value.length) return props.items.map(asPart)
  const tailFrom = 1 + hidden.value.length
  return [
    asPart(props.items[0]!, 0),
    { kind: 'more' },
    ...props.items.slice(tailFrom).map((item, i) => asPart(item, tailFrom + i)),
  ]
})

const menu = computed<MenuItem[]>(() =>
  hidden.value.map((item) => {
    const href = item.href ?? (typeof item.to === 'string' ? item.to : undefined)
    if (item.to && typeof item.to !== 'string' && router)
      return { label: item.label, onSelect: () => router.push(item.to) }
    return href ? { label: item.label, href } : { label: item.label }
  }),
)

const parent = computed(() =>
  props.items.length > 1 ? props.items[props.items.length - 2] : undefined,
)
</script>

<template>
  <nav :aria-label="t('breadcrumbs.label')" :class="cn('kite-breadcrumbs k:min-w-0', props.class)">
    <!-- Мобільний: лише попередній рівень. -->
    <KLink
      v-if="parent"
      :to="parent.to"
      :href="parent.href"
      variant="subtle"
      :aria-label="t('breadcrumbs.back', { label: parent.label })"
      class="k:inline-flex k:items-center k:gap-1 k:sm:hidden"
    >
      <KIcon :icon="ArrowLeft" size="sm" />{{ parent.label }}
    </KLink>
    <ol
      class="k:m-0 k:hidden k:min-h-6 k:list-none k:flex-wrap k:items-center k:gap-1 k:p-0 k:text-body-sm k:sm:flex"
    >
      <li
        v-for="(part, i) in parts"
        :key="i"
        class="k:inline-flex k:min-w-0 k:items-center k:gap-1"
      >
        <KIcon v-if="i > 0" :icon="ChevronRight" size="sm" class="k:text-fg-muted" />
        <KDropdownMenu v-if="part.kind === 'more'" :items="menu" align="start">
          <template #trigger>
            <KIconButton
              :icon="Ellipsis"
              :label="t('breadcrumbs.more')"
              size="sm"
              :tooltip="false"
              class="k:size-6"
            />
          </template>
        </KDropdownMenu>
        <span
          v-else-if="part.current"
          aria-current="page"
          class="k:truncate k:font-medium k:text-fg"
          >{{ part.item.label }}</span
        >
        <KLink
          v-else
          :to="part.item.to"
          :href="part.item.href"
          variant="subtle"
          class="k:truncate"
          >{{ part.item.label }}</KLink
        >
      </li>
    </ol>
  </nav>
</template>
