<script setup lang="ts">
import { CollapsibleContent } from 'reka-ui'

import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    /** Рендерити вміст і в закритому стані (пошук по сторінці). */
    forceMount?: boolean
    class?: string
  }>(),
  { forceMount: false },
)
defineSlots<{ default?(): unknown }>()
</script>

<template>
  <CollapsibleContent
    :force-mount="forceMount || undefined"
    :class="cn('kite-collapsible-content', props.class)"
  >
    <slot />
  </CollapsibleContent>
</template>
