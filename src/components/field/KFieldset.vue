<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
import { computed, useId } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'

// Внутрішній каркас груп (KCheckboxGroup, KRadioGroup): fieldset + legend + підказка + помилка.
const props = defineProps<{
  label: string
  hint?: string | undefined
  error?: string | null | undefined
  optional?: boolean | undefined
  disabled?: boolean | undefined
  class?: string | undefined
}>()

defineSlots<{ default(props: { legendId: string; describedBy: string | undefined }): unknown }>()

const { t } = useMessages()
const base = useId()
const legendId = `kite-legend-${base}`
const msgId = `kite-legend-${base}-msg`
const describedBy = computed(() => (props.error || props.hint ? msgId : undefined))
</script>

<template>
  <fieldset
    :class="cn('kite-fieldset k:m-0 k:grid k:min-w-0 k:gap-3 k:border-0 k:p-0', props.class)"
    :disabled="disabled"
    :aria-describedby="describedBy"
    :data-invalid="error ? '' : undefined"
  >
    <legend
      :id="legendId"
      :class="cn('k:mb-1 k:p-0 k:text-label k:text-fg', disabled && 'k:text-fg-disabled')"
    >
      {{ label }}
      <span v-if="optional" class="k:ml-1 k:font-normal k:text-fg-muted">{{
        t('field.optional')
      }}</span>
    </legend>
    <slot :legend-id="legendId" :described-by="describedBy" />
    <p
      v-if="error"
      :id="msgId"
      class="k:m-0 k:flex k:items-start k:gap-1.5 k:text-caption k:font-medium k:text-danger-text"
      aria-live="polite"
    >
      <KIcon :icon="CircleAlert" size="sm" />{{ error }}
    </p>
    <p v-else-if="hint" :id="msgId" class="k:m-0 k:text-caption k:text-fg-muted">{{ hint }}</p>
  </fieldset>
</template>
