<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDays, ChevronLeft, ChevronRight, X } from '@lucide/vue'
import {
  DateRangePickerAnchor,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  type DateRange,
} from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useAttrs, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { intlLocale } from '../../lib/intl'
import KButton from '../button/KButton.vue'
import { defaultRangePresets, formatLong, toDate, toIso, type IsoRange } from '../date-picker/date'
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
} from '../date-picker/styles'
import { controlClasses, type ControlSize } from '../field/control-styles'
import { useFieldControl } from '../field/context'
import KIcon from '../icon/KIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** 'default': Сьогодні, Вчора, 7 днів, 30 днів, Цей місяць, Минулий місяць. [] — без пресетів. */
    presets?: { label: string; value: IsoRange }[] | 'default'
    /** Максимальна довжина в днях. */
    maxRange?: number
    min?: string
    max?: string
    isDateUnavailable?: (date: string) => boolean
    /** Застосовувати лише кнопкою «Застосувати» (дорогі звіти). */
    confirm?: boolean
    /** Типово 2 на ширині ≥ 768 px, інакше 1. */
    months?: 1 | 2
    clearable?: boolean
    size?: ControlSize
    id?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {
    presets: 'default',
    confirm: false,
    clearable: false,
    size: 'md',
    invalid: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)

const model = defineModel<IsoRange | null>({ default: null })
const open = defineModel<boolean>('open', { default: false })

const attrs = useAttrs()
const { t, locale, announce } = useMessages()
const control = useFieldControl(props, `kite-range-${useId()}`)
const lang = computed(() => intlLocale(locale.value))

const toRange = (r: IsoRange | null): DateRange => ({
  start: toDate(r?.start),
  end: toDate(r?.end),
})
function fromRange(r: DateRange | null | undefined): IsoRange | null {
  const start = toIso(r?.start)
  const end = toIso(r?.end)
  if (!start || !end) return null
  // Кінець раніше за початок — міняємо місцями.
  return start <= end ? { start, end } : { start: end, end: start }
}

// У режимі confirm календар працює з чернеткою, а v-model змінюється лише кнопкою.
const draft = ref<IsoRange | null>(model.value)
watch(model, (v) => (draft.value = v))

// Reka тримає і проміжний стан (обрано лише початок), тож календар працює з локальною
// копією, а назовні йде тільки повний діапазон або null.
const source = computed(() => (props.confirm ? draft.value : model.value))
const value = shallowRef<DateRange>(toRange(source.value))
const key = (r: DateRange) => `${toIso(r.start) ?? ''}/${toIso(r.end) ?? ''}`
const same = (a: IsoRange | null, b: IsoRange | null) => a?.start === b?.start && a?.end === b?.end

watch(source, (v) => {
  if (!same(fromRange(value.value), v)) value.value = toRange(v)
})

// Reka повертає нові об'єкти на кожну синхронізацію поля й календаря — приймаємо лише
// справжню зміну дат, інакше вони перезаписують одне одного без кінця.
function onUpdate(r: DateRange) {
  if (key(r) === key(value.value)) return
  value.value = r
  const next = fromRange(r)
  if (!next && (r.start || r.end)) return
  if (same(next, source.value)) return
  if (props.confirm) draft.value = next
  else model.value = next
}

const isOpen = computed({
  get: () => !control.readonly.value && open.value,
  set: (v: boolean) => {
    open.value = v
    if (v) draft.value = model.value
    // Закрили посеред вибору — повертаємо показ до збереженого значення. Новий об'єкт
    // лише за справжньої різниці: Reka на кожну зміну значення знову закриває popover.
    else if (key(value.value) !== key(toRange(model.value))) value.value = toRange(model.value)
  },
})

const presetList = computed(() =>
  props.presets === 'default' ? defaultRangePresets(t) : props.presets,
)
const isActive = (p: IsoRange) => {
  const cur = props.confirm ? draft.value : model.value
  return cur?.start === p.start && cur?.end === p.end
}
function choosePreset(p: IsoRange) {
  if (props.confirm) {
    draft.value = p
    return
  }
  model.value = p
  open.value = false
}

function apply() {
  model.value = draft.value
  open.value = false
}
function reset() {
  draft.value = null
}

// Два місяці поруч — від 768 px.
const wide = ref(true)
let media: MediaQueryList | undefined
const onMedia = () => (wide.value = !!media?.matches)
onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  media = window.matchMedia('(min-width: 768px)')
  onMedia()
  media.addEventListener?.('change', onMedia)
})
onBeforeUnmount(() => media?.removeEventListener?.('change', onMedia))
const monthCount = computed(() => props.months ?? (wide.value ? 2 : 1))

const summary = computed(() =>
  model.value
    ? t('range.summary', {
        start: formatLong(model.value.start, lang.value),
        end: formatLong(model.value.end, lang.value),
      })
    : '',
)
watch(summary, (s) => s && announce(s))

// Межі — computed: нові об'єкти на кожен рендер змушують Reka перераховуватися без кінця.
const minValue = computed(() => toDate(props.min))
const maxValue = computed(() => toDate(props.max))
const unavailable = (d: DateValue) => props.isDateUnavailable?.(toIso(d)!) ?? false
const canClear = computed(
  () => props.clearable && !!model.value && !control.disabled.value && !control.readonly.value,
)

const iconButton =
  'k:grid k:size-7 k:shrink-0 k:cursor-pointer k:place-items-center k:rounded-full k:border-0 k:bg-transparent k:text-fg-muted k:hover:bg-surface-hover k:hover:text-fg'

// Смуга діапазону — на клітинці таблиці, кружечки початку й кінця — на кнопці дня.
const rangeCell = cn(
  'k:p-0',
  'k:has-data-selected:bg-surface-active',
  'k:has-data-selection-start:bg-[linear-gradient(to_right,transparent_50%,var(--kite-color-surface-active)_50%)]',
  'k:has-data-selection-end:bg-[linear-gradient(to_left,transparent_50%,var(--kite-color-surface-active)_50%)]',
  'k:has-[[data-selection-start][data-selection-end]]:bg-none',
)
const rangeDay = cn(
  dayCell,
  'k:data-selected:bg-transparent k:data-selected:text-fg k:data-selected:hover:bg-surface-hover',
  'k:data-selection-end:bg-fg! k:data-selection-end:text-fg-inverse! k:data-selection-start:bg-fg! k:data-selection-start:text-fg-inverse!',
  'k:data-highlighted:outline-1 k:data-highlighted:-outline-offset-1 k:data-highlighted:outline-line-strong k:data-highlighted:outline-dashed',
)
</script>

<template>
  <DateRangePickerRoot
    :id="control.id.value"
    v-model:open="isOpen"
    :model-value="value"
    :locale="lang"
    :week-starts-on="1"
    weekday-format="short"
    fixed-weeks
    :number-of-months="monthCount"
    :min-value="minValue"
    :max-value="maxValue"
    :maximum-days="maxRange"
    :is-date-unavailable="unavailable"
    :disabled="control.disabled.value"
    :readonly="control.readonly.value"
    :required="control.required.value"
    :close-on-select="!confirm"
    @update:model-value="onUpdate"
  >
    <DateRangePickerAnchor as-child>
      <DateRangePickerField
        v-slot="{ segments }"
        :aria-describedby="control.field?.describedBy.value"
        :aria-invalid="control.invalid.value ? 'true' : undefined"
        :class="
          cn(
            controlClasses({
              size,
              invalid: control.invalid.value,
              disabled: control.disabled.value,
              readonly: control.readonly.value,
            }),
            'kite-date-field k:gap-1',
            size === 'sm' ? 'k:text-body k:sm:text-body-sm' : 'k:text-body',
            attrs.class as string,
          )
        "
        :style="attrs.style as string"
        :data-invalid="control.invalid.value ? '' : undefined"
      >
        <span class="k:flex k:min-w-0 k:flex-1 k:items-center k:gap-1.5">
          <span class="k:flex k:items-center">
            <template v-for="item in segments.start" :key="item.part">
              <DateRangePickerInput
                :part="item.part"
                type="start"
                :class="item.part === 'literal' ? literal : segment"
                >{{ item.value }}</DateRangePickerInput
              >
            </template>
          </span>
          <span class="k:text-fg-muted" aria-hidden="true">—</span>
          <span class="k:flex k:items-center">
            <template v-for="item in segments.end" :key="item.part">
              <DateRangePickerInput
                :part="item.part"
                type="end"
                :class="item.part === 'literal' ? literal : segment"
                >{{ item.value }}</DateRangePickerInput
              >
            </template>
          </span>
        </span>
        <span class="k:sr-only" aria-live="polite">{{ summary }}</span>
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
        <DateRangePickerTrigger
          v-if="!control.readonly.value"
          :aria-label="t('date.open')"
          :class="cn(iconButton, 'k:-mr-1')"
        >
          <KIcon :icon="CalendarDays" :size="size === 'sm' ? 'sm' : 'md'" />
        </DateRangePickerTrigger>
      </DateRangePickerField>
    </DateRangePickerAnchor>

    <DateRangePickerContent
      :side-offset="4"
      :collision-padding="8"
      align="start"
      :aria-label="t('range.dialog')"
      :class="cn(calendarContent, 'k:flex-col k:sm:flex-row')"
    >
      <div
        v-if="presetList.length"
        class="k:flex k:gap-0.5 k:overflow-x-auto k:border-line k:pb-2 k:sm:grid k:sm:w-40 k:sm:content-start k:sm:border-r k:sm:pr-3 k:sm:pb-0"
      >
        <button
          v-for="p in presetList"
          :key="p.label"
          type="button"
          :class="cn(presetButton, 'k:w-auto k:sm:w-full')"
          :data-active="isActive(p.value) ? '' : undefined"
          @click="choosePreset(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
      <div class="k:grid k:gap-3">
        <DateRangePickerCalendar v-slot="{ weekDays, grid }" :calendar-label="t('range.dialog')">
          <DateRangePickerHeader :class="calendarHeader">
            <DateRangePickerPrev :aria-label="t('date.prevMonth')" :class="navButton">
              <KIcon :icon="ChevronLeft" size="sm" />
            </DateRangePickerPrev>
            <DateRangePickerHeading :class="calendarHeading" aria-live="polite" />
            <DateRangePickerNext :aria-label="t('date.nextMonth')" :class="navButton">
              <KIcon :icon="ChevronRight" size="sm" />
            </DateRangePickerNext>
          </DateRangePickerHeader>
          <div class="k:flex k:gap-6">
            <DateRangePickerGrid
              v-for="month in grid"
              :key="month.value.toString()"
              :class="gridClass"
            >
              <DateRangePickerGridHead>
                <DateRangePickerGridRow>
                  <DateRangePickerHeadCell v-for="day in weekDays" :key="day" :class="headCell">
                    {{ day }}
                  </DateRangePickerHeadCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridHead>
              <DateRangePickerGridBody>
                <DateRangePickerGridRow v-for="(week, wi) in month.rows" :key="wi">
                  <DateRangePickerCell
                    v-for="day in week"
                    :key="day.toString()"
                    :date="day"
                    :class="rangeCell"
                  >
                    <DateRangePickerCellTrigger :day="day" :month="month.value" :class="rangeDay" />
                  </DateRangePickerCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridBody>
            </DateRangePickerGrid>
          </div>
        </DateRangePickerCalendar>
        <div
          v-if="confirm || maxRange"
          class="k:flex k:items-center k:justify-end k:gap-2 k:border-t k:border-line k:pt-3"
        >
          <span v-if="maxRange" class="k:mr-auto k:text-caption k:text-fg-muted">
            {{ t('range.maxRange', { n: maxRange }) }}
          </span>
          <template v-if="confirm">
            <KButton variant="ghost" size="sm" @click="reset">{{ t('range.reset') }}</KButton>
            <KButton variant="primary" size="sm" :disabled="!draft" @click="apply">
              {{ t('range.apply') }}
            </KButton>
          </template>
        </div>
      </div>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
