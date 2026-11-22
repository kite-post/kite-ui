<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { TabsIndicator, TabsList } from 'reka-ui'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import { tabsKey } from './context'

const props = defineProps<{ class?: string }>()
defineSlots<{ default?(): unknown }>()

const ctx = inject(tabsKey, null)
const { t } = useMessages()
const routing = computed(() => ctx?.routing.value ?? false)
const pills = computed(() => ctx?.variant.value === 'pills')

// ——— Переповнення: прокрутка з тінями й стрілками ———
const scroller = ref<HTMLElement>()
const canPrev = ref(false)
const canNext = ref(false)
function measure() {
  const el = scroller.value
  if (!el) return
  canPrev.value = el.scrollLeft > 1
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}
function scrollBy(dir: 1 | -1) {
  const el = scroller.value
  el?.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
}
let observer: ResizeObserver | undefined
onMounted(() => {
  measure()
  if (scroller.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    observer.observe(scroller.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())

// Тінь-маска на краї, за яким є ще вкладки.
const mask = computed(() => {
  if (canPrev.value && canNext.value)
    return 'k:[mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]'
  if (canPrev.value) return 'k:[mask-image:linear-gradient(to_right,transparent,black_2rem)]'
  if (canNext.value) return 'k:[mask-image:linear-gradient(to_left,transparent,black_2rem)]'
  return undefined
})

const listClass = computed(() =>
  cn(
    'kite-tabs-list k:relative k:isolate k:flex k:min-w-max k:items-center',
    pills.value
      ? 'k:gap-0.5 k:rounded-full k:bg-bg-subtle k:p-1 k:shadow-[inset_0_0_0_1px_var(--kite-color-border)]'
      : 'k:gap-1',
  ),
)
const arrow =
  'k:absolute k:top-1/2 k:z-10 k:hidden k:size-7 k:-translate-y-1/2 k:cursor-pointer k:place-items-center k:rounded-full k:border k:border-line k:bg-surface-raised k:text-fg k:shadow-sm k:hover:bg-surface-hover k:md:grid'
</script>

<template>
  <div
    :class="
      cn(
        'kite-tabs-bar k:relative k:min-w-0',
        !pills && 'k:shadow-[inset_0_-1px_0_var(--kite-color-border)]',
        props.class,
      )
    "
  >
    <div
      ref="scroller"
      class="k:[scrollbar-width:none] k:overflow-x-auto k:[&::-webkit-scrollbar]:hidden"
      :class="mask"
      @scroll.passive="measure"
    >
      <div v-if="routing" :class="listClass"><slot /></div>
      <TabsList v-else :aria-label="ctx?.label.value" :class="listClass">
        <TabsIndicator
          :class="
            cn(
              'kite-tabs-indicator k:absolute k:left-0 k:w-(--reka-tabs-indicator-size) k:translate-x-(--reka-tabs-indicator-position) k:transition-[width,translate] k:duration-200 k:ease-in-out k:motion-reduce:transition-none',
              pills
                ? 'k:inset-y-1 k:-z-10 k:rounded-full k:bg-surface-raised k:shadow-[var(--kite-shadow-sm),inset_0_0_0_1px_var(--kite-color-raised-border)]'
                : 'k:bottom-0 k:h-0.5 k:rounded-full k:bg-primary',
            )
          "
        />
        <slot />
      </TabsList>
    </div>
    <button
      v-if="canPrev"
      type="button"
      tabindex="-1"
      :aria-label="t('tabs.scrollPrev')"
      :class="cn(arrow, 'k:left-0')"
      @click="scrollBy(-1)"
    >
      <KIcon :icon="ChevronLeft" size="sm" />
    </button>
    <button
      v-if="canNext"
      type="button"
      tabindex="-1"
      :aria-label="t('tabs.scrollNext')"
      :class="cn(arrow, 'k:right-0')"
      @click="scrollBy(1)"
    >
      <KIcon :icon="ChevronRight" size="sm" />
    </button>
  </div>
</template>
