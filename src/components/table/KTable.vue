<script setup lang="ts">
import { computed, provide, useId } from 'vue'

import { cn } from '../../lib/cn'
import { tableKey } from './context'

const props = withDefaults(
  defineProps<{
    density?: 'comfortable' | 'compact'
    /** Смуги через рядок — для широких таблиць. */
    striped?: boolean
    /** Липкий заголовок: з обмеженою висотою обгортки (maxHeight) або під шапкою сторінки. */
    stickyHeader?: boolean
    stickyFirstColumn?: boolean
    /** Зовнішня рамка; false — таблиця всередині картки. */
    bordered?: boolean
    /** Видимий підпис таблиці. */
    caption?: string
    /** Доступна назва без видимого підпису. */
    label?: string
    /** Висота обгортки для внутрішньої прокрутки: '24rem'. */
    maxHeight?: string
    /** aria-rowcount — загальна кількість рядків, коли показано лише частину (сервер). */
    rowCount?: number
    class?: string
  }>(),
  {
    density: 'comfortable',
    striped: false,
    stickyHeader: false,
    stickyFirstColumn: false,
    bordered: true,
  },
)

defineSlots<{ default?(): unknown; caption?(): unknown }>()

const captionId = `kite-table-${useId()}`
provide(tableKey, {
  density: computed(() => props.density),
  striped: computed(() => props.striped),
  stickyHeader: computed(() => props.stickyHeader),
  stickyFirstColumn: computed(() => props.stickyFirstColumn),
})
const named = computed(() => !!props.caption || !!props.label)
</script>

<template>
  <div
    :role="named ? 'region' : undefined"
    :aria-labelledby="caption ? captionId : undefined"
    :aria-label="!caption ? label : undefined"
    :tabindex="named ? 0 : undefined"
    :class="
      cn(
        'kite-table-wrap k:relative k:w-full k:min-w-0 k:overflow-auto k:bg-surface k:outline-none k:focus-visible:shadow-[0_0_0_2px_var(--kite-color-focus-ring)]',
        bordered && 'k:rounded-md k:border k:border-line',
        props.class,
      )
    "
    :style="maxHeight ? { maxHeight } : undefined"
  >
    <table
      class="kite-table k:w-full k:border-separate k:border-spacing-0 k:text-body-sm k:text-fg"
      :data-density="density"
      :aria-rowcount="rowCount"
    >
      <caption
        v-if="caption || $slots.caption"
        :id="captionId"
        class="k:px-4 k:py-3 k:text-left k:text-body-strong k:text-fg"
      >
        <slot name="caption">{{ caption }}</slot>
      </caption>
      <slot />
    </table>
  </div>
</template>
