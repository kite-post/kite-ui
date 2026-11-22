<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, provide, ref, toRef } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIconButton from '../icon-button/KIconButton.vue'
import KSheet from '../sheet/KSheet.vue'
import { appShellKey } from './context'

const props = withDefaults(
  defineProps<{
    contentWidth?: 'full' | 'wide'
    /** Для document.title сторінок: «Прийом · Kite Ops». */
    appName?: string
    class?: string
  }>(),
  { contentWidth: 'full' },
)

defineSlots<{
  sidebar?(props: { inSheet: boolean }): unknown
  'header-start'?(): unknown
  'header-center'?(): unknown
  'header-end'?(): unknown
  default?(): unknown
}>()

const { t, announce } = useMessages()
const mobileOpen = ref(false)

// < lg сайдбар відкривається як KSheet із кнопки в шапці.
const desktop = ref(true)
let media: MediaQueryList | undefined
const onMedia = () => {
  desktop.value = !!media?.matches
  if (desktop.value) mobileOpen.value = false
}
onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  media = window.matchMedia('(min-width: 1024px)')
  onMedia()
  media.addEventListener?.('change', onMedia)
})
onBeforeUnmount(() => media?.removeEventListener?.('change', onMedia))

provide(appShellKey, { appName: toRef(props, 'appName'), announce: (text) => announce(text) })

// Перехід по пункту меню в мобільній панелі закриває її.
function onSheetClick(event: MouseEvent) {
  if ((event.target as HTMLElement).closest('a[href]')) mobileOpen.value = false
}

const main = computed(() =>
  cn(
    'k:w-full k:px-4 k:py-6 k:lg:px-8',
    props.contentWidth === 'wide' && 'k:mx-auto k:max-w-[90rem]',
  ),
)
</script>

<template>
  <div
    :class="cn('kite-app-shell k:flex k:min-h-dvh k:bg-bg k:text-fg', props.class)"
    style="--kite-header-height: 4rem"
  >
    <a
      href="#main"
      class="k:sr-only k:focus:not-sr-only k:focus:fixed k:focus:top-2 k:focus:left-2 k:focus:z-[2000] k:focus:rounded-sm k:focus:bg-surface-raised k:focus:px-4 k:focus:py-2 k:focus:text-label k:focus:text-fg k:focus:shadow-lg"
    >
      {{ t('shell.skipToMain') }}
    </a>

    <aside v-if="$slots.sidebar && desktop" class="k:sticky k:top-0 k:h-dvh k:shrink-0">
      <slot name="sidebar" :in-sheet="false" />
    </aside>

    <div class="k:flex k:min-w-0 k:flex-1 k:flex-col">
      <header
        class="k:sticky k:top-0 k:z-[900] k:flex k:h-(--kite-header-height) k:shrink-0 k:items-center k:gap-3 k:border-b k:border-line k:bg-surface k:px-4 k:lg:px-6"
      >
        <KIconButton
          v-if="$slots.sidebar && !desktop"
          :icon="Menu"
          :label="t('sidebar.open')"
          :tooltip="false"
          @click="mobileOpen = true"
        />
        <div class="k:flex k:min-w-0 k:items-center k:gap-2"><slot name="header-start" /></div>
        <div class="k:flex k:min-w-0 k:flex-1 k:justify-center"><slot name="header-center" /></div>
        <div class="k:flex k:items-center k:gap-1"><slot name="header-end" /></div>
      </header>
      <main
        id="main"
        tabindex="-1"
        :class="cn(main, 'k:outline-none')"
        style="scroll-margin-top: calc(var(--kite-header-height) + 1rem)"
      >
        <slot />
      </main>
    </div>

    <KSheet
      v-if="$slots.sidebar && !desktop"
      v-model:open="mobileOpen"
      side="left"
      :title="t('sidebar.label')"
      class="k:p-0"
    >
      <div class="k:min-h-0 k:flex-1" @click="onSheetClick">
        <slot name="sidebar" :in-sheet="true" />
      </div>
    </KSheet>
  </div>
</template>
