import './styles/index.css'

export * from './components'
export { default as KConfigProvider } from './config/KConfigProvider.vue'
export { useKiteConfig, useMessages, type KiteConfig } from './config/context'
export {
  useTheme,
  themeInitScript,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from './config/useTheme'
export { cn } from './lib/cn'
export * from './lib/format'
export { useFormat } from './config/useFormat'
export { builtInMessages, type Locale, type MessageKey, type Messages } from './lib/messages'
export * from './tokens'
export { version } from './version'
