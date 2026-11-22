<script setup lang="ts">
import {
  CircleCheck,
  CircleX,
  File as FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Upload,
  X,
} from '@lucide/vue'
import { computed, onBeforeUnmount, ref, shallowRef, useId, watch, type Component } from 'vue'

import { useMessages } from '../../config/context'
import { cn } from '../../lib/cn'
import { intlLocale } from '../../lib/intl'
import KButton from '../button/KButton.vue'
import { useFieldControl } from '../field/context'
import KIconButton from '../icon-button/KIconButton.vue'
import KIcon from '../icon/KIcon.vue'
import KProgress from '../progress/KProgress.vue'
import type { RejectReason, UploadFn, UploadItem } from './types'
import { acceptLabel, matchesAccept, middleTruncate } from './utils'

const props = withDefaults(
  defineProps<{
    /** '.csv,text/csv', 'image/*,.pdf' */
    accept?: string
    multiple?: boolean
    /** Байти. */
    maxSize?: number
    maxFiles?: number
    variant?: 'dropzone' | 'button'
    /** Функція завантаження. Без неї компонент лише збирає файли. */
    upload?: UploadFn
    /** Підказка під текстом зони. Типово — типи й розмір з accept і maxSize. */
    hint?: string
    name?: string
    id?: string
    invalid?: boolean
    disabled?: boolean
    required?: boolean
    class?: string
  }>(),
  {
    multiple: false,
    variant: 'dropzone',
    invalid: false,
    disabled: false,
    required: false,
  },
)

const model = defineModel<UploadItem[]>({ default: () => [] })
const emit = defineEmits<{
  rejected: [files: File[], reason: RejectReason]
  remove: [item: UploadItem]
  retry: [item: UploadItem]
}>()
defineSlots<{ hint?(): unknown }>()

const { t, locale, announce } = useMessages()
const control = useFieldControl(props, `kite-upload-${useId()}`)
const input = ref<HTMLInputElement>()
const dragging = ref(false)
const problems = ref<string[]>([])
const controllers = new Map<string, AbortController>()

// Робочий список: проп від батька оновлюється лише після його рендеру, а прогрес
// і статуси приходять частіше — тож правимо локальну копію й віддаємо її через v-model.
const items = shallowRef<UploadItem[]>(model.value)
watch(model, (v) => {
  if (v !== items.value) items.value = v
})
function commit(next: UploadItem[]) {
  items.value = next
  model.value = next
}
let seq = 0

function formatSize(bytes: number): string {
  const nf = (n: number, digits: number) =>
    new Intl.NumberFormat(intlLocale(locale.value), { maximumFractionDigits: digits }).format(n)
  if (bytes < 1024) return t('upload.b', { n: bytes })
  if (bytes < 1024 * 1024) return t('upload.kb', { n: nf(bytes / 1024, 0) })
  return t('upload.mb', { n: nf(bytes / 1024 / 1024, 1) })
}

const kinds = {
  image: 'upload.kind.image',
  video: 'upload.kind.video',
  audio: 'upload.kind.audio',
} as const
const types = computed(() =>
  acceptLabel(props.accept, (k) => (k in kinds ? t(kinds[k as keyof typeof kinds]) : undefined)),
)
const hintText = computed(() => {
  if (props.hint !== undefined) return props.hint
  if (types.value && props.maxSize)
    return t('upload.hint', { types: types.value, size: formatSize(props.maxSize) })
  return types.value
})

function iconFor(file: File): Component {
  if (file.type.startsWith('image/')) return FileImage
  if (/\.(csv|xlsx?|ods)$/i.test(file.name)) return FileSpreadsheet
  if (/\.(pdf|txt|docx?)$/i.test(file.name)) return FileText
  return FileIcon
}

function patch(id: string, change: Partial<UploadItem>) {
  commit(items.value.map((item) => (item.id === id ? { ...item, ...change } : item)))
}

async function start(item: UploadItem) {
  if (!props.upload) return
  const controller = new AbortController()
  controllers.set(item.id, controller)
  patch(item.id, { status: 'uploading', progress: 0, error: undefined })
  try {
    const result = await props.upload(item.file, {
      onProgress: (p) => patch(item.id, { progress: Math.max(0, Math.min(100, p)) }),
      signal: controller.signal,
    })
    if (controller.signal.aborted) return
    patch(item.id, { status: 'done', progress: 100, result })
    announce(t('upload.done', { name: item.file.name }))
  } catch (error) {
    if (controller.signal.aborted) return
    const message = error instanceof Error && error.message ? error.message : t('upload.failed')
    patch(item.id, { status: 'error', error: message })
    announce(`${item.file.name}: ${message}`)
  } finally {
    controllers.delete(item.id)
  }
}

function add(files: File[]) {
  if (control.disabled.value || !files.length) return
  const next: string[] = []
  const wrong = files.filter((f) => !matchesAccept(f, props.accept))
  const large = files.filter((f) => !wrong.includes(f) && props.maxSize && f.size > props.maxSize)
  let ok = files.filter((f) => !wrong.includes(f) && !large.includes(f))
  if (wrong.length) {
    emit('rejected', wrong, 'type')
    next.push(t('upload.wrongType', { types: types.value }))
  }
  if (large.length) {
    emit('rejected', large, 'size')
    next.push(t('upload.tooLarge', { size: formatSize(props.maxSize!) }))
  }
  // Один файл без multiple замінює попередній; ліміт — maxFiles або 1.
  const limit = props.multiple ? props.maxFiles : 1
  const base = props.multiple ? items.value : []
  if (!props.multiple) ok = ok.slice(0, 1)
  if (limit !== undefined && base.length + ok.length > limit) {
    const extra = ok.slice(Math.max(0, limit - base.length))
    ok = ok.slice(0, Math.max(0, limit - base.length))
    if (extra.length) {
      emit('rejected', extra, 'count')
      next.push(t('upload.tooMany', { n: limit }))
    }
  }
  problems.value = next
  if (next.length) announce(next.join('. '), 'assertive')
  if (!ok.length) return
  if (!props.multiple) items.value.forEach((i) => controllers.get(i.id)?.abort())
  const added: UploadItem[] = ok.map((file) => ({
    id: `kite-upload-${++seq}`,
    file,
    status: 'pending',
    progress: 0,
  }))
  commit([...base, ...added])
  added.forEach((item) => void start(item))
}

function onChange(event: Event) {
  const el = event.target as HTMLInputElement
  add([...(el.files ?? [])])
  el.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  add([...(event.dataTransfer?.files ?? [])])
}

let depth = 0
function onDragEnter() {
  if (control.disabled.value) return
  depth++
  dragging.value = true
}
function onDragLeave() {
  depth = Math.max(0, depth - 1)
  if (!depth) dragging.value = false
}

// Ctrl/⌘+V у фокусованій зоні додає зображення з буфера.
function onPaste(event: ClipboardEvent) {
  const files = [...(event.clipboardData?.files ?? [])]
  if (!files.length) return
  event.preventDefault()
  add(files)
}

function remove(item: UploadItem) {
  controllers.get(item.id)?.abort()
  commit(items.value.filter((i) => i.id !== item.id))
  emit('remove', item)
}

function retry(item: UploadItem) {
  emit('retry', item)
  void start(item)
}

onBeforeUnmount(() => controllers.forEach((c) => c.abort()))

defineExpose({ open: () => input.value?.click() })
</script>

<template>
  <div
    :class="cn('kite-file-upload k:grid k:min-w-0 k:gap-3', props.class)"
    :data-disabled="control.disabled.value ? '' : undefined"
  >
    <label
      v-if="variant === 'dropzone'"
      :class="
        cn(
          'kite-dropzone k:flex k:cursor-pointer k:flex-col k:items-center k:gap-2 k:rounded-md k:border-[1.5px] k:border-dashed k:border-line-input k:bg-surface k:p-6 k:text-center k:text-body-sm k:text-fg',
          'k:transition-[border-color,background-color,box-shadow] k:duration-100 k:hover:border-line-input-hover',
          'k:has-focus-visible:border-solid k:has-focus-visible:border-line-focus k:has-focus-visible:shadow-[0_0_0_1px_var(--kite-color-border-focus)]',
          dragging && 'k:border-solid k:border-line-focus k:bg-selection-bg',
          control.invalid.value && 'k:border-danger-text k:hover:border-danger-text',
          control.disabled.value &&
            'k:cursor-not-allowed k:border-line k:bg-bg-subtle k:text-fg-disabled k:hover:border-line',
        )
      "
      :data-dragging="dragging ? '' : undefined"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent
      @dragleave.prevent="onDragLeave"
      @drop.prevent="(onDrop($event), (depth = 0))"
      @paste="onPaste"
    >
      <KIcon :icon="Upload" size="lg" class="k:text-fg-muted" />
      <span>
        {{ multiple ? t('upload.dropMany') : t('upload.drop') }}
        <span
          :class="
            cn(
              'k:font-semibold k:underline k:decoration-1 k:underline-offset-[0.2em]',
              !control.disabled.value && 'k:text-fg-link',
            )
          "
          >{{ t('upload.browse') }}</span
        >
      </span>
      <span v-if="hintText || $slots.hint" class="k:text-caption k:text-fg-muted">
        <slot name="hint">{{ hintText }}</slot>
      </span>
      <input
        :id="control.id.value"
        ref="input"
        type="file"
        class="k:sr-only"
        :accept="accept"
        :multiple="multiple"
        :name="name"
        :disabled="control.disabled.value"
        :required="control.required.value && !items.length"
        :aria-describedby="control.field?.describedBy.value"
        :aria-invalid="control.invalid.value ? 'true' : undefined"
        @change="onChange"
      />
    </label>

    <div v-else class="k:flex k:flex-wrap k:items-center k:gap-3" @paste="onPaste">
      <KButton :leading-icon="Upload" :disabled="control.disabled.value" @click="input?.click()">
        {{ t('upload.button') }}
      </KButton>
      <span v-if="hintText" class="k:text-caption k:text-fg-muted">{{ hintText }}</span>
      <input
        :id="control.id.value"
        ref="input"
        type="file"
        class="k:sr-only"
        tabindex="-1"
        aria-hidden="true"
        :accept="accept"
        :multiple="multiple"
        :name="name"
        :disabled="control.disabled.value"
        @change="onChange"
      />
    </div>

    <p
      v-if="problems.length"
      class="k:m-0 k:text-caption k:font-medium k:text-danger-text"
      aria-live="polite"
    >
      {{ problems.join('. ') }}
    </p>

    <ul v-if="items.length" role="list" class="k:m-0 k:grid k:list-none k:gap-2 k:p-0">
      <li
        v-for="item in items"
        :key="item.id"
        :data-status="item.status"
        class="kite-upload-item k:flex k:items-center k:gap-3 k:rounded-md k:border k:border-line k:bg-surface k:py-2 k:pr-2 k:pl-3"
      >
        <KIcon :icon="iconFor(item.file)" class="k:text-fg-muted" />
        <div class="k:grid k:min-w-0 k:flex-1 k:gap-1">
          <div class="k:flex k:items-baseline k:justify-between k:gap-2 k:text-body-sm">
            <span class="k:truncate k:font-medium" :title="item.file.name">{{
              middleTruncate(item.file.name)
            }}</span>
            <span class="kite-num k:shrink-0 k:text-caption k:text-fg-muted">
              {{
                item.status === 'uploading'
                  ? `${Math.round(item.progress)} %`
                  : formatSize(item.file.size)
              }}
            </span>
          </div>
          <KProgress
            v-if="item.status === 'uploading'"
            :value="item.progress"
            size="sm"
            :label="item.file.name"
            hide-label
          />
          <p
            v-if="item.status === 'error'"
            class="k:m-0 k:text-caption k:font-medium k:text-danger-text"
          >
            {{ item.error }}
          </p>
        </div>
        <KIcon
          v-if="item.status === 'done'"
          :icon="CircleCheck"
          class="k:text-success-text"
          :label="t('upload.done', { name: item.file.name })"
        />
        <KIcon
          v-if="item.status === 'error'"
          :icon="CircleX"
          class="k:text-danger-text"
          :label="t('upload.failed')"
        />
        <KIconButton
          v-if="item.status === 'error' && upload"
          :icon="RotateCcw"
          :label="t('upload.retry')"
          size="sm"
          @click="retry(item)"
        />
        <KIconButton
          :icon="X"
          :label="
            item.status === 'uploading'
              ? t('upload.cancel')
              : t('upload.remove', { name: item.file.name })
          "
          size="sm"
          :disabled="control.disabled.value"
          @click="remove(item)"
        />
      </li>
    </ul>
  </div>
</template>
