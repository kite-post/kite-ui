<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useId } from 'vue'

import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    arrow?: boolean
    /** auto — за вмістом (200–400 px), trigger — як ширина тригера. */
    width?: 'auto' | 'trigger'
    /** Пастка фокусу й блокування сторінки. */
    modal?: boolean
    /** Заголовок панелі. Доступну назву Reka бере з тексту тригера. */
    title?: string
    class?: string
  }>(),
  { side: 'bottom', align: 'center', sideOffset: 8, arrow: false, width: 'auto', modal: false },
)

const open = defineModel<boolean>('open', { default: false })
defineSlots<{ trigger(): unknown; default(props: { close: () => void }): unknown }>()

const titleId = `kite-popover-${useId()}`
const close = () => (open.value = false)
</script>

<template>
  <PopoverRoot v-model:open="open" :modal="modal">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
        :class="
          cn(
            'kite-popover kite-pop k:z-[1300] k:rounded-md k:border k:border-raised-border k:bg-surface-raised k:p-4 k:text-body-sm k:text-fg k:shadow-lg k:outline-none',
            width === 'trigger'
              ? 'k:w-(--reka-popover-trigger-width)'
              : 'k:max-w-[min(25rem,calc(100vw-2rem))] k:min-w-[12.5rem]',
            props.class,
          )
        "
      >
        <p v-if="title" :id="titleId" class="k:m-0 k:mb-2 k:font-semibold">{{ title }}</p>
        <slot :close="close" />
        <PopoverArrow v-if="arrow" :width="12" :height="6" class="k:fill-surface-raised" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
