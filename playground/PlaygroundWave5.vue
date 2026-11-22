<script setup lang="ts">
import { ChevronDown, Inbox, Package, Truck } from '@lucide/vue'
import { ref } from 'vue'

import {
  KAccordion,
  KAccordionItem,
  KAvatar,
  KBadge,
  KBreadcrumbs,
  KButton,
  KCard,
  KCardContent,
  KCardHeader,
  KCollapsible,
  KCollapsibleContent,
  KCollapsibleTrigger,
  KCopyButton,
  KDescriptionItem,
  KDescriptionList,
  KField,
  KInput,
  KPagination,
  KSearchInput,
  KStepper,
  KTab,
  KTabs,
  KTabsList,
  KTabsPanel,
} from '../src'

const query = ref('')
const searched = ref('')
const searching = ref(false)
function onSearch(q: string) {
  searched.value = q
  if (!q) return
  searching.value = true
  setTimeout(() => (searching.value = false), 600)
}

const open = ref<string | null>('when')
const extra = ref(false)
const tab = ref('all')
const page = ref(5)
const pageSize = ref(50)
const cursorPage = ref(1)
const step = ref(2)
const loading = ref(false)
// Локальне «фото» без зовнішніх запитів.
const photo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#7aa7d9"/><circle cx="48" cy="38" r="18" fill="#f3d6c1"/><rect x="18" y="62" width="60" height="40" rx="30" fill="#2d4b73"/></svg>',
  )
</script>

<template>
  <h2 class="k:m-0 k:font-display k:text-h2">Хвиля 5</h2>

  <KCard>
    <KCardHeader title="SearchInput, Avatar, CopyButton" />
    <KCardContent class="k:grid k:gap-4">
      <div class="k:grid k:gap-3 k:sm:grid-cols-2">
        <KSearchInput
          v-model="query"
          label="Пошук відправлень"
          placeholder="Номер, телефон або ПІБ"
          shortcut="/"
          :loading="searching"
          @search="onSearch"
        />
        <KSearchInput variant="filled" shortcut="mod+k" size="sm" label="Пошук по системі" />
      </div>
      <p class="k:m-0 k:text-caption k:text-fg-muted">search: «{{ searched }}»</p>
      <div class="k:flex k:flex-wrap k:items-center k:gap-3">
        <KAvatar name="Ольга Ковальчук" size="sm" />
        <KAvatar name="Ольга Ковальчук" />
        <KAvatar name="Андрій Мельник" size="lg" />
        <KAvatar name="Ірина Петренко" size="lg" />
        <KAvatar name="ТОВ Квітка" shape="square" size="lg" />
        <KAvatar name="Сервіс Тест" />
        <KAvatar />
        <KAvatar name="Фото" :src="photo" size="lg" />
        <KAvatar name="Зламане фото" src="https://invalid.example/x.png" size="lg" />
      </div>
      <div class="k:flex k:flex-wrap k:items-center k:gap-2">
        <span class="k:font-mono k:text-mono">KT 1234 5678 5 UA</span>
        <KCopyButton value="KT123456785UA" label="Копіювати номер" />
        <KCopyButton value="KT123456785UA" with-label size="md" toast />
      </div>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="DescriptionList" />
    <KCardContent class="k:grid k:gap-6">
      <KButton size="sm" class="k:justify-self-start" @click="loading = !loading">
        loading: {{ loading }}
      </KButton>
      <KDescriptionList
        :loading="loading"
        :columns="3"
        :items="[
          { label: 'Відправник', value: 'Ольга Ковальчук' },
          { label: 'Отримувач', value: 'Андрій Мельник' },
          { label: 'Телефон', value: '+380 50 765 43 21' },
          { label: 'Вага', value: '2,4 кг' },
          { label: 'Оголошена вартість', value: null },
          { label: 'Коментар', value: 'Крихке, не кантувати', span: 1 },
        ]"
      />
      <KDescriptionList layout="inline" divided size="sm" :loading="loading">
        <KDescriptionItem label="Номер">
          <span class="k:inline-flex k:items-center k:gap-1 k:font-mono">
            KT 1234 5678 5 UA <KCopyButton value="KT123456785UA" />
          </span>
        </KDescriptionItem>
        <KDescriptionItem label="Статус"><KBadge tone="info">У дорозі</KBadge></KDescriptionItem>
        <KDescriptionItem label="Відділення" value="Львів, №14, вул. Соборна, 14" />
        <KDescriptionItem label="Післяплата" />
      </KDescriptionList>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="Accordion, Collapsible" />
    <KCardContent class="k:grid k:gap-6 k:md:grid-cols-2">
      <KAccordion v-model="open">
        <KAccordionItem value="when" title="Коли прийде посилка?">
          Зазвичай за 1–2 дні між обласними центрами. Точну дату видно на сторінці відстеження.
        </KAccordionItem>
        <KAccordionItem value="where" title="Як змінити відділення?">
          Відкрийте відправлення і натисніть «Переадресувати».
        </KAccordionItem>
        <KAccordionItem value="pay" title="Як оплатити післяплату?" disabled>
          Карткою у відділенні або в застосунку.
        </KAccordionItem>
      </KAccordion>
      <div class="k:grid k:content-start k:gap-4">
        <KAccordion type="multiple" variant="cards" :default-value="['a']">
          <KAccordionItem value="a" title="Габарити"
            >До 30 кг, до 120 см по довшій стороні.</KAccordionItem
          >
          <KAccordionItem value="b" title="Пакування">Коробка, конверт або тубус.</KAccordionItem>
        </KAccordion>
        <KCollapsible v-slot="{ open: isOpen }" v-model:open="extra">
          <KCollapsibleTrigger as-child>
            <KButton variant="link" :trailing-icon="ChevronDown">
              {{ isOpen ? 'Сховати додаткові параметри' : 'Додаткові параметри' }}
            </KButton>
          </KCollapsibleTrigger>
          <KCollapsibleContent>
            <div class="k:grid k:gap-3 k:pt-3">
              <KField label="Код ЄДРПОУ"><KInput /></KField>
              <KField label="Коментар для кур’єра"><KInput /></KField>
            </div>
          </KCollapsibleContent>
        </KCollapsible>
      </div>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="Tabs" />
    <KCardContent class="k:grid k:gap-6">
      <KTabs v-model="tab" label="Відправлення">
        <KTabsList>
          <KTab value="all">Усі</KTab>
          <KTab value="incoming" :icon="Inbox" :count="12">Вхідні</KTab>
          <KTab value="outgoing" :icon="Truck" :count="3">Вихідні</KTab>
          <KTab value="archive" :icon="Package">Архів</KTab>
          <KTab value="drafts">Чернетки</KTab>
          <KTab value="returns">Повернення</KTab>
          <KTab value="claims">Претензії</KTab>
          <KTab value="disabled" disabled>Недоступно</KTab>
        </KTabsList>
        <KTabsPanel value="all">Усі відправлення</KTabsPanel>
        <KTabsPanel value="incoming">12 вхідних</KTabsPanel>
        <KTabsPanel value="outgoing">3 вихідні</KTabsPanel>
        <KTabsPanel value="archive">Архів</KTabsPanel>
        <KTabsPanel value="drafts">Чернетки</KTabsPanel>
        <KTabsPanel value="returns">Повернення</KTabsPanel>
        <KTabsPanel value="claims">Претензії</KTabsPanel>
      </KTabs>
      <KTabs default-value="week" variant="pills" size="sm" label="Період">
        <KTabsList class="k:justify-self-start">
          <KTab value="day">День</KTab>
          <KTab value="week">Тиждень</KTab>
          <KTab value="month">Місяць</KTab>
        </KTabsList>
        <KTabsPanel value="day">Звіт за день</KTabsPanel>
        <KTabsPanel value="week">Звіт за тиждень</KTabsPanel>
        <KTabsPanel value="month">Звіт за місяць</KTabsPanel>
      </KTabs>
      <KTabs routing label="Розділи організації">
        <KTabsList>
          <KTab value="p" href="#profile" active>Профіль</KTab>
          <KTab value="u" href="#users">Користувачі</KTab>
          <KTab value="b" href="#billing">Оплата</KTab>
        </KTabsList>
      </KTabs>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="Breadcrumbs, Pagination, Stepper" />
    <KCardContent class="k:grid k:gap-6">
      <KBreadcrumbs
        :items="[
          { label: 'Головна', href: '#' },
          { label: 'Відправлення', href: '#' },
          { label: 'Реєстри', href: '#' },
          { label: 'Реєстр 24.11', href: '#' },
          { label: 'KT 1234 5678 5 UA' },
        ]"
      />
      <KBreadcrumbs :items="[{ label: 'Налаштування', href: '#' }, { label: 'Профіль' }]" />
      <KPagination v-model:page="page" v-model:page-size="pageSize" :total="1240" />
      <KPagination
        v-model:page="page"
        :page-size="50"
        :total="1240"
        variant="simple"
        size="sm"
        :page-sizes="false"
      />
      <KPagination v-model:page="cursorPage" variant="cursor" :has-prev="cursorPage > 1" has-next />
      <KStepper
        v-model="step"
        :steps="[
          { title: 'Відправник', description: 'Ольга Ковальчук' },
          { title: 'Отримувач' },
          { title: 'Посилка' },
          { title: 'Оплата' },
        ]"
      />
      <div class="k:flex k:gap-2">
        <KButton size="sm" :disabled="step <= 1" @click="step--">Назад</KButton>
        <KButton size="sm" variant="primary" :disabled="step >= 4" @click="step++">Далі</KButton>
      </div>
      <KStepper
        :model-value="3"
        orientation="vertical"
        :linear="false"
        :steps="[
          { title: 'Створено', description: '24.11, 10:12' },
          { title: 'Оплата', state: 'error', description: 'Картку відхилено' },
          { title: 'Передача кур’єру' },
          { title: 'Доставлено', state: 'disabled' },
        ]"
      />
    </KCardContent>
  </KCard>
</template>
