<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from 'reka-ui'
import { computed, inject } from 'vue'

import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import { accordionKey } from './context'

const props = withDefaults(
  defineProps<{
    value: string
    title?: string
    disabled?: boolean
    /** Рендерити вміст закритої секції (пошук по сторінці). */
    forceMount?: boolean
    class?: string
  }>(),
  { disabled: false, forceMount: false },
)

defineSlots<{ default?(): unknown; title?(): unknown }>()
const ctx = inject(accordionKey, null)
const cards = computed(() => ctx?.variant.value === 'cards')
</script>

<template>
  <AccordionItem
    :value="value"
    :disabled="disabled"
    :class="
      cn(
        'kite-accordion-item',
        cards
          ? 'k:overflow-hidden k:rounded-md k:border k:border-line k:bg-surface'
          : 'k:border-b k:border-line k:last:border-b-0',
        props.class,
      )
    "
  >
    <AccordionHeader :as="`h${ctx?.headingLevel.value ?? 3}`" class="k:m-0 k:flex">
      <AccordionTrigger
        :class="
          cn(
            'k:group/acc k:flex k:min-h-12 k:w-full k:flex-1 k:cursor-pointer k:items-center k:justify-between k:gap-3 k:border-0 k:bg-transparent k:py-4 k:text-left k:font-sans k:text-body-strong k:text-fg',
            'k:transition-colors k:duration-100 k:hover:bg-surface-hover',
            'k:data-disabled:cursor-not-allowed k:data-disabled:text-fg-disabled k:data-disabled:hover:bg-transparent',
            cards ? 'k:px-4' : 'k:px-2',
          )
        "
      >
        <span class="k:min-w-0"
          ><slot name="title">{{ title }}</slot></span
        >
        <KIcon
          :icon="ChevronDown"
          class="k:text-fg-muted k:transition-transform k:duration-200 k:group-data-[state=open]/acc:rotate-180"
        />
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionContent :force-mount="forceMount || undefined" class="kite-collapsible-content">
      <div :class="cn('k:pb-4 k:text-body k:text-fg', cards ? 'k:px-4' : 'k:px-2')">
        <slot />
      </div>
    </AccordionContent>
  </AccordionItem>
</template>
