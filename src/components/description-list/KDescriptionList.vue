<script setup lang="ts">
import { computed, provide } from 'vue'

import { cn } from '../../lib/cn'
import { descriptionListKey } from './context'
import KDescriptionItem from './KDescriptionItem.vue'

export interface DescriptionItem {
  label: string
  value?: string | number | null
  span?: 1 | 2 | 3
}

const props = withDefaults(
  defineProps<{
    /** Або дочірні KDescriptionItem. */
    items?: DescriptionItem[]
    layout?: 'stacked' | 'inline'
    /** Для stacked; на мобільному завжди 1. */
    columns?: 1 | 2 | 3
    size?: 'sm' | 'md'
    /** Лінії між рядками (inline). */
    divided?: boolean
    /** Скелетони замість значень. */
    loading?: boolean
    /** Ширина колонки міток для inline. */
    labelWidth?: string
    class?: string
  }>(),
  {
    layout: 'stacked',
    columns: 2,
    size: 'md',
    divided: false,
    loading: false,
    labelWidth: '10rem',
  },
)

defineSlots<{ default?(): unknown }>()

provide(descriptionListKey, {
  layout: computed(() => props.layout),
  size: computed(() => props.size),
  divided: computed(() => props.divided),
  loading: computed(() => props.loading),
})

const grid = computed(() =>
  props.layout === 'inline'
    ? 'k:grid'
    : cn(
        'k:grid k:gap-x-6 k:gap-y-4',
        { 1: '', 2: 'k:sm:grid-cols-2', 3: 'k:sm:grid-cols-2 k:lg:grid-cols-3' }[props.columns],
      ),
)
</script>

<template>
  <dl
    :class="cn('kite-dl k:m-0', grid, props.class)"
    :style="{ '--kite-dl-label-width': labelWidth }"
    :data-layout="layout"
    :aria-busy="loading ? 'true' : undefined"
  >
    <template v-if="items">
      <KDescriptionItem
        v-for="(item, i) in items"
        :key="`${item.label}-${i}`"
        :label="item.label"
        :value="item.value ?? null"
        :span="item.span"
      />
    </template>
    <slot v-else />
  </dl>
</template>
