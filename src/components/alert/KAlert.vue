<script setup lang="ts">
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { computed, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import type { MessageKey } from '../../lib/messages'
import KIcon from '../icon/KIcon.vue'
import KIconButton from '../icon-button/KIconButton.vue'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    tone?: Tone
    /** subtle — у потоці сторінки; banner — на всю ширину над вмістом. */
    variant?: 'subtle' | 'banner'
    /** sm — без заголовка, текст у рядок з іконкою. */
    size?: 'sm' | 'md'
    title?: string
    /** Іконка тону; false — без іконки. */
    icon?: Component | false
    dismissible?: boolean
    /** Оголосити появу: polite → role="status", assertive → role="alert". */
    live?: 'off' | 'polite' | 'assertive'
    class?: string
  }>(),
  {
    tone: 'info',
    variant: 'subtle',
    size: 'md',
    // Без явного undefined Vue перетворить відсутній проп типу Component | false на false.
    icon: undefined,
    dismissible: false,
    live: 'off',
  },
)

const emit = defineEmits<{ dismiss: [] }>()
defineSlots<{ default?(): unknown; title?(): unknown; actions?(): unknown }>()

const { t } = useMessages()

const toneIcon: Record<Tone, Component> = {
  neutral: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
}
// Кольори тону з токенів (стайлгайд 3.2): фон subtle, рамка border, іконка text.
const toneClass: Record<Tone, string> = {
  neutral:
    'k:border-neutral-border k:bg-neutral-subtle k:[--ka-icon:var(--kite-color-neutral-text)]',
  info: 'k:border-info-border k:bg-info-subtle k:[--ka-icon:var(--kite-color-info-text)]',
  success:
    'k:border-success-border k:bg-success-subtle k:[--ka-icon:var(--kite-color-success-text)]',
  warning:
    'k:border-warning-border k:bg-warning-subtle k:[--ka-icon:var(--kite-color-warning-text)]',
  danger: 'k:border-danger-border k:bg-danger-subtle k:[--ka-icon:var(--kite-color-danger-text)]',
}

const iconComp = computed(() =>
  props.icon === false ? null : (props.icon ?? toneIcon[props.tone]),
)
const role = computed(() =>
  props.live === 'assertive' ? 'alert' : props.live === 'polite' ? 'status' : undefined,
)
</script>

<template>
  <div
    :class="
      cn(
        'kite-alert k:flex k:min-w-0 k:gap-3 k:border k:text-body-sm k:text-fg',
        toneClass[tone],
        variant === 'banner' ? 'k:rounded-none k:border-x-0' : 'k:rounded-md',
        size === 'sm' ? 'k:items-center k:gap-2 k:px-3 k:py-2.5' : 'k:items-start k:p-4',
        props.class,
      )
    "
    :role="role"
    :data-tone="tone"
  >
    <span v-if="iconComp" class="k:shrink-0 k:text-(--ka-icon)">
      <KIcon :icon="iconComp" :size="size === 'sm' ? 'sm' : 'md'" />
      <span class="k:sr-only">{{ t(`alert.tone.${tone}` as MessageKey) }}</span>
    </span>
    <div class="k:grid k:min-w-0 k:flex-1 k:gap-1">
      <p v-if="(title || $slots.title) && size === 'md'" class="k:m-0 k:-mt-0.5 k:text-body-strong">
        <slot name="title">{{ title }}</slot>
      </p>
      <div v-if="$slots.default"><slot /></div>
      <div v-if="$slots.actions" class="k:mt-2 k:flex k:flex-wrap k:items-center k:gap-2">
        <slot name="actions" />
      </div>
    </div>
    <KIconButton
      v-if="dismissible"
      :icon="X"
      :label="t('alert.dismiss')"
      size="sm"
      :tooltip="false"
      class="k:-my-1.5 k:-mr-1.5"
      @click="emit('dismiss')"
    />
  </div>
</template>
