<script setup lang="ts">
import { CloudOff, Package, RotateCw, SearchX } from '@lucide/vue'
import { computed, getCurrentInstance, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KButton from '../button/KButton.vue'
import KIcon from '../icon/KIcon.vue'

type Kind = 'initial' | 'no-results' | 'error'

const props = withDefaults(
  defineProps<{
    /** Три сценарії: перший раз, нічого не знайдено, помилка. */
    kind?: Kind
    title?: string
    description?: string
    icon?: Component
    size?: 'sm' | 'md'
    /** Рівень заголовка: на один нижчий за заголовок зони. */
    headingLevel?: 2 | 3 | 4
    /** Стан кнопки «Спробувати ще» під час повторного запиту. */
    retrying?: boolean
    class?: string
  }>(),
  { kind: 'initial', size: 'md', headingLevel: 3, retrying: false },
)

const emit = defineEmits<{ retry: []; reset: [] }>()
defineSlots<{ actions?(): unknown; illustration?(): unknown }>()

const { t } = useMessages()
// Типова кнопка з'являється, лише якщо застосунок слухає подію.
const listeners = getCurrentInstance()?.vnode.props ?? {}
const hasRetry = 'onRetry' in listeners
const hasReset = 'onReset' in listeners

const defaults = computed(() => {
  if (props.kind === 'no-results')
    return { icon: SearchX, title: t('empty.noResults.title'), text: t('empty.noResults.text') }
  if (props.kind === 'error')
    return { icon: CloudOff, title: t('empty.error.title'), text: t('empty.error.text') }
  return { icon: Package, title: '', text: '' }
})
</script>

<template>
  <div
    :class="
      cn(
        'kite-empty k:mx-auto k:grid k:max-w-[25rem] k:justify-items-center k:gap-2 k:text-center',
        size === 'sm' ? 'k:px-4 k:py-6' : 'k:px-4 k:py-12',
        props.class,
      )
    "
    :data-kind="kind"
  >
    <slot name="illustration">
      <span
        :class="
          cn(
            'k:mb-2 k:grid k:place-items-center k:rounded-full k:bg-bg-subtle k:text-fg-muted',
            size === 'sm' ? 'k:size-14' : 'k:size-20',
          )
        "
      >
        <KIcon :icon="icon ?? defaults.icon" :size="size === 'sm' ? 'lg' : 'xl'" />
      </span>
    </slot>
    <component
      :is="`h${headingLevel}`"
      :class="cn('k:m-0', size === 'sm' ? 'k:text-h4' : 'k:font-display k:text-h3')"
    >
      {{ title ?? defaults.title }}
    </component>
    <p v-if="description ?? defaults.text" class="k:m-0 k:text-body-sm k:text-fg-muted">
      {{ description ?? defaults.text }}
    </p>
    <div
      v-if="$slots.actions || (kind === 'error' && hasRetry) || (kind === 'no-results' && hasReset)"
      class="k:mt-3 k:flex k:flex-wrap k:justify-center k:gap-3"
    >
      <slot name="actions">
        <KButton
          v-if="kind === 'error' && hasRetry"
          :leading-icon="RotateCw"
          :loading="retrying"
          @click="emit('retry')"
        >
          {{ t('empty.error.action') }}
        </KButton>
        <KButton v-if="kind === 'no-results' && hasReset" @click="emit('reset')">
          {{ t('empty.noResults.action') }}
        </KButton>
      </slot>
    </div>
  </div>
</template>
