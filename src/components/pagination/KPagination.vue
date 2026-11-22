<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { computed, useId } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { intlLocale } from '../../lib/intl'
import KIconButton from '../icon-button/KIconButton.vue'
import KSelect from '../select/KSelect.vue'

const props = withDefaults(
  defineProps<{
    /** Кількість записів (не для cursor). */
    total?: number
    /** false — сховати вибір розміру сторінки. */
    pageSizes?: number[] | false
    siblingCount?: number
    /** На < 640 px full автоматично стає simple. */
    variant?: 'full' | 'simple' | 'cursor'
    /** Для cursor. */
    hasNext?: boolean
    hasPrev?: boolean
    size?: 'sm' | 'md'
    class?: string
  }>(),
  {
    total: 0,
    pageSizes: () => [10, 25, 50, 100],
    siblingCount: 1,
    variant: 'full',
    hasNext: false,
    hasPrev: false,
    size: 'md',
  },
)

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 25 })

const { t, locale } = useMessages()
const sizeId = `kite-page-size-${useId()}`

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / pageSize.value)))
const nf = computed(() => new Intl.NumberFormat(intlLocale(locale.value)))
const range = computed(() => {
  if (!props.total) return ''
  const from = (page.value - 1) * pageSize.value + 1
  const to = Math.min(page.value * pageSize.value, props.total)
  return t('pagination.range', {
    from: nf.value.format(from),
    to: nf.value.format(to),
    total: nf.value.format(props.total),
  })
})

// Новий розмір сторінки — назад на першу.
const sizeValue = computed({
  get: () => String(pageSize.value),
  set: (v: string | null) => {
    if (!v) return
    pageSize.value = Number(v)
    page.value = 1
  },
})
const sizeOptions = computed(() =>
  (props.pageSizes || []).map((n) => ({ value: String(n), label: String(n) })),
)

const btn = computed(() => (props.size === 'sm' ? 'k:size-8' : 'k:size-10'))
const pageButton = computed(() =>
  cn(
    'k:inline-grid k:min-w-max k:cursor-pointer k:place-items-center k:rounded-full k:border-0 k:bg-transparent k:px-1 k:font-sans k:text-label k:text-fg k:tabular-nums',
    'k:transition-colors k:duration-100 k:hover:bg-surface-hover',
    'k:data-selected:bg-fg k:data-selected:font-semibold k:data-selected:text-fg-inverse k:data-selected:hover:bg-fg',
    btn.value,
  ),
)
const iconSize = computed(() => props.size)

const simple = computed(() =>
  t('pagination.of', { n: nf.value.format(page.value), total: nf.value.format(pageCount.value) }),
)
</script>

<template>
  <nav
    :aria-label="t('pagination.label')"
    :class="
      cn(
        'kite-pagination k:flex k:flex-wrap k:items-center k:justify-between k:gap-x-6 k:gap-y-3 k:text-body-sm',
        props.class,
      )
    "
  >
    <p
      v-if="variant !== 'cursor' && range"
      class="kite-num k:m-0 k:text-fg-muted"
      aria-live="polite"
    >
      {{ range }}
    </p>

    <div class="k:ml-auto k:flex k:flex-wrap k:items-center k:gap-x-6 k:gap-y-3">
      <div v-if="pageSizes && variant !== 'cursor'" class="k:flex k:items-center k:gap-2">
        <label :for="sizeId" class="k:text-fg-muted">{{ t('pagination.pageSize') }}</label>
        <KSelect :id="sizeId" v-model="sizeValue" :options="sizeOptions" size="sm" class="k:w-20" />
      </div>

      <!-- cursor: лише назад / далі -->
      <div v-if="variant === 'cursor'" class="k:flex k:items-center k:gap-1">
        <KIconButton
          :icon="ChevronLeft"
          :label="t('pagination.prev')"
          :size="iconSize"
          :disabled="!hasPrev"
          @click="page = page - 1"
        />
        <KIconButton
          :icon="ChevronRight"
          :label="t('pagination.next')"
          :size="iconSize"
          :disabled="!hasNext"
          @click="page = page + 1"
        />
      </div>

      <PaginationRoot
        v-else
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
        :sibling-count="siblingCount"
        show-edges
      >
        <PaginationList v-slot="{ items }" class="k:m-0 k:flex k:items-center k:gap-1 k:p-0">
          <PaginationPrev as-child>
            <KIconButton
              :icon="ChevronLeft"
              :label="t('pagination.prev')"
              :size="iconSize"
              :tooltip="false"
            />
          </PaginationPrev>
          <!-- simple, а для full — на вузькому екрані -->
          <span
            :class="
              cn(
                'kite-num k:px-2 k:whitespace-nowrap k:text-fg',
                variant === 'full' && 'k:sm:hidden',
              )
            "
          >
            {{ simple }}
          </span>
          <template v-if="variant === 'full'">
            <template v-for="(item, i) in items" :key="i">
              <PaginationListItem
                v-if="item.type === 'page'"
                :value="item.value"
                :aria-label="t('pagination.page', { n: item.value })"
                :class="cn(pageButton, 'k:hidden k:sm:inline-grid')"
              >
                {{ item.value }}
              </PaginationListItem>
              <PaginationEllipsis
                v-else
                :index="i"
                :class="cn('k:hidden k:place-items-center k:text-fg-muted k:sm:inline-grid', btn)"
              >
                …
              </PaginationEllipsis>
            </template>
          </template>
          <PaginationNext as-child>
            <KIconButton
              :icon="ChevronRight"
              :label="t('pagination.next')"
              :size="iconSize"
              :tooltip="false"
            />
          </PaginationNext>
        </PaginationList>
      </PaginationRoot>
    </div>
  </nav>
</template>
