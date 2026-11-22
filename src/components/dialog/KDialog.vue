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
import { onMounted, ref } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIconButton from '../icon-button/KIconButton.vue'
import { createCloseRequest, provideOverlayKind, type CloseRequest } from './context'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    /** Заголовок — обов'язковий (видимий або в слоті title). */
    title?: string
    description?: string
    defaultOpen?: boolean
    /** Клік по скріму закриває. */
    closeOnOutsideClick?: boolean
    /** Сховати ×, коли у футері є явне «Скасувати». */
    hideClose?: boolean
    /** CSS-селектор елемента, що отримає фокус при відкритті. */
    initialFocus?: string
    class?: string
  }>(),
  { size: 'md', defaultOpen: false, closeOnOutsideClick: true, hideClose: false },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: [request: CloseRequest] }>()
defineSlots<{ default?(): unknown; trigger?(): unknown; title?(): unknown }>()

provideOverlayKind('dialog')
const { t } = useMessages()
const content = ref<InstanceType<typeof DialogContent>>()

onMounted(() => {
  if (props.defaultOpen) open.value = true
})

// Закриття можна скасувати через close(request).preventDefault().
function onOpenChange(value: boolean) {
  if (value) {
    open.value = true
    return
  }
  const request = createCloseRequest()
  emit('close', request)
  if (!request.defaultPrevented) open.value = false
}

function onOpenAutoFocus(event: Event) {
  if (!props.initialFocus) return
  const root = content.value?.$el as HTMLElement | undefined
  const target = root?.querySelector<HTMLElement>(props.initialFocus)
  if (target) {
    event.preventDefault()
    target.focus()
  }
}

function onInteractOutside(event: Event) {
  if (!props.closeOnOutsideClick) event.preventDefault()
}

const width = { sm: 'k:sm:max-w-[25rem]', md: 'k:sm:max-w-[35rem]', lg: 'k:sm:max-w-[45rem]' }
</script>

<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="kite-scrim k:fixed k:inset-0 k:z-[1100] k:bg-scrim" />
      <!-- На мобільному вікно притиснуте до низу, від 640 px — по центру. -->
      <div
        class="k:pointer-events-none k:fixed k:inset-0 k:z-[1200] k:flex k:items-end k:justify-center k:p-4 k:sm:items-center k:sm:p-8"
      >
        <DialogContent
          ref="content"
          :class="
            cn(
              'kite-dialog k:pointer-events-auto k:relative k:flex k:max-h-[calc(100dvh-2rem)] k:w-full k:flex-col k:rounded-lg k:border k:border-raised-border k:bg-surface-raised k:text-fg k:shadow-xl k:outline-none k:sm:max-h-[calc(100dvh-4rem)]',
              width[size],
              props.class,
            )
          "
          :data-size="size"
          @open-auto-focus="onOpenAutoFocus"
          @interact-outside="onInteractOutside"
        >
          <header class="k:shrink-0 k:px-6 k:pt-6 k:pr-14">
            <DialogTitle class="k:m-0 k:font-display k:text-h3 k:text-balance k:sm:text-h2">
              <slot name="title">{{ title }}</slot>
            </DialogTitle>
            <DialogDescription
              v-if="description"
              class="k:mt-1 k:mb-0 k:text-body-sm k:text-fg-muted"
            >
              {{ description }}
            </DialogDescription>
          </header>
          <slot />
          <!-- Кнопка × остання в DOM: автофокус потрапляє на вміст, а не на неї. -->
          <DialogClose v-if="!hideClose" as-child>
            <KIconButton
              :icon="X"
              :label="t('dialog.close')"
              size="sm"
              :tooltip="false"
              class="k:absolute k:top-5 k:right-5"
            />
          </DialogClose>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
