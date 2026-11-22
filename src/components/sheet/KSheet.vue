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

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { createCloseRequest, provideOverlayKind, type CloseRequest } from '../dialog/context'
import KIconButton from '../icon-button/KIconButton.vue'

const props = withDefaults(
  defineProps<{
    side?: 'right' | 'left' | 'bottom'
    /** Для side="right": 360 / 480 / 640 px; на мобільному — на всю ширину. */
    size?: 'sm' | 'md' | 'lg'
    title?: string
    description?: string
    /** Без скріму й пастки фокусу: сторінка під панеллю лишається робочою. */
    modal?: boolean
    closeOnOutsideClick?: boolean
    hideClose?: boolean
    class?: string
  }>(),
  { side: 'right', size: 'md', modal: true, closeOnOutsideClick: true, hideClose: false },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: [request: CloseRequest] }>()
defineSlots<{ default?(): unknown; trigger?(): unknown; title?(): unknown; header?(): unknown }>()

provideOverlayKind('sheet')
const { t } = useMessages()

function onOpenChange(value: boolean) {
  if (value) {
    open.value = true
    return
  }
  const request = createCloseRequest()
  emit('close', request)
  if (!request.defaultPrevented) open.value = false
}

function onInteractOutside(event: Event) {
  // Немодальна панель не закривається від роботи зі сторінкою.
  if (!props.closeOnOutsideClick || !props.modal) event.preventDefault()
}

const position = {
  right: 'k:inset-y-0 k:right-0 k:h-dvh k:w-full k:rounded-l-lg k:border-l',
  left: 'k:inset-y-0 k:left-0 k:h-dvh k:w-full k:max-w-[20rem] k:rounded-r-lg k:border-r',
  bottom: 'k:inset-x-0 k:bottom-0 k:max-h-[90dvh] k:w-full k:rounded-t-lg k:border-t',
}
const width = { sm: 'k:sm:max-w-[22.5rem]', md: 'k:sm:max-w-[30rem]', lg: 'k:sm:max-w-[40rem]' }
</script>

<template>
  <DialogRoot :open="open" :modal="modal" @update:open="onOpenChange">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay v-if="modal" class="kite-scrim k:fixed k:inset-0 k:z-[1100] k:bg-scrim" />
      <DialogContent
        :class="
          cn(
            'kite-sheet k:fixed k:z-[1200] k:flex k:flex-col k:border-raised-border k:bg-surface-raised k:text-fg k:shadow-xl k:outline-none',
            position[side],
            side === 'right' && width[size],
            props.class,
          )
        "
        :data-side="side"
        @interact-outside="onInteractOutside"
      >
        <header
          class="k:flex k:shrink-0 k:items-start k:gap-3 k:border-b k:border-line k:px-6 k:pt-5 k:pb-4"
        >
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
            <slot name="header" />
          </div>
          <DialogClose v-if="!hideClose" as-child>
            <KIconButton
              :icon="X"
              :label="t('dialog.close')"
              size="sm"
              :tooltip="false"
              class="k:-mr-2"
            />
          </DialogClose>
        </header>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
