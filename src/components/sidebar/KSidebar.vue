<script setup lang="ts">
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import KSidebarLink from './KSidebarLink.vue'
import type { SidebarGroup } from './types'

const STORAGE_KEY = 'kite-sidebar'

const props = withDefaults(
  defineProps<{
    items?: SidebarGroup[]
    /** Назва навігації. */
    label?: string
    /** Мобільна панель усередині KSheet: завжди розгорнута, без кнопки згортання. */
    inSheet?: boolean
    /** Гаряча клавіша згортання: '[' і mod+B. */
    shortcut?: boolean
    class?: string
  }>(),
  { items: () => [], inSheet: false, shortcut: true },
)

const collapsedModel = defineModel<boolean | undefined>('collapsed', { default: undefined })
defineSlots<{
  header?(props: { collapsed: boolean }): unknown
  footer?(props: { collapsed: boolean }): unknown
  default?(): unknown
}>()

const { t } = useMessages()
const uid = useId()

// Стан згортання пам'ятаємо між сесіями (якщо застосунок не керує ним сам).
function stored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'collapsed'
  } catch {
    return false
  }
}
if (collapsedModel.value === undefined) collapsedModel.value = stored()
const collapsed = computed(() => !props.inSheet && !!collapsedModel.value)
watch(collapsedModel, (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, v ? 'collapsed' : 'expanded')
  } catch {
    /* приватний режим */
  }
})
function toggle() {
  collapsedModel.value = !collapsedModel.value
}

function onKeydown(event: KeyboardEvent) {
  if (!props.shortcut || props.inSheet) return
  const target = event.target as HTMLElement | null
  if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))
    return
  const modB = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b'
  if (event.key === '[' || modB) {
    event.preventDefault()
    toggle()
  }
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

// Згорнуті групи.
const closedGroups = ref(new Set<number>())
function toggleGroup(i: number) {
  const next = new Set(closedGroups.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  closedGroups.value = next
}
</script>

<template>
  <div
    :class="
      cn(
        'kite-sidebar k:flex k:h-full k:flex-col k:bg-bg-subtle k:text-fg',
        !inSheet && 'k:border-r k:border-line',
        !inSheet &&
          'k:transition-[width] k:duration-200 k:ease-in-out k:motion-reduce:transition-none',
        inSheet ? 'k:w-full' : collapsed ? 'k:w-16' : 'k:w-66',
        props.class,
      )
    "
    :data-collapsed="collapsed ? '' : undefined"
  >
    <div v-if="$slots.header" :class="cn('k:shrink-0 k:p-3', collapsed && 'k:px-2')">
      <slot name="header" :collapsed="collapsed" />
    </div>
    <nav
      :aria-label="label ?? t('sidebar.label')"
      :class="cn('k:min-h-0 k:flex-1 k:overflow-y-auto k:py-2', collapsed ? 'k:px-2' : 'k:px-3')"
    >
      <slot>
        <template v-for="(group, gi) in items" :key="gi">
          <div v-if="gi > 0 && collapsed" class="k:my-2 k:h-px k:bg-line" aria-hidden="true" />
          <div :class="cn(gi > 0 && !collapsed && 'k:mt-4')">
            <template v-if="group.label && !collapsed">
              <button
                v-if="group.collapsible"
                :id="`${uid}-g${gi}`"
                type="button"
                :aria-expanded="!closedGroups.has(gi)"
                class="k:flex k:w-full k:cursor-pointer k:items-center k:justify-between k:rounded-sm k:border-0 k:bg-transparent k:px-3 k:py-1.5 k:text-overline k:text-fg-muted k:uppercase k:hover:text-fg"
                @click="toggleGroup(gi)"
              >
                {{ group.label }}
                <KIcon
                  :icon="ChevronDown"
                  size="xs"
                  :class="cn('k:transition-transform', closedGroups.has(gi) && 'k:-rotate-90')"
                />
              </button>
              <p
                v-else
                :id="`${uid}-g${gi}`"
                class="k:m-0 k:px-3 k:py-1.5 k:text-overline k:text-fg-muted k:uppercase"
              >
                {{ group.label }}
              </p>
            </template>
            <ul
              v-show="!closedGroups.has(gi) || collapsed"
              class="k:m-0 k:grid k:list-none k:gap-0.5 k:p-0"
              :aria-labelledby="group.label && !collapsed ? `${uid}-g${gi}` : undefined"
              :aria-label="group.label && collapsed ? group.label : undefined"
            >
              <li v-for="(item, ii) in group.items" :key="ii">
                <KSidebarLink :item="item" :collapsed="collapsed" />
                <ul
                  v-if="item.children?.length && !collapsed"
                  class="k:m-0 k:mt-0.5 k:grid k:list-none k:gap-0.5 k:p-0"
                >
                  <li v-for="(child, ci) in item.children" :key="ci">
                    <KSidebarLink :item="child" :collapsed="false" nested />
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </template>
      </slot>
    </nav>
    <div
      v-if="$slots.footer || !inSheet"
      :class="cn('k:grid k:shrink-0 k:gap-1 k:border-t k:border-line k:p-3', collapsed && 'k:px-2')"
    >
      <slot name="footer" :collapsed="collapsed" />
      <button
        v-if="!inSheet"
        type="button"
        :aria-expanded="!collapsed"
        :aria-label="collapsed ? t('sidebar.expand') : undefined"
        :class="
          cn(
            'k:flex k:min-h-10 k:cursor-pointer k:items-center k:gap-3 k:rounded-sm k:border-0 k:bg-transparent k:px-3 k:text-label k:font-medium k:text-fg-muted k:hover:bg-surface-hover k:hover:text-fg',
            collapsed && 'k:justify-center k:px-0',
          )
        "
        @click="toggle"
      >
        <KIcon :icon="collapsed ? PanelLeftOpen : PanelLeftClose" />
        <span v-if="!collapsed">{{ t('sidebar.collapse') }}</span>
      </button>
    </div>
  </div>
</template>
