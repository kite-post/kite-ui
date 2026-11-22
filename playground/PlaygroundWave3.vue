<script setup lang="ts">
import { Ellipsis, ExternalLink, Printer, Route, Trash2 } from '@lucide/vue'
import { ref } from 'vue'

import {
  KAlert,
  KAlertDialog,
  KButton,
  KCard,
  KCardContent,
  KCardHeader,
  KDialog,
  KDialogBody,
  KDialogClose,
  KDialogFooter,
  KDrawer,
  KDropdownMenu,
  KEmptyState,
  KField,
  KIconButton,
  KInput,
  KPopover,
  KProgress,
  KSheet,
  KSheetBody,
  KSheetFooter,
  useConfirm,
  useToast,
  type MenuItem,
} from '../src'

const dialog = ref(false)
const alertOpen = ref(false)
const sheet = ref(false)
const drawer = ref(false)
const toast = useToast()
const confirm = useConfirm()
const showDims = ref(true)
const density = ref('comfortable')

const menu: MenuItem[] = [
  { label: 'Відкрити', icon: ExternalLink },
  { label: 'Друкувати етикетку', icon: Printer, shortcut: ['mod', 'p'] },
  {
    type: 'sub',
    label: 'Переадресувати',
    icon: Route,
    items: [{ label: 'У відділення' }, { label: 'У Kite Box' }],
  },
  { type: 'separator' },
  { label: 'Скасувати накладну', icon: Trash2, danger: true },
]
const columnsMenu = (): MenuItem[] => [
  { type: 'label', label: 'Показувати' },
  {
    type: 'checkbox',
    label: 'Габарити',
    checked: showDims.value,
    onUpdate: (v) => (showDims.value = v),
  },
  { type: 'separator' },
  { type: 'label', label: 'Щільність' },
  {
    type: 'radio',
    value: density.value,
    onUpdate: (v) => (density.value = v),
    options: [
      { value: 'comfortable', label: 'Звичайна' },
      { value: 'compact', label: 'Компактна' },
    ],
  },
]

async function askLeave() {
  const ok = await confirm({
    title: 'Вийти без збереження?',
    description: 'Зміни в накладній не збережуться.',
    confirmLabel: 'Вийти',
    tone: 'neutral',
  })
  toast({ title: ok ? 'Вийшли без збереження' : 'Лишаємося' })
}
function saveRecipient() {
  dialog.value = false
  toast.success('Отримувача змінено')
}
const fakeCancel = () => new Promise<void>((r) => setTimeout(r, 1200))
</script>

<template>
  <h2 class="k:m-0 k:font-display k:text-h2">Хвиля 3</h2>
  <KCard>
    <KCardHeader title="Оверлеї" />
    <KCardContent class="k:flex k:flex-wrap k:items-center k:gap-3">
      <KButton @click="dialog = true">KDialog</KButton>
      <KButton variant="danger" @click="alertOpen = true">KAlertDialog</KButton>
      <KButton @click="askLeave">useConfirm</KButton>
      <KButton @click="sheet = true">KSheet</KButton>
      <KButton @click="drawer = true">KDrawer</KButton>
      <KPopover title="Розрахунок ціни">
        <template #trigger><KButton variant="link">Як рахується ціна?</KButton></template>
        <div class="kite-num k:grid k:gap-1.5">
          <div class="k:flex k:justify-between"><span>Тариф «Стандарт»</span><span>80 ₴</span></div>
          <div class="k:flex k:justify-between"><span>Страхування 0,5 %</span><span>7 ₴</span></div>
          <div class="k:flex k:justify-between k:border-t k:border-line k:pt-2 k:font-bold">
            <span>Разом</span><span>87 ₴</span>
          </div>
        </div>
      </KPopover>
      <KDropdownMenu :items="menu">
        <template #trigger><KIconButton :icon="Ellipsis" label="Ще дії" /></template>
      </KDropdownMenu>
      <KDropdownMenu :items="columnsMenu()" align="start">
        <template #trigger><KButton size="sm">Стовпці</KButton></template>
      </KDropdownMenu>
    </KCardContent>
  </KCard>

  <KDialog
    v-model:open="dialog"
    title="Змінити отримувача"
    description="KT 1234 5678 5 UA · отримувач дізнається про зміну в SMS"
  >
    <KDialogBody>
      <KField label="Ім’я та прізвище"><KInput model-value="Ірина Петренко" /></KField>
      <KField label="Телефон"><KInput prefix="+380" model-value="50 765 43 21" /></KField>
    </KDialogBody>
    <KDialogFooter>
      <KDialogClose><KButton>Скасувати</KButton></KDialogClose>
      <KButton variant="primary" @click="saveRecipient">Зберегти</KButton>
    </KDialogFooter>
  </KDialog>

  <KAlertDialog
    v-model:open="alertOpen"
    title="Скасувати накладну KT 1234 5678 5 UA?"
    description="Кошти — 140 ₴ — повернуться на картку за 3 дні. Посилку не приймуть у відділенні."
    confirm-label="Скасувати накладну"
    :on-confirm="fakeCancel"
    @confirm="() => {}"
  />

  <KSheet v-model:open="sheet" title="KT 1234 5678 5 UA" description="Київ №1 → Львів №12">
    <KSheetBody>
      <KAlert tone="info" size="sm">Їде до Львова · рейс R-118</KAlert>
      <p class="k:m-0">Вага 2,4 кг · мішок M-2231</p>
    </KSheetBody>
    <KSheetFooter>
      <KButton size="sm" :leading-icon="Printer">Етикетка</KButton>
      <KButton size="sm" variant="primary" @click="sheet = false">Готово</KButton>
    </KSheetFooter>
  </KSheet>

  <KDrawer v-model:open="drawer" title="Поруч з вами">
    <KSheetBody>
      <p class="k:m-0">№12 · вул. Городоцька, 10 — 350 м</p>
      <p class="k:m-0">Kite Box №4410 — 600 м</p>
    </KSheetBody>
  </KDrawer>

  <KCard>
    <KCardHeader title="KAlert · KProgress · тости" />
    <KCardContent class="k:grid k:gap-4">
      <KAlert tone="warning" title="Посилка затримується" dismissible>
        Через негоду доставка до Львова займе на день більше.
        <template #actions><KButton size="sm">Переадресувати</KButton></template>
      </KAlert>
      <KAlert tone="danger" title="Не вдалося оплатити">Банк відхилив платіж.</KAlert>
      <div class="k:grid k:gap-3 k:md:grid-cols-2">
        <KAlert tone="success" size="sm">Адресу збережено в адресній книзі</KAlert>
        <KAlert tone="neutral" size="sm">Ціну розраховано на 24 листопада</KAlert>
      </div>
      <KAlert tone="info" variant="banner"
        >Сьогодні з 02:00 до 03:00 ведуться технічні роботи.</KAlert
      >
      <div class="k:grid k:gap-4 k:md:grid-cols-2">
        <KProgress
          :value="240"
          :max="1000"
          label="Імпорт відправлень"
          show-value
          :format-value="(v, m) => `${v} з ${m}`"
        />
        <KProgress
          :value="3"
          :max="5"
          tone="success"
          label="Безкоштовне зберігання"
          show-value
          :format-value="(v, m) => `залишилось ${v} дні з ${m}`"
        />
        <KProgress :value="null" size="sm" label="Формуємо маніфест" />
        <KProgress :value="25" tone="warning" label="Kite Box · комірка 14" show-value />
      </div>
      <div class="k:flex k:flex-wrap k:gap-3">
        <KButton size="sm" @click="toast.success('Адресу збережено')">success</KButton>
        <KButton
          size="sm"
          @click="
            toast({
              title: 'Чернетку видалено',
              description: 'KT 1234 5678 5 UA',
              action: { label: 'Скасувати', onClick: () => toast.info('Відновлено') },
            })
          "
          >з дією</KButton
        >
        <KButton
          size="sm"
          @click="toast.warning('Імпортовано 998 з 1 000', { description: '2 рядки пропущено' })"
          >warning</KButton
        >
        <KButton
          size="sm"
          @click="toast.danger('Не вдалося зберегти', { description: 'Перевірте з’єднання' })"
          >danger</KButton
        >
      </div>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="KEmptyState" />
    <KCardContent class="k:grid k:gap-4 k:md:grid-cols-3">
      <KEmptyState
        title="Тут з’являться ваші відправлення"
        description="Створіть першу накладну — це займе 2 хвилини."
      >
        <template #actions><KButton variant="primary">Створити накладну</KButton></template>
      </KEmptyState>
      <KEmptyState kind="no-results" @reset="() => {}" />
      <KEmptyState kind="error" size="sm" @retry="() => {}" />
    </KCardContent>
  </KCard>
</template>
