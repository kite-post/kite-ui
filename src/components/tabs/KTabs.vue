<script setup lang="ts">
import { TabsRoot } from 'reka-ui'
import { computed, provide } from 'vue'

import { cn } from '../../lib/cn'
import { tabsKey } from './context'

const props = withDefaults(
  defineProps<{
    defaultValue?: string
    variant?: 'line' | 'pills'
    size?: 'sm' | 'md'
    /** manual — перемикання на Enter/Space, коли панель важко вантажиться. */
    activation?: 'automatic' | 'manual'
    /** Вкладки — посилання маршрутів; вміст дає RouterView застосунку. */
    routing?: boolean
    /** Назва групи вкладок. */
    label?: string
    class?: string
  }>(),
  { variant: 'line', size: 'md', activation: 'automatic', routing: false },
)

const model = defineModel<string | undefined>({ default: undefined })
defineSlots<{ default?(): unknown }>()

if (model.value === undefined && props.defaultValue !== undefined) model.value = props.defaultValue

provide(tabsKey, {
  variant: computed(() => props.variant),
  size: computed(() => props.size),
  routing: computed(() => props.routing),
  label: computed(() => props.label),
})
</script>

<template>
  <nav
    v-if="routing"
    :aria-label="label"
    :class="cn('kite-tabs k:grid k:min-w-0 k:gap-4', props.class)"
    data-routing=""
  >
    <slot />
  </nav>
  <TabsRoot
    v-else
    v-model="model"
    :activation-mode="activation"
    :class="cn('kite-tabs k:grid k:min-w-0 k:gap-4', props.class)"
    :data-variant="variant"
  >
    <slot />
  </TabsRoot>
</template>
