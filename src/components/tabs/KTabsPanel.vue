<script setup lang="ts">
import { TabsContent } from 'reka-ui'

import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    value: string
    /** Рендерити й неактивну панель (зберегти стан форми). */
    forceMount?: boolean
    class?: string
  }>(),
  { forceMount: false },
)
defineSlots<{ default?(): unknown }>()
</script>

<template>
  <TabsContent
    :value="value"
    :force-mount="forceMount || undefined"
    :class="
      cn(
        'kite-tabs-panel k:min-w-0 k:rounded-sm k:outline-none k:focus-visible:shadow-[0_0_0_2px_var(--kite-color-focus-ring)] k:data-[state=inactive]:hidden',
        props.class,
      )
    "
  >
    <slot />
  </TabsContent>
</template>
