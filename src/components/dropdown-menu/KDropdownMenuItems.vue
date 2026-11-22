<script setup lang="ts">
import { Check, ChevronRight } from '@lucide/vue'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from 'reka-ui'

import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import KKbd from '../kbd/KKbd.vue'
import { menuContentClass, menuItemClass } from './styles'
import type { MenuItem } from './types'

// Рекурсивний рендер пунктів: KDropdownMenu і підменю користуються ним однаково.
defineProps<{ items: MenuItem[]; size: 'sm' | 'md' }>()
</script>

<template>
  <template v-for="(item, i) in items" :key="i">
    <DropdownMenuSeparator v-if="item.type === 'separator'" class="k:my-1 k:h-px k:bg-line" />

    <DropdownMenuLabel
      v-else-if="item.type === 'label'"
      class="k:px-3 k:pt-2 k:pb-1 k:text-overline k:text-fg-muted k:uppercase"
    >
      {{ item.label }}
    </DropdownMenuLabel>

    <DropdownMenuCheckboxItem
      v-else-if="item.type === 'checkbox'"
      :model-value="item.checked"
      :disabled="item.disabled"
      :class="menuItemClass(size)"
      @update:model-value="(v: boolean | 'indeterminate') => item.onUpdate(v === true)"
      @select="(e: Event) => e.preventDefault()"
    >
      <span class="k:grid k:size-4 k:place-items-center">
        <DropdownMenuItemIndicator><KIcon :icon="Check" size="sm" /></DropdownMenuItemIndicator>
      </span>
      {{ item.label }}
    </DropdownMenuCheckboxItem>

    <DropdownMenuRadioGroup
      v-else-if="item.type === 'radio'"
      :model-value="item.value"
      @update:model-value="(v: unknown) => item.onUpdate(String(v))"
    >
      <DropdownMenuRadioItem
        v-for="o in item.options"
        :key="o.value"
        :value="o.value"
        :disabled="o.disabled"
        :class="menuItemClass(size)"
      >
        <span class="k:grid k:size-4 k:place-items-center">
          <DropdownMenuItemIndicator>
            <span class="k:block k:size-1.5 k:rounded-full k:bg-current" />
          </DropdownMenuItemIndicator>
        </span>
        {{ o.label }}
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>

    <DropdownMenuSub v-else-if="item.type === 'sub'">
      <DropdownMenuSubTrigger :disabled="item.disabled" :class="menuItemClass(size)">
        <KIcon v-if="item.icon" :icon="item.icon" size="sm" class="k:text-fg-muted" />
        <span class="k:flex-1">{{ item.label }}</span>
        <KIcon :icon="ChevronRight" size="sm" class="k:text-fg-muted" />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent :side-offset="4" :collision-padding="8" :class="menuContentClass">
          <KDropdownMenuItems :items="item.items" :size="size" />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>

    <DropdownMenuItem
      v-else
      :as="item.href ? 'a' : 'div'"
      :href="item.href"
      :disabled="item.disabled"
      :class="
        cn(
          menuItemClass(size),
          item.danger && 'k:text-danger-text k:data-highlighted:bg-danger-subtle',
        )
      "
      :data-danger="item.danger ? '' : undefined"
      @select="(e: Event) => item.onSelect?.(e)"
    >
      <KIcon
        v-if="item.icon"
        :icon="item.icon"
        size="sm"
        :class="item.danger ? 'k:text-current' : 'k:text-fg-muted'"
      />
      <span class="k:flex-1">{{ item.label }}</span>
      <KKbd v-if="item.shortcut" :keys="item.shortcut" class="k:ml-4" />
    </DropdownMenuItem>
  </template>
</template>
