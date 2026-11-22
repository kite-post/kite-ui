<script setup lang="ts">
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KIcon from '../icon/KIcon.vue'
import { dismissToast, type ToastItem } from './store'

const props = defineProps<{ toast: ToastItem; paused: boolean }>()
const { t } = useMessages()

const icon: Partial<Record<ToastItem['tone'], Component>> = {
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  danger: CircleX,
}
// Тост на інверсній поверхні: іконка бере колір тону протилежної теми (стайлгайд 3.2).
const iconColor: Record<ToastItem['tone'], string> = {
  neutral: 'k:text-neutral-text-inverse',
  success: 'k:text-success-text-inverse',
  info: 'k:text-info-text-inverse',
  warning: 'k:text-warning-text-inverse',
  danger: 'k:text-danger-text-inverse',
}

const hovered = ref(false)
const focused = ref(false)
let remaining = props.toast.duration
let startedAt = 0
let timer: ReturnType<typeof setTimeout> | undefined

const shouldRun = computed(() => !props.paused && !hovered.value && !focused.value)

function start() {
  if (!Number.isFinite(remaining)) return
  startedAt = Date.now()
  timer = setTimeout(() => dismissToast(props.toast.id), remaining)
}
function stop() {
  if (timer === undefined) return
  clearTimeout(timer)
  timer = undefined
  remaining -= Date.now() - startedAt
}

watch(shouldRun, (run) => (run ? start() : stop()))
watch(
  () => props.toast.createdAt,
  () => {
    stop()
    remaining = props.toast.duration
    if (shouldRun.value) start()
  },
)
onMounted(() => shouldRun.value && start())
onBeforeUnmount(stop)

function act() {
  props.toast.action?.onClick()
  dismissToast(props.toast.id)
}
</script>

<template>
  <li
    class="kite-toast k:pointer-events-auto k:flex k:w-full k:items-start k:gap-3 k:rounded-md k:bg-surface-inverse k:py-3 k:pr-3 k:pl-4 k:text-body-sm k:text-fg-inverse k:shadow-lg k:sm:w-[22.5rem]"
    data-state="open"
    :data-tone="toast.tone"
    :role="toast.tone === 'danger' ? 'alert' : 'status'"
    tabindex="0"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="focused = false"
    @keydown.esc.stop="dismissToast(toast.id)"
  >
    <KIcon
      v-if="icon[toast.tone]"
      :icon="icon[toast.tone]!"
      :class="cn('k:mt-0.5', iconColor[toast.tone])"
    />
    <div class="k:min-w-0 k:flex-1">
      <p class="k:m-0 k:font-semibold">{{ toast.title }}</p>
      <p v-if="toast.description" class="k:m-0 k:opacity-85">{{ toast.description }}</p>
    </div>
    <button
      v-if="toast.action"
      type="button"
      class="k:-my-1 k:h-8 k:shrink-0 k:cursor-pointer k:rounded-full k:px-3 k:text-label k:font-semibold k:text-inherit k:hover:bg-current/15"
      @click="act"
    >
      {{ toast.action.label }}
    </button>
    <button
      type="button"
      :aria-label="t('toast.close')"
      class="k:-my-1 k:-mr-1 k:grid k:size-8 k:shrink-0 k:cursor-pointer k:place-items-center k:rounded-full k:text-inherit k:hover:bg-current/15"
      @click="dismissToast(toast.id)"
    >
      <KIcon :icon="X" size="sm" />
    </button>
  </li>
</template>
