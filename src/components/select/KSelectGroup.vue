<script setup lang="ts">
import { SelectGroup, SelectLabel, SelectSeparator } from 'reka-ui'

// Декларативна група для KSelect без options: <KSelectGroup label="…"><KSelectItem …/></KSelectGroup>.
defineProps<{ label?: string | undefined; separated?: boolean | undefined }>()
defineSlots<{ default(): unknown }>()
</script>

<template>
  <SelectSeparator v-if="separated" class="k:my-1 k:h-px k:bg-line" />
  <SelectGroup>
    <SelectLabel
      v-if="label"
      class="k:px-3 k:pt-2 k:pb-1 k:text-overline k:text-fg-muted k:uppercase"
    >
      {{ label }}
    </SelectLabel>
    <slot />
  </SelectGroup>
</template>
