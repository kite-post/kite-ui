<script setup lang="ts">
import { ConfigProvider, TooltipProvider } from 'reka-ui'
import { computed, onMounted, provide, ref, toRef } from 'vue'

import KConfirmHost from '../components/alert-dialog/KConfirmHost.vue'
import KToaster from '../components/toast/KToaster.vue'
import { builtInMessages, type Locale, type Messages } from '../lib/messages'
import { kiteConfigKey } from './context'

const props = withDefaults(
  defineProps<{
    /** Мова службових текстів і форматерів. */
    locale?: Locale
    /** Перевизначення текстів компонентів. */
    messages?: Partial<Messages>
    /** Затримка тултіпів, мс. */
    tooltipDelay?: number
    /** Рендерити регіон тостів (useToast) і хост підтверджень (useConfirm). */
    toaster?: boolean
  }>(),
  { locale: 'uk', tooltipDelay: 500, toaster: true },
)

defineSlots<{ default(): unknown }>()

const locale = toRef(props, 'locale')
const messages = computed<Messages>(() => ({
  ...builtInMessages[locale.value],
  ...props.messages,
}))

const polite = ref('')
const assertive = ref('')
function announce(text: string, politeness: 'polite' | 'assertive' = 'polite') {
  const target = politeness === 'assertive' ? assertive : polite
  // Скидання перед записом: однаковий текст поспіль теж має прозвучати.
  target.value = ''
  requestAnimationFrame(() => (target.value = text))
}

provide(kiteConfigKey, { locale, messages, announce })

onMounted(() => {
  if (typeof document !== 'undefined' && !document.documentElement.lang) {
    document.documentElement.lang = locale.value
  }
})
</script>

<template>
  <ConfigProvider :locale="locale" dir="ltr">
    <TooltipProvider :delay-duration="tooltipDelay" :skip-delay-duration="300">
      <slot />
      <template v-if="toaster">
        <KToaster />
        <KConfirmHost />
      </template>
    </TooltipProvider>
  </ConfigProvider>
  <div class="k:sr-only" aria-live="polite" aria-atomic="true" data-kite-announcer>
    {{ polite }}
  </div>
  <div class="k:sr-only" aria-live="assertive" aria-atomic="true" data-kite-announcer>
    {{ assertive }}
  </div>
</template>
