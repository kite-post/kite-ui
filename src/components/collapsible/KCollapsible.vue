<script setup lang="ts">
import { CollapsibleRoot } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    defaultOpen?: boolean
    disabled?: boolean
    class?: string
  }>(),
  { defaultOpen: false, disabled: false },
)

const open = defineModel<boolean | undefined>('open', { default: undefined })
defineSlots<{ default?(props: { open: boolean }): unknown }>()

if (open.value === undefined) open.value = props.defaultOpen
const isOpen = computed({
  get: () => open.value ?? false,
  set: (v: boolean) => (open.value = v),
})
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open: current }"
    v-model:open="isOpen"
    :disabled="disabled"
    :class="['kite-collapsible', props.class]"
  >
    <slot :open="current" />
  </CollapsibleRoot>
</template>
