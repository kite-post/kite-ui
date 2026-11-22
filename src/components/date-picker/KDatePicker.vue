<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDays, ChevronLeft, ChevronRight, X } from '@lucide/vue'
import {
  DateFieldInput,
  DateFieldRoot,
  DatePickerAnchor,
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
} from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { intlLocale } from '../../lib/intl'
import { controlClasses, type ControlSize } from '../field/control-styles'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'
import { parseLooseDate, toDate, toIso } from './date'
import {
  calendarContent,
  calendarHeader,
  calendarHeading,
  dayCell,
  gridClass,
  headCell,
  literal,
  navButton,
  presetButton,
  segment,
} from './styles'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Межі, 'YYYY-MM-DD'. */
    min?: string
    max?: string
    /** Вихідні відділення, дні без доставки. */
    isDateUnavailable?: (date: string) => boolean
    presets?: { label: string; value: string }[]
    /** false — лише сегменти дд.мм.рррр (дата народження, давні дати). */
    calendar?: boolean
    clearable?: boolean
    size?: ControlSize
    name?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    calendar: true,
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

const attrs = useAttrs()
const { t, locale } = useMessages()
const control = useFieldControl(props, `kite-date-${useId()}`)

// Назовні — рядок ISO, усередині Reka — CalendarDate (ресьорч 03, ризик 3).
const value = computed({
  get: () => toDate(model.value) as DateValue | undefined,
  set: (v: DateValue | undefined) => (model.value = toIso(v)),
})
const isOpen = computed({
  get: () => props.calendar && !control.readonly.value && open.value,
  set: (v: boolean) => (open.value = v),
})

const lang = computed(() => intlLocale(locale.value))
const minValue = computed(() => toDate(props.min))
const maxValue = computed(() => toDate(props.max))
const unavailable = (d: DateValue) => props.isDateUnavailable?.(toIso(d)!) ?? false

const canClear = computed(
  () => props.clearable && !!model.value && !control.disabled.value && !control.readonly.value,
)

function onPaste(event: ClipboardEvent) {
  if (control.disabled.value || control.readonly.value) return
  const iso = parseLooseDate(event.clipboardData?.getData('text') ?? '')
  if (!iso) return
  event.preventDefault()
  model.value = iso
}

function onKeydown(event: KeyboardEvent) {
  if (event.altKey && event.key === 'ArrowDown' && props.calendar) {
    event.preventDefault()
    isOpen.value = true
  }
}

function choosePreset(iso: string) {
  model.value = iso
  open.value = false
}

const surface = computed(() =>
  cn(
    controlClasses({
      size: props.size,
      invalid: control.invalid.value,
      disabled: control.disabled.value,
      readonly: control.readonly.value,
    }),
    'kite-date-field k:gap-1',
    props.size === 'sm' ? 'k:text-body k:sm:text-body-sm' : 'k:text-body',
    attrs.class as string,
  ),
)
const iconButton =
  'k:grid k:size-7 k:shrink-0 k:cursor-pointer k:place-items-center k:rounded-full k:border-0 k:bg-transparent k:text-fg-muted k:hover:bg-surface-hover k:hover:text-fg k:disabled:cursor-not-allowed k:disabled:hover:bg-transparent'
</script>

<template>
  <!-- Без календаря: лише сегменти (патерн GOV.UK для давніх дат). -->
  <DateFieldRoot
    v-if="!calendar"
    :id="control.id.value"
    v-slot="{ segments }"
    v-model="value"
    :locale="lang"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="unavailable"
    :disabled="control.disabled.value"
    :readonly="control.readonly.value"
    :required="control.required.value"
    :name="name"
    :aria-describedby="control.field?.describedBy.value"
    :aria-invalid="control.invalid.value ? 'true' : undefined"
    :class="surface"
    :style="attrs.style as string"
    :data-invalid="control.invalid.value ? '' : undefined"
    @paste="onPaste"
  >
    <span class="k:flex k:min-w-0 k:flex-1 k:items-center">
      <template v-for="item in segments" :key="item.part">
        <DateFieldInput :part="item.part" :class="item.part === 'literal' ? literal : segment">{{
          item.value
        }}</DateFieldInput>
      </template>
    </span>
  </DateFieldRoot>

  <DatePickerRoot
    v-else
    :id="control.id.value"
    v-model="value"
    v-model:open="isOpen"
    :locale="lang"
    :week-starts-on="1"
    weekday-format="short"
    fixed-weeks
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="unavailable"
    :disabled="control.disabled.value"
    :readonly="control.readonly.value"
    :required="control.required.value"
    :name="name"
    close-on-select
  >
    <DatePickerAnchor as-child>
      <DatePickerField
        v-slot="{ segments }"
        :aria-describedby="control.field?.describedBy.value"
        :aria-invalid="control.invalid.value ? 'true' : undefined"
        :class="surface"
        :style="attrs.style as string"
        :data-invalid="control.invalid.value ? '' : undefined"
        @paste="onPaste"
        @keydown="onKeydown"
      >
        <span class="k:flex k:min-w-0 k:flex-1 k:items-center">
          <template v-for="item in segments" :key="item.part">
            <DatePickerInput
              :part="item.part"
              :class="item.part === 'literal' ? literal : segment"
              >{{ item.value }}</DatePickerInput
            >
          </template>
        </span>
        <button
          v-if="canClear"
          type="button"
          tabindex="-1"
          :aria-label="t('date.clear')"
          :class="iconButton"
          @click="model = null"
        >
          <KIcon :icon="X" size="sm" />
        </button>
        <DatePickerTrigger
          v-if="!control.readonly.value"
          :aria-label="t('date.open')"
          :class="cn(iconButton, 'k:-mr-1')"
        >
          <KIcon :icon="CalendarDays" :size="size === 'sm' ? 'sm' : 'md'" />
        </DatePickerTrigger>
      </DatePickerField>
    </DatePickerAnchor>

    <DatePickerContent
      :side-offset="4"
      :collision-padding="8"
      align="start"
      :aria-label="t('date.dialog')"
      :class="calendarContent"
    >
      <div
        v-if="presets?.length"
        class="k:grid k:w-36 k:content-start k:gap-0.5 k:border-r k:border-line k:pr-3"
      >
        <button
          v-for="p in presets"
          :key="p.value"
          type="button"
          :class="presetButton"
          :data-active="p.value === model ? '' : undefined"
          @click="choosePreset(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
      <DatePickerCalendar v-slot="{ weekDays, grid }" :calendar-label="t('date.dialog')">
        <DatePickerHeader :class="calendarHeader">
          <DatePickerPrev :aria-label="t('date.prevMonth')" :class="navButton">
            <KIcon :icon="ChevronLeft" size="sm" />
          </DatePickerPrev>
          <DatePickerHeading :class="calendarHeading" aria-live="polite" />
          <DatePickerNext :aria-label="t('date.nextMonth')" :class="navButton">
            <KIcon :icon="ChevronRight" size="sm" />
          </DatePickerNext>
        </DatePickerHeader>
        <DatePickerGrid v-for="month in grid" :key="month.value.toString()" :class="gridClass">
          <DatePickerGridHead>
            <DatePickerGridRow>
              <DatePickerHeadCell v-for="day in weekDays" :key="day" :class="headCell">
                {{ day }}
              </DatePickerHeadCell>
            </DatePickerGridRow>
          </DatePickerGridHead>
          <DatePickerGridBody>
            <DatePickerGridRow v-for="(week, wi) in month.rows" :key="wi">
              <DatePickerCell v-for="day in week" :key="day.toString()" :date="day" class="k:p-0">
                <DatePickerCellTrigger :day="day" :month="month.value" :class="dayCell" />
              </DatePickerCell>
            </DatePickerGridRow>
          </DatePickerGridBody>
        </DatePickerGrid>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
