<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, useAttrs, watch, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import KSpinner from '../spinner/KSpinner.vue'
import { buttonVariants, type ButtonSize, type ButtonVariant } from './variants'

defineOptions({ inheritAttrs: false })

export interface KButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Нативний тип. Типово button, щоб кнопка у формі випадково її не відправила. */
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  /** На всю ширину контейнера. */
  block?: boolean
  leadingIcon?: Component
  trailingIcon?: Component
  /** Елемент чи компонент кореня: 'a', RouterLink. */
  as?: string | Component
  asChild?: boolean
}

const props = withDefaults(defineProps<KButtonProps>(), {
  variant: 'secondary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  as: 'button',
  asChild: false,
})

defineSlots<{ default?(): unknown; leading?(): unknown; trailing?(): unknown }>()

const attrs = useAttrs()
const { t, announce } = useMessages()

const isNativeButton = computed(() => !props.asChild && props.as === 'button')
const blocked = computed(() => props.disabled || props.loading)
const iconSize = computed(() => (props.size === 'sm' ? 'sm' : 'md'))

const rootAttrs = computed(() => {
  // onClick обробляємо самі, клас зливаємо через cn.
  const { onClick: _onClick, class: _class, ...rest } = attrs
  return rest
})

function onClick(event: MouseEvent) {
  if (blocked.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  const handler = attrs.onClick as
    ((e: MouseEvent) => void) | ((e: MouseEvent) => void)[] | undefined
  if (Array.isArray(handler)) handler.forEach((h) => h(event))
  else handler?.(event)
}

watch(
  () => props.loading,
  (loading) => {
    if (loading) announce(t('button.loading'))
  },
)
</script>

<template>
  <Primitive
    v-bind="rootAttrs"
    :as="as"
    :as-child="asChild"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton && disabled ? true : undefined"
    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    :tabindex="!isNativeButton && disabled ? -1 : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :class="cn(buttonVariants({ variant, size, block }), attrs.class as string)"
    @click="onClick"
  >
    <KSpinner v-if="loading" decorative :size="iconSize" />
    <slot v-else name="leading">
      <KIcon v-if="leadingIcon" :icon="leadingIcon" :size="iconSize" />
    </slot>
    <slot />
    <slot name="trailing">
      <KIcon v-if="trailingIcon" :icon="trailingIcon" :size="iconSize" />
    </slot>
  </Primitive>
</template>
