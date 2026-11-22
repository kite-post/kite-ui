<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed, useId } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    /** null — невизначений прогрес. */
    value?: number | null
    max?: number
    /** Підпис і доступна назва. */
    label?: string
    showValue?: boolean
    /** «240 з 1 000», «2 дні». Типово — відсоток. */
    formatValue?: (value: number, max: number) => string
    tone?: Tone
    size?: 'sm' | 'md'
    class?: string
  }>(),
  { value: null, max: 100, showValue: false, tone: 'info', size: 'md' },
)

const { t } = useMessages()
const labelId = `kite-progress-${useId()}`

const text = computed(() => {
  if (props.value === null) return undefined
  if (props.formatValue) return props.formatValue(props.value, props.max)
  return t('progress.value', { percent: Math.round((props.value / props.max) * 100) })
})
const ratio = computed(() =>
  props.value === null ? 0 : Math.min(1, Math.max(0, props.value / props.max)),
)
const fill: Record<Tone, string> = {
  neutral: 'k:bg-neutral-solid',
  info: 'k:bg-info-solid',
  success: 'k:bg-success-solid',
  warning: 'k:bg-warning-solid',
  danger: 'k:bg-danger-solid',
}
</script>

<template>
  <div :class="cn('kite-progress k:grid k:min-w-0 k:gap-1.5', props.class)" :data-tone="tone">
    <div v-if="label || showValue" class="k:flex k:justify-between k:gap-2 k:text-label">
      <span :id="labelId">{{ label }}</span>
      <span v-if="showValue && text" class="kite-num k:font-normal k:text-fg-muted">{{
        text
      }}</span>
    </div>
    <ProgressRoot
      :model-value="value"
      :max="max"
      :get-value-label="() => text ?? ''"
      :aria-labelledby="label ? labelId : undefined"
      :aria-valuetext="text"
      :class="
        cn(
          'k:relative k:overflow-hidden k:rounded-full k:bg-surface-hover',
          size === 'sm' ? 'k:h-1' : 'k:h-2',
        )
      "
    >
      <ProgressIndicator
        :class="
          cn(
            'k:h-full k:rounded-full',
            fill[tone],
            value === null
              ? 'k:w-[30%] k:animate-[kite-indeterminate_1.5s_var(--kite-ease-in-out)_infinite]'
              : 'k:w-full k:origin-left k:transition-transform k:duration-200',
          )
        "
        :style="value === null ? undefined : { transform: `scaleX(${ratio})` }"
      />
    </ProgressRoot>
  </div>
</template>
