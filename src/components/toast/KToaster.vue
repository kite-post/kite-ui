<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useMessages } from '../../config/context'
import KToastItem from './KToastItem.vue'
import { MAX_VISIBLE, toastState } from './store'

// Регіон тостів: один на застосунок (його ставить KConfigProvider).
const { t } = useMessages()
const region = ref<HTMLElement>()
const hidden = ref(false)

// Новіші — знизу; видно до трьох, решта чекає.
const visible = computed(() => toastState.items.slice(0, MAX_VISIBLE))

function onVisibility() {
  hidden.value = document.visibilityState === 'hidden'
}
// F8 переводить фокус у регіон, як у Reka ToastViewport.
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'F8' && visible.value.length) {
    event.preventDefault()
    region.value?.querySelector<HTMLElement>('.kite-toast')?.focus()
  }
}

onMounted(() => {
  toastState.hosts++
  document.addEventListener('visibilitychange', onVisibility)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  toastState.hosts--
  document.removeEventListener('visibilitychange', onVisibility)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section
    ref="region"
    :aria-label="t('toast.region')"
    class="kite-toaster k:pointer-events-none k:fixed k:inset-x-0 k:bottom-0 k:z-[1400] k:flex k:justify-center k:px-4 k:pb-[calc(1rem+env(safe-area-inset-bottom,0px))] k:sm:right-0 k:sm:left-auto k:sm:justify-end"
  >
    <ol class="k:m-0 k:flex k:w-full k:list-none k:flex-col k:gap-2 k:p-0 k:sm:w-auto">
      <KToastItem v-for="item in visible" :key="item.id" :toast="item" :paused="hidden" />
    </ol>
  </section>
</template>
