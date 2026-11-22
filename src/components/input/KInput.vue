<script setup lang="ts">
import { Eye, EyeOff, X } from '@lucide/vue'
import { computed, ref, useAttrs, useId, watchEffect, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { controlClasses, nativeInputClasses, type ControlSize } from '../field/control-styles'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'email' | 'password' | 'url' | 'search' | 'tel'
    size?: ControlSize
    placeholder?: string
    /** Текстовий префікс: ₴, +380. */
    prefix?: string
    /** Текстовий суфікс: кг, см. */
    suffix?: string
    leadingIcon?: Component
    trailingIcon?: Component
    clearable?: boolean
    maxlength?: number
    /** Лічильник символів у рядку підказки KField. */
    showCount?: boolean
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    type: 'text',
    size: 'md',
    clearable: false,
    showCount: false,
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ clear: [] }>()
defineSlots<{ leading?(): unknown; trailing?(): unknown }>()

const attrs = useAttrs()
const { t } = useMessages()
const control = useFieldControl(props, `kite-input-${useId()}`)

const input = ref<HTMLInputElement>()
const reveal = ref(false)
const nativeType = computed(() => (props.type === 'password' && reveal.value ? 'text' : props.type))
const iconSize = computed(() => (props.size === 'sm' ? 'sm' : 'md'))
const canClear = computed(
  () => props.clearable && !!model.value && !control.disabled.value && !control.readonly.value,
)

// Клас — на поверхню, решта атрибутів (autocomplete, inputmode, name…) — на <input>.
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
// Власний опис (підказка формату в KPhoneInput) додається до опису з KField, а не замінює його.
const describedBy = computed(
  () =>
    [attrs['aria-describedby'] as string | undefined, control.ariaAttrs.value['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined,
)

watchEffect(() => {
  if (!props.showCount || props.maxlength === undefined) return
  control.counter.value = t('input.count', { n: model.value.length, max: props.maxlength })
})

function clear() {
  model.value = ''
  emit('clear')
  input.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  // Esc очищає, але не всередині діалогу, де Esc закриває вікно.
  if (event.key === 'Escape' && canClear.value && !input.value?.closest('[role="dialog"]')) {
    event.preventDefault()
    clear()
  }
}

defineExpose({
  focus: () => input.value?.focus(),
  select: () => input.value?.select(),
  el: input,
})
</script>

<template>
  <div
    :class="
      cn(
        controlClasses({
          size,
          invalid: control.invalid.value,
          disabled: control.disabled.value,
          readonly: control.readonly.value,
        }),
        attrs.class as string,
      )
    "
    :style="attrs.style as string"
    :data-size="size"
    :data-invalid="control.invalid.value ? '' : undefined"
    :data-disabled="control.disabled.value ? '' : undefined"
    @mousedown.self.prevent="input?.focus()"
  >
    <slot name="leading">
      <KIcon v-if="leadingIcon" :icon="leadingIcon" :size="iconSize" class="k:text-fg-muted" />
      <span v-if="prefix" class="k:shrink-0 k:text-fg-muted">{{ prefix }}</span>
    </slot>
    <input
      ref="input"
      v-model="model"
      v-bind="{ ...inputAttrs, ...control.ariaAttrs.value, 'aria-describedby': describedBy }"
      :type="nativeType"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="control.disabled.value"
      :readonly="control.readonly.value"
      :required="control.required.value"
      :class="nativeInputClasses(size)"
      @keydown="onKeydown"
    />
    <button
      v-if="canClear"
      type="button"
      tabindex="-1"
      :aria-label="t('input.clear')"
      class="k:grid k:size-6 k:shrink-0 k:cursor-pointer k:place-items-center k:rounded-full k:text-fg-muted k:hover:bg-surface-hover k:hover:text-fg"
      @click="clear"
    >
      <KIcon :icon="X" size="sm" />
    </button>
    <button
      v-if="type === 'password'"
      type="button"
      tabindex="-1"
      :aria-label="reveal ? t('input.hidePassword') : t('input.showPassword')"
      :aria-pressed="reveal ? 'true' : 'false'"
      class="k:grid k:size-6 k:shrink-0 k:cursor-pointer k:place-items-center k:rounded-full k:text-fg-muted k:hover:text-fg"
      @click="reveal = !reveal"
    >
      <KIcon :icon="reveal ? EyeOff : Eye" size="sm" />
    </button>
    <slot name="trailing">
      <span v-if="suffix" class="k:shrink-0 k:text-fg-muted">{{ suffix }}</span>
      <KIcon v-if="trailingIcon" :icon="trailingIcon" :size="iconSize" class="k:text-fg-muted" />
    </slot>
  </div>
</template>
