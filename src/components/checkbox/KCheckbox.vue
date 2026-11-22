<script setup lang="ts">
import { Check, Minus } from '@lucide/vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { computed, useId } from 'vue'

import { cn } from '../../lib/cn'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'
import { choiceBoxClasses, useCheckboxGroup } from './context'

type CheckedState = boolean | 'indeterminate'

const props = withDefaults(
  defineProps<{
    label?: string
    description?: string
    /** Значення всередині KCheckboxGroup. */
    value?: string
    size?: 'sm' | 'md'
    name?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    required?: boolean
    class?: string
  }>(),
  { size: 'md', invalid: false, disabled: false, required: false },
)

const model = defineModel<CheckedState>({ default: false })
defineSlots<{ default?(): unknown }>()

const group = useCheckboxGroup()
const control = useFieldControl(props, `kite-checkbox-${useId()}`)
const descId = computed(() => `${control.id.value}-desc`)

const size = computed(() => group?.size.value ?? props.size)
const isDisabled = computed(() => control.disabled.value || (group?.disabled.value ?? false))
const isInvalid = computed(() => control.invalid.value || (group?.invalid.value ?? false))

const checked = computed<CheckedState>({
  get: () => (group && props.value !== undefined ? group.isChecked(props.value) : model.value),
  set: (v) => {
    if (group && props.value !== undefined) group.toggle(props.value, v === true)
    else model.value = v
  },
})

const describedBy = computed(
  () =>
    [props.description ? descId.value : null, control.ariaAttrs.value['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined,
)
</script>

<template>
  <label
    :class="
      cn(
        'kite-checkbox k:group/choice k:inline-flex k:items-start k:gap-2 k:text-fg',
        size === 'sm' ? 'k:text-body-sm' : 'k:text-body',
        isDisabled ? 'k:cursor-not-allowed k:text-fg-disabled' : 'k:cursor-pointer',
        props.class,
      )
    "
    :data-disabled="isDisabled ? '' : undefined"
  >
    <CheckboxRoot
      :id="control.id.value"
      v-model="checked"
      :value="value"
      :name="group?.name.value ?? name"
      :disabled="isDisabled"
      :required="control.required.value"
      :aria-invalid="isInvalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      :data-invalid="isInvalid ? '' : undefined"
      :class="
        cn(
          choiceBoxClasses(size),
          'k:rounded-xs',
          isInvalid && 'k:border-danger-text k:group-hover/choice:border-danger-text',
        )
      "
    >
      <CheckboxIndicator class="k:grid k:place-items-center">
        <KIcon
          :icon="checked === 'indeterminate' ? Minus : Check"
          :size="size === 'sm' ? 'xs' : 'sm'"
          class="k:stroke-[2.5]"
        />
      </CheckboxIndicator>
    </CheckboxRoot>
    <span v-if="label || $slots.default || description" class="k:min-w-0">
      <slot>{{ label }}</slot>
      <span v-if="description" :id="descId" class="k:block k:text-caption k:text-fg-muted">
        {{ description }}
      </span>
    </span>
  </label>
</template>
