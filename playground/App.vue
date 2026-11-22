<script setup lang="ts">
import { CircleCheck, Copy, Ellipsis, Plus, Printer, Trash2, Truck, ArrowRight } from '@lucide/vue'

import {
  KBadge,
  KButton,
  KCard,
  KCardContent,
  KCardFooter,
  KCardHeader,
  KConfigProvider,
  KIcon,
  KIconButton,
  KKbd,
  KLink,
  KSeparator,
  KSpinner,
  KTooltip,
  useTheme,
} from '../src'
import PlaygroundWave2 from './PlaygroundWave2.vue'
import PlaygroundWave3 from './PlaygroundWave3.vue'
import PlaygroundWave4 from './PlaygroundWave4.vue'

const { theme, setTheme } = useTheme()
const variants = ['primary', 'secondary', 'ghost', 'danger', 'link'] as const
const tones = ['neutral', 'info', 'success', 'warning', 'danger'] as const
</script>

<template>
  <KConfigProvider>
    <main class="k:mx-auto k:grid k:max-w-[1100px] k:gap-8 k:p-8">
      <header class="k:flex k:items-center k:gap-4">
        <h1 class="k:m-0 k:font-display k:text-h1">Хвиля 1</h1>
        <span class="k:ml-auto k:flex k:gap-2">
          <KButton
            v-for="t in ['light', 'system', 'dark'] as const"
            :key="t"
            size="sm"
            :variant="theme === t ? 'primary' : 'secondary'"
            @click="setTheme(t)"
            >{{ t }}</KButton
          >
        </span>
      </header>

      <KCard>
        <KCardHeader title="KButton" description="5 варіантів × 3 розміри, loading і disabled" />
        <KCardContent class="k:grid k:gap-4">
          <div v-for="v in variants" :key="v" class="k:flex k:flex-wrap k:items-center k:gap-3">
            <KButton :variant="v" size="sm">Оплатити</KButton>
            <KButton :variant="v" :leading-icon="Plus">Створити накладну</KButton>
            <KButton :variant="v" size="lg" :trailing-icon="ArrowRight">Далі</KButton>
            <KButton :variant="v" loading>Зберігаємо</KButton>
            <KButton :variant="v" disabled>Недоступно</KButton>
          </div>
        </KCardContent>
      </KCard>

      <KCard>
        <KCardHeader title="KIconButton · KTooltip · KKbd" />
        <KCardContent class="k:flex k:flex-wrap k:items-center k:gap-3">
          <KIconButton :icon="Copy" label="Копіювати номер" size="sm" />
          <KIconButton :icon="Ellipsis" label="Ще дії" />
          <KIconButton :icon="Printer" label="Друкувати" variant="secondary" size="lg" />
          <KIconButton :icon="Plus" label="Створити" variant="primary" />
          <KIconButton :icon="Trash2" label="Видалити" variant="danger" />
          <KIconButton :icon="Copy" label="Вимкнено" disabled />
          <KTooltip content="Пошук" :shortcut="['mod', 'k']"
            ><KButton size="sm">Наведіть: тултіп з клавішею</KButton></KTooltip
          >
          <KKbd :keys="['mod', 'k']" />
          <KKbd :keys="['shift', 'enter']" size="md" />
        </KCardContent>
      </KCard>

      <KCard>
        <KCardHeader title="KBadge · KSpinner · KIcon" />
        <KCardContent class="k:grid k:gap-3">
          <div
            v-for="v in ['subtle', 'solid', 'outline'] as const"
            :key="v"
            class="k:flex k:flex-wrap k:gap-2"
          >
            <KBadge v-for="t in tones" :key="t" :tone="t" :variant="v" :icon="CircleCheck">{{
              t
            }}</KBadge>
          </div>
          <div class="k:flex k:flex-wrap k:items-center k:gap-3">
            <KBadge tone="info" :icon="Truck" size="sm">Їде до Львова</KBadge>
            <KBadge tone="info" :icon="Truck" size="lg">Їде до Львова</KBadge>
            <KBadge tone="success" dot variant="outline">Онлайн</KBadge>
            <KBadge :count="3" tone="danger" variant="solid" size="sm" />
            <KBadge :count="120" tone="info" variant="solid" />
            <KSpinner :delay="0" size="sm" />
            <KSpinner :delay="0" />
            <KSpinner :delay="0" size="xl" class="k:text-fg-link" />
            <KIcon :icon="Truck" size="xs" /><KIcon :icon="Truck" size="sm" /><KIcon
              :icon="Truck"
            /><KIcon :icon="Truck" size="lg" /><KIcon :icon="Truck" size="2xl" />
          </div>
        </KCardContent>
      </KCard>

      <div class="k:grid k:gap-4 k:sm:grid-cols-2 k:lg:grid-cols-3">
        <KCard variant="elevated" interactive>
          <KCardHeader title="KT 1234 5678 5 UA" description="Київ → Львів · 2,4 кг" title-href="#">
            <template #actions><KIconButton :icon="Ellipsis" label="Ще дії" size="sm" /></template>
          </KCardHeader>
          <KCardContent
            ><KBadge tone="success" :icon="CircleCheck">Можна забирати</KBadge></KCardContent
          >
        </KCard>
        <KCard divided>
          <KCardHeader title="Адреса" title-as="h4" />
          <KCardContent class="k:text-body-sm"
            >Відділення №12, Львів, вул. Городоцька, 10</KCardContent
          >
          <KCardFooter
            ><KButton size="sm">Змінити</KButton
            ><KButton size="sm" variant="primary">Підтвердити</KButton></KCardFooter
          >
        </KCard>
        <KCard variant="subtle" padding="sm" selected>
          <KCardHeader title="Експрес" title-as="h4" description="Завтра до 18:00" />
          <KCardContent class="kite-num k:text-h3">140 ₴</KCardContent>
        </KCard>
      </div>

      <KCard>
        <KCardHeader title="KLink · KSeparator" />
        <KCardContent class="k:grid k:gap-4">
          <p class="k:m-0">
            Детальніше про <KLink href="#">тарифи зберігання</KLink> і повернення.
          </p>
          <div class="k:flex k:flex-wrap k:items-center k:gap-4">
            <KLink href="#" variant="standalone" :trailing-icon="ArrowRight"
              >Усі відправлення</KLink
            >
            <KLink href="https://docs.example.com" variant="standalone">Документація API</KLink>
            <KSeparator orientation="vertical" />
            <KLink href="#" variant="subtle">Умови використання</KLink>
          </div>
          <KSeparator />
          <KSeparator label="або" />
        </KCardContent>
      </KCard>

      <PlaygroundWave2 />
      <PlaygroundWave3 />
      <PlaygroundWave4 />
    </main>
  </KConfigProvider>
</template>
