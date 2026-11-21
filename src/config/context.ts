import { computed, inject, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'

import {
  builtInMessages,
  format,
  type Locale,
  type MessageKey,
  type Messages,
} from '../lib/messages'

export interface KiteConfig {
  locale: Ref<Locale>
  messages: ComputedRef<Messages>
  /** Оголосити текст скрінрідеру через live-регіон провайдера. */
  announce: (text: string, politeness?: 'polite' | 'assertive') => void
}

export const kiteConfigKey: InjectionKey<KiteConfig> = Symbol('kite-config')

// Без провайдера компоненти працюють українською й нічого не оголошують.
const fallbackLocale = ref<Locale>('uk')
const fallback: KiteConfig = {
  locale: fallbackLocale,
  messages: computed(() => builtInMessages[fallbackLocale.value]),
  announce: () => {},
}

export function useKiteConfig(): KiteConfig {
  return inject(kiteConfigKey, fallback)
}

/** Тексти кіта з урахуванням мови й перевизначень застосунку. */
export function useMessages() {
  const config = useKiteConfig()
  const t = (key: MessageKey, params?: Record<string, string | number>): string =>
    format(config.messages.value[key], params)
  return { t, locale: config.locale, announce: config.announce }
}
