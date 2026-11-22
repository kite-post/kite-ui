<script setup lang="ts">
import { Bell, Inbox, LayoutDashboard, Package, Route, Settings, Truck, Users } from '@lucide/vue'
import { ref } from 'vue'

import {
  KAppShell,
  KAppShellPageHeader,
  KAvatar,
  KButton,
  KCommandPalette,
  KConfigProvider,
  KIconButton,
  KSearchInput,
  KSidebar,
  useToast,
  type CommandSource,
  type SidebarGroup,
} from '../src'
import { shipments } from './data'

const toast = useToast()
const palette = ref(false)
const nav: SidebarGroup[] = [
  {
    items: [{ label: 'Огляд', icon: LayoutDashboard, href: '#', active: true }],
  },
  {
    label: 'Операції',
    collapsible: true,
    items: [
      { label: 'Прийом', icon: Inbox, href: '#', count: 12, countLabel: 'очікують прийому' },
      { label: 'Сортування', icon: Package, href: '#' },
      {
        label: 'Рейси',
        icon: Truck,
        href: '#',
        children: [
          { label: 'Сьогодні', href: '#' },
          { label: 'Архів', href: '#' },
        ],
      },
      { label: 'Маршрути', icon: Route, href: '#', disabled: true },
    ],
  },
  {
    label: 'Адміністрування',
    items: [
      { label: 'Користувачі', icon: Users, href: '#' },
      { label: 'Налаштування', icon: Settings, href: '#' },
    ],
  },
]

const pages: CommandSource = {
  id: 'pages',
  label: 'Розділи',
  search: (q) =>
    ['Прийом', 'Сортування', 'Рейси', 'Користувачі', 'Налаштування']
      .filter((p) => p.toLowerCase().includes(q.toLowerCase()))
      .map((p) => ({ id: p, label: p, onSelect: () => toast.info(`Розділ: ${p}`) })),
}
const cities: CommandSource = {
  id: 'cities',
  label: 'Місто',
  search: (q) =>
    ['Київ', 'Львів', 'Одеса']
      .filter((c) => c.toLowerCase().includes(q.toLowerCase()))
      .map((c) => ({
        id: c,
        label: c,
        onSelect: () => toast.success(`Переадресовано: ${c}`),
      })),
}
const actions: CommandSource = {
  id: 'actions',
  label: 'Дії',
  search: (q) =>
    [
      {
        id: 'new',
        label: 'Створити накладну',
        shortcut: ['mod', 'n'],
        onSelect: () => toast.info('Нова накладна'),
      },
      {
        id: 'redirect',
        label: 'Переадресувати…',
        description: 'Оберіть місто',
        onSelect: () => ({ next: cities }),
      },
    ].filter((a) => a.label.toLowerCase().includes(q.toLowerCase())),
}
const parcels: CommandSource = {
  id: 'parcels',
  label: 'Посилки',
  minQueryLength: 2,
  search: (q, signal) =>
    new Promise((resolve) => {
      const timer = setTimeout(
        () =>
          resolve(
            shipments
              .filter(
                (s) =>
                  s.recipient.toLowerCase().includes(q.toLowerCase()) ||
                  s.number.includes(q.toUpperCase()),
              )
              .slice(0, 5)
              .map((s) => ({
                id: s.id,
                label: s.number,
                description: `${s.recipient} · ${s.city}`,
                icon: Package,
                onSelect: () => toast.info(s.number),
              })),
          ),
        400,
      )
      signal.addEventListener('abort', () => clearTimeout(timer))
    }),
}
</script>

<template>
  <KConfigProvider>
    <KAppShell app-name="Kite Ops">
      <template #sidebar="{ inSheet }">
        <KSidebar :items="nav" :in-sheet="inSheet">
          <template #header="{ collapsed }">
            <div class="k:flex k:h-8 k:items-center k:gap-2 k:px-1 k:font-display k:text-h4">
              <span
                class="k:grid k:size-8 k:shrink-0 k:place-items-center k:rounded-sm k:bg-primary k:text-on-primary"
                >K</span
              >
              <span v-if="!collapsed">Kite Ops</span>
            </div>
          </template>
          <template #footer="{ collapsed }">
            <div class="k:flex k:items-center k:gap-2 k:px-1">
              <KAvatar name="Ольга Ковальчук" size="sm" decorative />
              <span v-if="!collapsed" class="k:truncate k:text-label">Ольга Ковальчук</span>
            </div>
          </template>
        </KSidebar>
      </template>
      <template #header-start><span class="k:text-label k:font-semibold">Хаб Київ</span></template>
      <template #header-center>
        <KSearchInput
          label="Пошук"
          placeholder="Пошук ⌘K"
          readonly
          class="k:max-w-md k:w-full"
          @focus="palette = true"
        />
      </template>
      <template #header-end>
        <KIconButton :icon="Bell" label="Сповіщення" />
        <KAvatar name="Ольга Ковальчук" size="sm" />
      </template>

      <KAppShellPageHeader
        title="Прийом"
        description="Посилки, які чекають на прийом у хабі."
        :breadcrumbs="[{ label: 'Операції', href: '#' }, { label: 'Прийом' }]"
      >
        <template #actions>
          <KButton @click="palette = true">Командна палітра</KButton>
          <KButton variant="primary">Прийняти</KButton>
        </template>
      </KAppShellPageHeader>
      <p v-for="i in 30" :key="i" class="k:text-body k:text-fg-muted">Рядок вмісту {{ i }}</p>
    </KAppShell>
    <KCommandPalette
      v-model:open="palette"
      :sources="[actions, pages, parcels]"
      :open-shipment="(n) => toast.info(`Відкрити ${n}`)"
    />
  </KConfigProvider>
</template>
