<script setup lang="ts">
import { Check, CircleAlert } from '@lucide/vue'
import { computed } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import KProgress from '../progress/KProgress.vue'

export interface StepItem {
  title: string
  description?: string
  state?: 'error' | 'disabled'
}

const props = withDefaults(
  defineProps<{
    steps: StepItem[]
    orientation?: 'horizontal' | 'vertical'
    /** Вперед — лише кнопкою «Далі» сторінки; клікабельні тільки пройдені кроки. */
    linear?: boolean
    class?: string
  }>(),
  { orientation: 'horizontal', linear: true },
)

/** Поточний крок, з 1. */
const model = defineModel<number>({ default: 1 })
defineSlots<{ indicator?(props: { step: number; status: Status }): unknown }>()

type Status = 'complete' | 'current' | 'upcoming' | 'error' | 'disabled'
const { t } = useMessages()

const view = computed(() =>
  props.steps.map((s, i) => {
    const n = i + 1
    const status: Status =
      s.state === 'error'
        ? 'error'
        : s.state === 'disabled'
          ? 'disabled'
          : n < model.value
            ? 'complete'
            : n === model.value
              ? 'current'
              : 'upcoming'
    const clickable =
      status !== 'disabled' && n !== model.value && (n < model.value || !props.linear)
    const statusText =
      status === 'complete'
        ? t('stepper.complete')
        : status === 'current'
          ? t('stepper.current')
          : status === 'error'
            ? t('stepper.error')
            : ''
    const spoken = `${t('stepper.position', { n, total: props.steps.length })}: ${s.title}${statusText ? `, ${statusText}` : ''}`
    return { ...s, n, status, clickable, spoken }
  }),
)
const current = computed(() => view.value[model.value - 1])
const vertical = computed(() => props.orientation === 'vertical')

const indicator: Record<Status, string> = {
  complete: 'k:bg-fg k:text-fg-inverse',
  current: 'k:border-2 k:border-primary k:bg-surface k:text-fg',
  upcoming: 'k:border k:border-line-strong k:bg-surface k:text-fg-muted',
  error: 'k:bg-danger-solid k:text-danger-on-solid',
  disabled: 'k:border k:border-line k:bg-surface k:text-fg-disabled',
}
const titleClass: Record<Status, string> = {
  complete: 'k:text-fg',
  current: 'k:font-semibold k:text-fg',
  upcoming: 'k:text-fg-muted',
  error: 'k:text-danger-text',
  disabled: 'k:text-fg-disabled',
}
</script>

<template>
  <nav :aria-label="t('stepper.label')" :class="cn('kite-stepper k:min-w-0', props.class)">
    <!-- Вузький екран: компактний рядок замість горизонтального ряду. -->
    <div v-if="!vertical && current" class="k:grid k:gap-2 k:sm:hidden">
      <p class="k:m-0 k:text-label">
        <span class="k:text-fg-muted">{{
          t('stepper.position', { n: model, total: steps.length })
        }}</span>
        · {{ current.title }}
      </p>
      <KProgress :value="model" :max="steps.length" size="sm" :label="current.spoken" hide-label />
    </div>

    <ol
      :class="
        cn('k:m-0 k:list-none k:p-0', vertical ? 'k:grid' : 'k:hidden k:items-start k:sm:flex')
      "
    >
      <li
        v-for="(s, i) in view"
        :key="i"
        :data-status="s.status"
        :aria-current="
          s.status === 'current' || (s.n === model && s.status === 'error') ? 'step' : undefined
        "
        :class="
          cn(
            'kite-step k:relative k:flex k:min-w-0',
            vertical
              ? 'k:gap-3 k:pb-6 k:last:pb-0'
              : 'k:flex-1 k:flex-col k:gap-2 k:last:flex-none',
          )
        "
      >
        <!-- з'єднувач -->
        <span
          v-if="i < view.length - 1"
          aria-hidden="true"
          :class="
            cn(
              'k:absolute k:rounded-full',
              s.status === 'complete' ? 'k:bg-fg' : 'k:bg-line',
              vertical
                ? 'k:top-10 k:bottom-1 k:left-[0.9375rem] k:w-0.5'
                : 'k:top-[0.9375rem] k:right-2 k:left-10 k:h-0.5',
            )
          "
        />
        <component
          :is="s.clickable ? 'button' : 'div'"
          :type="s.clickable ? 'button' : undefined"
          :class="
            cn(
              'k:group/step k:flex k:min-w-0 k:border-0 k:bg-transparent k:p-0 k:text-left k:font-sans',
              vertical ? 'k:flex-row k:items-start k:gap-3' : 'k:flex-col k:items-start k:gap-2',
              s.clickable && 'k:cursor-pointer k:rounded-sm',
            )
          "
          @click="s.clickable && (model = s.n)"
        >
          <span
            :class="
              cn(
                'k:grid k:size-8 k:shrink-0 k:place-items-center k:rounded-full k:text-label k:font-semibold k:tabular-nums',
                'k:transition-shadow k:duration-100',
                s.clickable &&
                  'k:group-hover/step:shadow-[0_0_0_4px_var(--kite-color-surface-hover)]',
                indicator[s.status],
              )
            "
            aria-hidden="true"
          >
            <slot name="indicator" :step="s.n" :status="s.status">
              <KIcon v-if="s.status === 'complete'" :icon="Check" size="sm" />
              <KIcon v-else-if="s.status === 'error'" :icon="CircleAlert" size="sm" />
              <template v-else>{{ s.n }}</template>
            </slot>
          </span>
          <span class="k:grid k:min-w-0 k:gap-0.5 k:pr-2" :class="vertical && 'k:pt-1.5'">
            <span aria-hidden="true" :class="cn('k:text-label', titleClass[s.status])">{{
              s.title
            }}</span>
            <span v-if="s.description" aria-hidden="true" class="k:text-caption k:text-fg-muted">{{
              s.description
            }}</span>
            <span class="k:sr-only">{{ s.spoken }}</span>
          </span>
        </component>
      </li>
    </ol>
  </nav>
</template>
