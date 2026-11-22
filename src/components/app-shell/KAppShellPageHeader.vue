<script lang="ts">
// Спільний для всіх екземплярів прапорець «це вже не перша сторінка».
let firstPage = true
</script>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KBreadcrumbs, { type BreadcrumbItem } from '../breadcrumbs/KBreadcrumbs.vue'
import { appShellKey } from './context'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    breadcrumbs?: BreadcrumbItem[]
    /** Ставити document.title = «{title} · {appName}». */
    setDocumentTitle?: boolean
    class?: string
  }>(),
  { setDocumentTitle: true },
)
defineSlots<{ actions?(): unknown; default?(): unknown }>()

const { t } = useMessages()
const shell = inject(appShellKey, null)
const heading = ref<HTMLElement>()

function applyTitle() {
  if (!props.setDocumentTitle || typeof document === 'undefined') return
  const app = shell?.appName.value
  document.title = app ? `${props.title} · ${app}` : props.title
}
watch(() => props.title, applyTitle)

// Перша сторінка не забирає фокус; кожна наступна (SPA-перехід) — переводить його на h1
// й оголошує назву, бо браузер цього не зробить.
onMounted(() => {
  applyTitle()
  if (firstPage) {
    firstPage = false
    return
  }
  heading.value?.focus()
  shell?.announce(t('shell.navigated', { title: props.title }))
})
</script>

<template>
  <div :class="cn('kite-page-header k:mb-6 k:grid k:gap-2', props.class)">
    <KBreadcrumbs v-if="breadcrumbs?.length" :items="breadcrumbs" />
    <div class="k:flex k:flex-wrap k:items-start k:justify-between k:gap-x-6 k:gap-y-3">
      <div class="k:grid k:min-w-0 k:gap-1">
        <h1
          ref="heading"
          tabindex="-1"
          class="k:m-0 k:font-display k:text-h2 k:text-fg k:outline-none"
        >
          {{ title }}
        </h1>
        <p v-if="description" class="k:m-0 k:max-w-[65ch] k:text-body k:text-fg-muted">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.actions" class="k:flex k:flex-wrap k:items-center k:gap-2">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>
