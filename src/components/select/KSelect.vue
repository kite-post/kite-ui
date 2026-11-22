<script setup lang="ts">
import { ChevronDown, X } from '@lucide/vue'
import {
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed, ref, useAttrs, useId, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { controlClasses, type ControlSize } from '../field/control-styles'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'
import KSelectItem from './KSelectItem.vue'

defineOptions({ inheritAttrs: false })

export interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: Component
  disabled?: boolean
  /** Назва групи; варіанти з однаковою групою йдуть разом. */
  group?: string
}

const props = withDefaults(
  defineProps<{
    options?: SelectOption[]
    placeholder?: string
    /** Кнопка очищення поряд із тригером. */
    clearable?: boolean
    size?: ControlSize
    /** Для відправки нативної форми. */
    name?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    clearable: false,
    size: 'md',
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

const model = defineModel<string | null>({ default: null })
const open = defineModel<boolean>('open', { default: false })
defineSlots<{
  default?(): unknown
  value?(props: { option: SelectOption | undefined }): unknown
}>()

const attrs = useAttrs()
const { t } = useMessages()
const control = useFieldControl(props, `kite-select-${useId()}`)
const trigger = ref<InstanceType<typeof SelectTrigger>>()

// Reka позначає «нічого не обрано» як undefined, кіт — як null.
const value = computed({
  get: () => model.value ?? undefined,
  set: (v: string | undefined) => (model.value = v ?? null),
})
const isOpen = computed({
  get: () => !control.readonly.value && open.value,
  set: (v: boolean) => {
    if (!control.readonly.value) open.value = v
  },
})

const selected = computed(() => props.options?.find((o) => o.value === model.value))

// Групи в порядку першої появи; варіанти без групи — одним блоком на початку.
const groups = computed(() => {
  const map = new Map<string, SelectOption[]>()
  for (const o of props.options ?? []) {
    const key = o.group ?? ''
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(o)
  }
  return [...map.entries()].map(([label, items]) => ({ label, items }))
})

const canClear = computed(
  () =>
    props.clearable && model.value !== null && !control.disabled.value && !control.readonly.value,
)

function clear() {
  model.value = null
  ;(trigger.value?.$el as HTMLElement | undefined)?.focus()
}
</script>

<template>
  <div
    :class="cn('kite-select k:relative k:min-w-0', attrs.class as string)"
    :style="attrs.style as string"
  >
    <SelectRoot
      v-model="value"
      v-model:open="isOpen"
      :name="name"
      :disabled="control.disabled.value"
      :required="control.required.value"
    >
      <SelectTrigger
        ref="trigger"
        v-bind="control.ariaAttrs.value"
        :class="
          cn(
            controlClasses({
              size,
              invalid: control.invalid.value,
              disabled: control.disabled.value,
              readonly: control.readonly.value,
            }),
            'k:group/trigger k:cursor-pointer k:justify-between k:text-left k:outline-none',
            'k:focus-visible:border-line-focus k:focus-visible:shadow-[0_0_0_1px_var(--kite-color-border-focus)]',
            'k:data-[state=open]:border-line-focus k:data-[state=open]:shadow-[0_0_0_1px_var(--kite-color-border-focus)]',
            control.readonly.value && 'k:cursor-default',
            canClear && 'k:pr-16',
            size === 'sm' ? 'k:text-body k:sm:text-body-sm' : 'k:text-body',
          )
        "
        :data-size="size"
      >
        <SelectValue
          :placeholder="placeholder ?? t('select.placeholder')"
          class="k:min-w-0 k:flex-1 k:truncate k:data-placeholder:text-fg-muted"
        >
          <slot v-if="$slots.value && selected" name="value" :option="selected" />
          <template v-else-if="selected">{{ selected.label }}</template>
        </SelectValue>
        <KIcon
          :icon="ChevronDown"
          :size="size === 'sm' ? 'sm' : 'md'"
          class="k:text-fg-muted k:transition-transform k:duration-200 k:group-data-[state=open]/trigger:rotate-180"
        />
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          position="popper"
          :side-offset="4"
          :collision-padding="8"
          class="kite-select-content k:z-[1000] k:max-h-[min(20rem,var(--reka-select-content-available-height))] k:min-w-(--reka-select-trigger-width) k:overflow-hidden k:rounded-md k:border k:border-raised-border k:bg-surface-raised k:shadow-lg"
        >
          <SelectViewport class="k:p-1">
            <template v-if="options">
              <template v-for="(g, gi) in groups" :key="g.label || gi">
                <SelectSeparator v-if="gi > 0" class="k:my-1 k:h-px k:bg-line" />
                <SelectGroup>
                  <SelectLabel
                    v-if="g.label"
                    class="k:px-3 k:pt-2 k:pb-1 k:text-overline k:text-fg-muted k:uppercase"
                  >
                    {{ g.label }}
                  </SelectLabel>
                  <KSelectItem
                    v-for="o in g.items"
                    :key="o.value"
                    :value="o.value"
                    :label="o.label"
                    :description="o.description"
                    :icon="o.icon"
                    :disabled="o.disabled"
                  />
                </SelectGroup>
              </template>
            </template>
            <slot v-else />
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

    <button
      v-if="canClear"
      type="button"
      tabindex="-1"
      :aria-label="t('select.clear')"
      :class="
        cn(
          'k:absolute k:top-1/2 k:grid k:size-6 k:-translate-y-1/2 k:cursor-pointer k:place-items-center k:rounded-full k:text-fg-muted k:hover:bg-surface-hover k:hover:text-fg',
          size === 'lg' ? 'k:right-11' : 'k:right-9',
        )
      "
      @click="clear"
    >
      <KIcon :icon="X" size="sm" />
    </button>
  </div>
</template>
