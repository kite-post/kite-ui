<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { inject, type FunctionalComponent } from 'vue'

import { kiteConfigKey } from '../../config/context'
import KKbd from '../kbd/KKbd.vue'

withDefaults(
  defineProps<{
    /** Текст тултіпа (або слот content). */
    content?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Затримка появи на ховер, мс. На фокус з клавіатури — одразу. */
    delay?: number
    /** Гаряча клавіша поряд із текстом. */
    shortcut?: string[]
    disabled?: boolean
  }>(),
  { side: 'top', delay: 500, disabled: false },
)

defineSlots<{ default(): unknown; content?(): unknown }>()

// Усередині KConfigProvider вже є спільний TooltipProvider (спільна затримка між
// тултіпами). Без нього кожен тултіп ставить свій, щоб Reka не падала.
const hasProvider = inject(kiteConfigKey, null) !== null
const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.()
</script>

<template>
  <component :is="hasProvider ? Passthrough : TooltipProvider" :delay-duration="delay">
    <TooltipRoot :delay-duration="delay" :disabled="disabled">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :side-offset="6"
          :collision-padding="8"
          class="kite-tooltip k:z-[1500] k:flex k:max-w-[17.5rem] k:items-center k:gap-2 k:rounded-sm k:bg-surface-inverse k:px-2 k:py-1.5 k:text-caption k:font-medium k:text-fg-inverse"
        >
          <slot name="content">{{ content }}</slot>
          <KKbd v-if="shortcut" :keys="shortcut" inverse />
          <TooltipArrow :width="8" :height="4" class="k:fill-surface-inverse" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </component>
</template>
