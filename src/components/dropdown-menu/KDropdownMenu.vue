<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

import { cn } from '../../lib/cn'
import KDropdownMenuItems from './KDropdownMenuItems.vue'
import { menuContentClass } from './styles'
import type { MenuItem } from './types'

const props = withDefaults(
  defineProps<{
    /** Пункти меню. Альтернатива — власний вміст у слоті default. */
    items?: MenuItem[]
    size?: 'sm' | 'md'
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    modal?: boolean
    class?: string
  }>(),
  { size: 'md', side: 'bottom', align: 'end', modal: true },
)

const open = defineModel<boolean>('open', { default: false })
defineSlots<{ trigger(): unknown; default?(): unknown }>()
</script>

<template>
  <DropdownMenuRoot v-model:open="open" :modal="modal">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :side="side"
        :align="align"
        :side-offset="4"
        :collision-padding="8"
        :class="cn(menuContentClass, props.class)"
      >
        <KDropdownMenuItems v-if="items" :items="items" :size="size" />
        <slot v-else />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
