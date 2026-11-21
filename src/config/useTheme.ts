import { computed, onScopeDispose, ref, type ComputedRef, type Ref } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'kite-theme'

const isBrowser = typeof window !== 'undefined'

function readStored(): ThemePreference {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

function apply(pref: ThemePreference) {
  const root = document.documentElement
  if (pref === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', pref)
}

// Один стан на застосунок: кілька викликів useTheme бачать ту саму тему.
const preference = ref<ThemePreference>(isBrowser ? readStored() : 'system')
const systemDark = ref(false)
let mql: MediaQueryList | undefined
let subscribers = 0
const onChange = (e: MediaQueryListEvent) => (systemDark.value = e.matches)

/** Тема light / dark / system зі збереженням вибору (стайлгайд 2.3). */
export function useTheme(): {
  theme: Ref<ThemePreference>
  resolved: ComputedRef<ResolvedTheme>
  setTheme: (t: ThemePreference) => void
} {
  if (isBrowser && window.matchMedia) {
    mql ??= window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mql.matches
    if (subscribers++ === 0) mql.addEventListener('change', onChange)
    onScopeDispose(() => {
      if (--subscribers === 0) mql?.removeEventListener('change', onChange)
    })
  }

  const resolved = computed<ResolvedTheme>(() =>
    preference.value === 'system' ? (systemDark.value ? 'dark' : 'light') : preference.value,
  )

  function setTheme(t: ThemePreference) {
    preference.value = t
    if (!isBrowser) return
    apply(t)
    try {
      if (t === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY)
      else window.localStorage.setItem(THEME_STORAGE_KEY, t)
    } catch {
      /* сховище недоступне — тема діє до перезавантаження */
    }
  }

  return { theme: preference, resolved, setTheme }
}

/**
 * Скрипт для <head> застосунку, до стилів: ставить збережену тему до першого рендеру,
 * щоб не було спалаху світлої теми.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`
