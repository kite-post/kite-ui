<script setup lang="ts">
import { Check, Copy } from '@lucide/vue'
import { computed, onBeforeUnmount, ref } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import KButton from '../button/KButton.vue'
import KIcon from '../icon/KIcon.vue'
import KTooltip from '../tooltip/KTooltip.vue'
import { useToast } from '../toast/store'
import { iconButtonSize } from '../button/variants'

const props = withDefaults(
  defineProps<{
    /** Що копіювати. */
    value: string
    /** Назва дії: «Копіювати номер». */
    label?: string
    size?: 'sm' | 'md'
    /** Показати підпис поряд з іконкою. */
    withLabel?: boolean
    /** Ще й тост — коли кнопка може бути поза полем зору. */
    toast?: boolean
    class?: string
  }>(),
  { size: 'sm', withLabel: false, toast: false },
)

const emit = defineEmits<{ copied: [value: string]; error: [error: unknown] }>()

const { t, announce } = useMessages()
const toaster = useToast()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const name = computed(() => props.label ?? t('copy.label'))

/** Clipboard API, а без нього (http, старі браузери) — тимчасове поле й execCommand. */
async function write(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
  document.body.append(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  if (!ok) throw new Error('execCommand copy failed')
}

async function copy() {
  try {
    await write(props.value)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 2000)
    announce(t('copy.done'))
    if (props.toast) toaster({ id: 'kite-copy', title: t('copy.done'), description: props.value })
    emit('copied', props.value)
  } catch (error) {
    copied.value = false
    toaster.danger(t('copy.error'))
    emit('error', error)
  }
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <KTooltip :content="copied ? t('copy.done') : name" :disabled="withLabel">
    <KButton
      variant="ghost"
      :size="size"
      :aria-label="withLabel ? undefined : name"
      :data-copied="copied ? '' : undefined"
      :class="cn('kite-copy-button', !withLabel && iconButtonSize[size], props.class)"
      @click="copy"
    >
      <KIcon
        :icon="copied ? Check : Copy"
        :size="size === 'sm' ? 'sm' : 'md'"
        :class="copied ? 'k:text-success-text' : undefined"
      />
      <template v-if="withLabel">{{ copied ? t('copy.done') : name }}</template>
    </KButton>
  </KTooltip>
</template>
