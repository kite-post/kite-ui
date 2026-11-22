<script setup lang="ts">
import { computed, useAttrs, type Component } from 'vue'

import { cn } from '../../lib/cn'
import KButton from '../button/KButton.vue'
import { useButtonGroup } from '../button-group/context'
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
    /** Типово ghost; у KButtonGroup — variant групи. */
    variant?: 'ghost' | 'secondary' | 'primary' | 'danger'
    /** Типово md; у KButtonGroup — size групи. */
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
    variant: undefined,
    size: undefined,
    tooltip: true,
    type: 'button',
    disabled: false,
    loading: false,
    as: 'button',
    asChild: false,
  },
)

const attrs = useAttrs()
const group = useButtonGroup()
const size = computed<ButtonSize>(() => props.size ?? group?.size.value ?? 'md')
const iconSize = computed(() => ({ sm: 'sm', md: 'md', lg: 'lg' }) as const)
const buttonProps = computed(() => ({
  variant: props.variant ?? group?.variant.value ?? 'ghost',
  size: size.value,
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
