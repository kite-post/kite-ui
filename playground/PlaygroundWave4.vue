<script setup lang="ts">
import {
  AlignLeft,
  Bold,
  ChevronDown,
  Italic,
  LayoutGrid,
  MapPin,
  Printer,
  Rows3,
  Underline,
} from '@lucide/vue'
import { computed, ref } from 'vue'

import {
  KButton,
  KButtonGroup,
  KCard,
  KCardContent,
  KCardHeader,
  KCombobox,
  KDatePicker,
  KDateRangePicker,
  KDropdownMenu,
  KField,
  KFileUpload,
  KIconButton,
  KNumberField,
  KPinInput,
  KTagsInput,
  KToggle,
  KToggleGroup,
  KToggleGroupItem,
  type ComboboxOption,
  type IsoRange,
  type UploadFn,
  type UploadItem,
} from '../src'

const onlyMine = ref(false)
const onMap = ref(true)
const bold = ref(true)
const kind = ref<string | null>('parcel')
const period = ref<string | null>('week')
const view = ref<string | null>('table')
const formats = ref<string[]>(['bold'])

const weight = ref<number | null>(2.4)
const declared = ref<number | null>(125000)
const places = ref<number | null>(1)

const pin = ref('')
const pinDone = ref('')

const numbers = ref<string[]>(['KT123456785UA', 'KT987654321UA'])
const isS10 = (v: string) =>
  /^[A-Z]{2}\d{9}[A-Z]{2}$/.test(v) ? true : 'Неправильний формат номера'

const cities: ComboboxOption[] = [
  'Київ',
  'Львів',
  'Одеса',
  'Харків',
  'Дніпро',
  'Запоріжжя',
  'Вінниця',
  'Івано-Франківськ',
  'Кам’янець-Подільський',
  'Тернопіль',
  'Ужгород',
  'Чернівці',
  'Луцьк',
  'Рівне',
  'Житомир',
  'Полтава',
  'Черкаси',
].map((c) => ({ value: c, label: c }))
const city = ref<string | null>(null)
const cityFilter = ref<string[]>(['Київ', 'Львів'])

// Імітація віддаленого пошуку відділень.
const branchOptions = ref<ComboboxOption[]>([])
const branchLoading = ref(false)
const branch = ref<string | null>(null)
function searchBranches(q: string) {
  if (q.trim().length < 2) {
    branchOptions.value = []
    return
  }
  branchLoading.value = true
  setTimeout(() => {
    branchOptions.value = [1, 2, 14, 27, 102].map((n) => ({
      value: `b${n}`,
      label: `Відділення №${n}`,
      description: `${q}, вул. Соборна, ${n} · 8:00–20:00`,
      icon: MapPin,
      group: n > 20 ? 'Kite Box' : 'Відділення',
    }))
    branchLoading.value = false
  }, 600)
}

const files = ref<UploadItem[]>([])
const photos = ref<UploadItem[]>([])
const fakeUpload: UploadFn = (file, { onProgress, signal }) =>
  new Promise((resolve, reject) => {
    let p = 0
    const timer = setInterval(() => {
      p += 20
      onProgress(p)
      if (p >= 100) {
        clearInterval(timer)
        if (file.name.includes('bad')) reject(new Error('Сервер не прийняв файл'))
        else resolve({ ok: true })
      }
    }, 300)
    signal.addEventListener('abort', () => clearInterval(timer))
  })

const holdUntil = ref<string | null>(null)
const birth = ref<string | null>(null)
const tomorrow = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})
const in14 = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
})
const isSunday = (iso: string) => new Date(`${iso}T00:00:00`).getDay() === 0
const range = ref<IsoRange | null>(null)
const report = ref<IsoRange | null>(null)
</script>

<template>
  <h2 class="k:m-0 k:font-display k:text-h2">Хвиля 4</h2>

  <KCard>
    <KCardHeader title="Toggle, ToggleGroup, ButtonGroup" />
    <KCardContent class="k:grid k:gap-4">
      <div class="k:flex k:flex-wrap k:items-center k:gap-3">
        <KToggle v-model="onlyMine">Лише мої</KToggle>
        <KToggle v-model="onMap" variant="secondary" :icon="MapPin">Показати на карті</KToggle>
        <KToggle v-model="bold" :icon="Bold" label="Жирний" />
        <KToggle :icon="Italic" label="Курсив" size="sm" />
        <KToggle disabled>Вимкнений</KToggle>
      </div>
      <div class="k:flex k:flex-wrap k:items-center k:gap-3">
        <KToggleGroup v-model="kind" label="Тип відправлення" required>
          <KToggleGroupItem value="docs">Документи</KToggleGroupItem>
          <KToggleGroupItem value="parcel">Посилка</KToggleGroupItem>
          <KToggleGroupItem value="cargo">Вантаж</KToggleGroupItem>
        </KToggleGroup>
        <KToggleGroup v-model="period" label="Період" size="sm">
          <KToggleGroupItem value="day">День</KToggleGroupItem>
          <KToggleGroupItem value="week">Тиждень</KToggleGroupItem>
          <KToggleGroupItem value="month">Місяць</KToggleGroupItem>
        </KToggleGroup>
        <KToggleGroup v-model="view" label="Вид">
          <KToggleGroupItem value="table" :icon="Rows3" label="Таблиця" />
          <KToggleGroupItem value="cards" :icon="LayoutGrid" label="Картки" />
        </KToggleGroup>
        <KToggleGroup v-model="formats" type="multiple" label="Формат" size="lg">
          <KToggleGroupItem value="bold" :icon="Bold" label="Жирний" />
          <KToggleGroupItem value="italic" :icon="Italic" label="Курсив" />
          <KToggleGroupItem value="underline" :icon="Underline" label="Підкреслений" />
          <KToggleGroupItem value="left" :icon="AlignLeft" label="Ліворуч" disabled />
        </KToggleGroup>
      </div>
      <KField label="Тип (block)" class="k:max-w-[28rem]">
        <KToggleGroup v-model="kind" block>
          <KToggleGroupItem value="docs">Документи</KToggleGroupItem>
          <KToggleGroupItem value="parcel">Посилка</KToggleGroupItem>
          <KToggleGroupItem value="cargo">Вантаж</KToggleGroupItem>
        </KToggleGroup>
      </KField>
      <div class="k:flex k:flex-wrap k:items-center k:gap-3">
        <KButtonGroup label="Друк етикетки">
          <KButton :leading-icon="Printer">Друкувати етикетку</KButton>
          <KDropdownMenu :items="[{ label: 'A6' }, { label: 'A4' }, { label: 'ZPL' }]">
            <template #trigger>
              <KIconButton :icon="ChevronDown" label="Інші варіанти" :tooltip="false" />
            </template>
          </KDropdownMenu>
        </KButtonGroup>
        <KButtonGroup variant="primary" label="Створити">
          <KButton>Створити накладну</KButton>
          <KIconButton :icon="ChevronDown" label="Інші варіанти" :tooltip="false" />
        </KButtonGroup>
        <KButtonGroup size="sm" label="Тулбар">
          <KButton>Друк</KButton>
          <KButton>Експорт</KButton>
          <KButton disabled>Архів</KButton>
        </KButtonGroup>
      </div>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="NumberField, PinInput, TagsInput" />
    <KCardContent class="k:grid k:gap-4 k:sm:grid-cols-3">
      <KField label="Вага" hint="До 30 кг">
        <KNumberField v-model="weight" :precision="1" unit="кг" :min="0.1" :max="30" :step="0.1" />
      </KField>
      <KField label="Оголошена вартість">
        <KNumberField v-model="declared" format="money" :stepper="false" :min="0" />
      </KField>
      <KField label="Кількість місць">
        <KNumberField v-model="places" :min="1" :max="10" unit="шт." size="sm" />
      </KField>
      <KField
        label="Код отримання"
        class="k:sm:col-span-3"
        :hint="pinDone ? `Введено: ${pinDone}` : 'Шість цифр з SMS'"
      >
        <KPinInput v-model="pin" :groups="[3, 3]" otp @complete="pinDone = $event" />
      </KField>
      <KField label="Номери накладних" hint="Вставте стовпець з Excel" class="k:sm:col-span-3">
        <KTagsInput
          v-model="numbers"
          :normalize="(v) => v.replace(/\s+/g, '').toUpperCase()"
          :validate="isS10"
          :max="50"
          placeholder="KT…"
        />
      </KField>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="Combobox" />
    <KCardContent class="k:grid k:gap-4 k:sm:grid-cols-3">
      <KField label="Місто">
        <KCombobox v-model="city" :options="cities" placeholder="Почніть вводити" clearable />
      </KField>
      <KField label="Відділення або Kite Box">
        <KCombobox
          v-model="branch"
          :options="branchOptions"
          :filter="false"
          :loading="branchLoading"
          :min-search-length="2"
          placeholder="Номер, адреса або місто"
          @update:search="searchBranches"
        >
          <template #footer>
            <KButton variant="ghost" size="sm" :leading-icon="MapPin" block
              >Показати на карті</KButton
            >
          </template>
        </KCombobox>
      </KField>
      <KField label="Фільтр: міста">
        <KCombobox
          v-model="cityFilter"
          :options="cities"
          multiple
          allow-custom
          :max-visible-chips="2"
        />
      </KField>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="FileUpload" />
    <KCardContent class="k:grid k:gap-4 k:sm:grid-cols-2">
      <KField label="Імпорт відправлень">
        <KFileUpload
          v-model="files"
          accept=".csv,text/csv"
          :max-size="10 * 1024 * 1024"
          :upload="fakeUpload"
        />
      </KField>
      <KField label="Фото до претензії" hint="Назва з «bad» — імітація помилки">
        <KFileUpload
          v-model="photos"
          accept="image/*,.pdf"
          multiple
          :max-files="5"
          variant="button"
          :upload="fakeUpload"
        />
      </KField>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="DatePicker, DateRangePicker" />
    <KCardContent class="k:grid k:gap-4 k:sm:grid-cols-2">
      <KField label="Тримати до" hint="Від завтра до +14 днів, без неділь">
        <KDatePicker
          v-model="holdUntil"
          :min="tomorrow"
          :max="in14"
          :is-date-unavailable="isSunday"
          :presets="[
            { label: 'Завтра', value: tomorrow },
            { label: 'Через тиждень', value: in14 },
          ]"
          clearable
        />
      </KField>
      <KField label="Дата народження">
        <KDatePicker v-model="birth" :calendar="false" />
      </KField>
      <KField label="Період">
        <KDateRangePicker v-model="range" clearable />
      </KField>
      <KField label="Звіт (з підтвердженням)">
        <KDateRangePicker v-model="report" confirm :max-range="31" />
      </KField>
      <p class="k:m-0 k:text-caption k:text-fg-muted k:sm:col-span-2">
        {{ holdUntil }} · {{ birth }} · {{ range }} · {{ report }}
      </p>
    </KCardContent>
  </KCard>
</template>
