<script setup lang="ts">
import { CollapsibleTrigger } from 'reka-ui'

// Типово — кнопка-посилання з власним вмістом; asChild — щоб тригером була KButton.
withDefaults(defineProps<{ asChild?: boolean }>(), { asChild: false })
defineSlots<{ default?(): unknown }>()
</script>

<template>
  <CollapsibleTrigger :as-child="asChild">
    <slot />
  </CollapsibleTrigger>
</template>
