<script setup lang="ts">
import { computed, useAttrs, type Component } from 'vue'

import { cn } from '../../lib/cn'
import KButton from '../button/KButton.vue'
import { iconButtonSize, type ButtonSize } from '../button/variants'
import KIcon from '../icon/KIcon.vue'
import KTooltip from '../tooltip/KTooltip.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Іконка Lucide. */
    icon: Component
    /** Назва дії: aria-label і текст тултіпа. Обов'язкова. */
    label: string
    variant?: 'ghost' | 'secondary' | 'primary' | 'danger'
    size?: ButtonSize
    /** Показувати тултіп з назвою. */
    tooltip?: boolean
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    as?: string | Component
    asChild?: boolean
  }>(),
  {
    variant: 'ghost',
    size: 'md',
    tooltip: true,
    type: 'button',
    disabled: false,
    loading: false,
    as: 'button',
    asChild: false,
  },
)

const attrs = useAttrs()
const iconSize = computed(() => ({ sm: 'sm', md: 'md', lg: 'lg' }) as const)
const buttonProps = computed(() => ({
  variant: props.variant,
  size: props.size,
  type: props.type,
  disabled: props.disabled,
  loading: props.loading,
  as: props.as,
  asChild: props.asChild,
}))
</script>

<template>
  <KTooltip v-if="tooltip && !disabled" :content="label">
    <KButton
      v-bind="{ ...attrs, ...buttonProps }"
      :aria-label="label"
      :class="cn('kite-icon-button', iconButtonSize[size], attrs.class as string)"
    >
      <KIcon :icon="icon" :size="iconSize[size]" />
    </KButton>
  </KTooltip>
  <KButton
    v-else
    v-bind="{ ...attrs, ...buttonProps }"
    :aria-label="label"
    :class="cn('kite-icon-button', iconButtonSize[size], attrs.class as string)"
  >
    <KIcon :icon="icon" :size="iconSize[size]" />
  </KButton>
</template>
