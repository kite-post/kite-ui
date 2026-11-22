<script setup lang="ts">
import { X } from '@lucide/vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { computed, ref } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { provideOverlayKind } from '../dialog/context'
import KIconButton from '../icon-button/KIconButton.vue'

// Нижня шторка для мобільного. Reka Drawer у 2.11 — Alpha, тож основа — стабільний
// Dialog: ручка-кнопка розгортає (альтернатива жесту, WCAG 2.5.7), свайп униз закриває.
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    /** Закриття свайпом униз. */
    dismissible?: boolean
    /** Без скріму: сторінка над шторкою (карта) лишається робочою. */
    modal?: boolean
    class?: string
  }>(),
  { dismissible: true, modal: true },
)

const open = defineModel<boolean>('open', { default: false })
/** Розгорнута на 90 % висоти екрана чи за вмістом. */
const expanded = defineModel<boolean>('expanded', { default: false })
defineSlots<{ default?(): unknown; trigger?(): unknown; title?(): unknown }>()

provideOverlayKind('sheet')
const { t } = useMessages()
const panel = ref<InstanceType<typeof DialogContent>>()

const offset = ref(0)
let startY: number | null = null
let startTime = 0

function onPointerDown(event: PointerEvent) {
  if (!props.dismissible || event.button !== 0) return
  // Не перехоплюємо кліки по кнопках у шапці.
  if ((event.target as HTMLElement).closest('button:not(.kite-drawer__handle)')) return
  startY = event.clientY
  startTime = performance.now()
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}
function onPointerMove(event: PointerEvent) {
  if (startY === null) return
  offset.value = Math.max(0, event.clientY - startY)
}
function onPointerUp() {
  if (startY === null) return
  const height = (panel.value?.$el as HTMLElement | undefined)?.offsetHeight ?? 1
  const velocity = offset.value / Math.max(1, performance.now() - startTime)
  if (offset.value > height * 0.3 || velocity > 0.6) open.value = false
  offset.value = 0
  startY = null
}

const style = computed(() =>
  offset.value ? { transform: `translateY(${offset.value}px)`, transition: 'none' } : undefined,
)

function onInteractOutside(event: Event) {
  if (!props.modal) event.preventDefault()
}
</script>

<template>
  <DialogRoot v-model:open="open" :modal="modal">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay v-if="modal" class="kite-scrim k:fixed k:inset-0 k:z-[1100] k:bg-scrim" />
      <DialogContent
        ref="panel"
        :class="
          cn(
            'kite-sheet kite-drawer k:fixed k:inset-x-0 k:bottom-0 k:z-[1200] k:flex k:w-full k:flex-col k:rounded-t-lg k:border-t k:border-raised-border k:bg-surface-raised k:text-fg k:shadow-xl k:outline-none',
            'k:transition-[height,max-height,transform] k:duration-300 k:ease-out',
            expanded ? 'k:h-[90dvh]' : 'k:max-h-[90dvh]',
            props.class,
          )
        "
        :style="style"
        data-side="bottom"
        @interact-outside="onInteractOutside"
      >
        <div
          class="k:shrink-0 k:touch-none k:px-4 k:pt-2 k:pb-3"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <button
            type="button"
            class="kite-drawer__handle k:mx-auto k:grid k:h-5 k:w-10 k:cursor-grab k:place-items-center k:rounded-full"
            :aria-label="expanded ? t('drawer.collapse') : t('drawer.expand')"
            :aria-expanded="expanded ? 'true' : 'false'"
            @click="expanded = !expanded"
          >
            <span class="k:block k:h-1 k:w-8 k:rounded-full k:bg-line-strong" />
          </button>
          <div class="k:mt-2 k:flex k:items-start k:gap-3">
            <div class="k:min-w-0 k:flex-1">
              <DialogTitle class="k:m-0 k:font-display k:text-h3">
                <slot name="title">{{ title }}</slot>
              </DialogTitle>
              <DialogDescription
                v-if="description"
                class="k:mt-1 k:mb-0 k:text-body-sm k:text-fg-muted"
              >
                {{ description }}
              </DialogDescription>
            </div>
            <DialogClose as-child>
              <KIconButton :icon="X" :label="t('dialog.close')" size="sm" :tooltip="false" />
            </DialogClose>
          </div>
        </div>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
