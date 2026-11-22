<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'
import { computed, ref, useId, watch } from 'vue'

import { useMessages } from '../../config/context'
import KAlert from '../alert/KAlert.vue'
import KButton from '../button/KButton.vue'
import { provideOverlayKind } from '../dialog/context'
import KIcon from '../icon/KIcon.vue'
import KInput from '../input/KInput.vue'

const props = withDefaults(
  defineProps<{
    /** Питання з дією: «Скасувати накладну KT…?» */
    title: string
    /** Наслідки дії. */
    description?: string
    tone?: 'danger' | 'neutral'
    /** Повторює дію з заголовка: «Скасувати накладну». */
    confirmLabel: string
    cancelLabel?: string
    /** Текст, який треба ввести для підтвердження. */
    confirmText?: string
    /** Виконати дію; поки проміс не завершено — loading. Діалог закривається після успіху. */
    onConfirm?: () => Promise<void> | void
    /** Помилка виконання (або текст, який кинув onConfirm). */
    error?: string | null
  }>(),
  { tone: 'danger', error: null },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: []; cancel: [] }>()
defineSlots<{ trigger?(): unknown; default?(): unknown }>()

provideOverlayKind('dialog')
const { t } = useMessages()
const inputId = `kite-confirm-${useId()}`
const typed = ref('')
const loading = ref(false)
const ownError = ref<string | null>(null)
const cancelBtn = ref<InstanceType<typeof KButton>>()
const confirmInput = ref<InstanceType<typeof KInput>>()

const canConfirm = computed(() => !props.confirmText || typed.value === props.confirmText)
const shownError = computed(() => props.error ?? ownError.value)

watch(open, (v) => {
  if (v) {
    typed.value = ''
    ownError.value = null
  }
})

// Фокус — на безпечну дію або на поле підтвердження, не на деструктивну кнопку.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  if (props.confirmText) confirmInput.value?.focus()
  else (cancelBtn.value as unknown as { $el?: HTMLElement })?.$el?.focus()
}

function cancel() {
  emit('cancel')
  open.value = false
}

async function confirm() {
  if (!canConfirm.value || loading.value) return
  emit('confirm')
  if (!props.onConfirm) {
    open.value = false
    return
  }
  loading.value = true
  ownError.value = null
  try {
    await props.onConfirm()
    open.value = false
  } catch (e) {
    ownError.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

function onOpenChange(v: boolean) {
  if (!v && loading.value) return
  if (!v) cancel()
  else open.value = true
}
</script>

<template>
  <AlertDialogRoot :open="open" @update:open="onOpenChange">
    <AlertDialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="kite-scrim k:fixed k:inset-0 k:z-[1100] k:bg-scrim" />
      <div
        class="k:pointer-events-none k:fixed k:inset-0 k:z-[1200] k:flex k:items-end k:justify-center k:p-4 k:sm:items-center k:sm:p-8"
      >
        <AlertDialogContent
          class="kite-dialog k:pointer-events-auto k:flex k:max-h-[calc(100dvh-2rem)] k:w-full k:flex-col k:gap-4 k:overflow-y-auto k:rounded-lg k:border k:border-raised-border k:bg-surface-raised k:p-6 k:text-fg k:shadow-xl k:outline-none k:sm:max-w-[25rem]"
          data-size="sm"
          @open-auto-focus="onOpenAutoFocus"
        >
          <span
            v-if="tone === 'danger'"
            class="k:grid k:size-12 k:place-items-center k:rounded-full k:bg-danger-subtle k:text-danger-text"
          >
            <KIcon :icon="TriangleAlert" size="lg" />
          </span>
          <div>
            <AlertDialogTitle class="k:m-0 k:font-display k:text-h3 k:text-balance">
              {{ title }}
            </AlertDialogTitle>
            <AlertDialogDescription
              v-if="description"
              class="k:mt-1 k:mb-0 k:text-body-sm k:text-fg-muted"
            >
              {{ description }}
            </AlertDialogDescription>
          </div>
          <slot />
          <div v-if="confirmText" class="k:grid k:gap-1">
            <label :for="inputId" class="k:text-label">{{
              t('alert.confirmPrompt', { text: confirmText })
            }}</label>
            <KInput
              :id="inputId"
              ref="confirmInput"
              v-model="typed"
              autocomplete="off"
              @keydown.enter="confirm"
            />
          </div>
          <KAlert v-if="shownError" tone="danger" size="sm" live="assertive">{{
            shownError
          }}</KAlert>
          <div
            class="k:flex k:flex-col-reverse k:gap-3 k:pt-2 k:sm:flex-row k:sm:justify-end k:[&>*]:w-full k:sm:[&>*]:w-auto"
          >
            <KButton ref="cancelBtn" :disabled="loading" @click="cancel">
              {{ cancelLabel ?? t('alert.cancel') }}
            </KButton>
            <KButton
              :variant="tone === 'danger' ? 'danger' : 'primary'"
              :disabled="!canConfirm"
              :loading="loading"
              @click="confirm"
            >
              {{ confirmLabel }}
            </KButton>
          </div>
        </AlertDialogContent>
      </div>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
