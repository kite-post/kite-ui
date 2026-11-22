<script setup lang="ts">
import { Check } from '@lucide/vue'
import { SelectItem, SelectItemIndicator, SelectItemText } from 'reka-ui'
import type { Component } from 'vue'

import KIcon from '../icon/KIcon.vue'

defineProps<{
  value: string
  label: string
  description?: string | undefined
  icon?: Component | undefined
  disabled?: boolean | undefined
}>()

defineSlots<{ default?(): unknown }>()
</script>

<template>
  <SelectItem
    :value="value"
    :disabled="disabled"
    :text-value="label"
    class="kite-select-item k:relative k:flex k:min-h-10 k:cursor-pointer k:items-center k:gap-2.5 k:rounded-sm k:py-2 k:pr-9 k:pl-3 k:text-body-sm k:text-fg k:outline-none k:select-none k:data-disabled:cursor-not-allowed k:data-disabled:text-fg-disabled k:data-highlighted:bg-surface-hover k:data-[state=checked]:font-semibold"
  >
    <KIcon v-if="icon" :icon="icon" size="sm" class="k:text-fg-muted" />
    <span class="k:min-w-0 k:flex-1">
      <SelectItemText>{{ label }}</SelectItemText>
      <span v-if="description" class="k:block k:text-caption k:font-normal k:text-fg-muted">
        {{ description }}
      </span>
      <slot />
    </span>
    <SelectItemIndicator class="k:absolute k:right-3 k:inline-flex">
      <KIcon :icon="Check" size="sm" />
    </SelectItemIndicator>
  </SelectItem>
</template>
