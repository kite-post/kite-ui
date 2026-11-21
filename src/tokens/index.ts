// Точка входу @kite-post/ui/tokens: лише токени, без компонентів і Vue.
export { raw, tokens, twTheme, type SemanticColor, type ThemeName } from './tokens.generated'

/** Брендові кольори з розділу 1.3 документації. */
export const brand = {
  coral: '#FF5A36',
  ink: '#0E1A2B',
  sky: '#2E6BFF',
  paper: '#F7F4EE',
} as const

/** Посилання на шрифти Google Fonts для index.html застосунку (стайлгайд 4.1). */
export const googleFontsHref =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..500&family=Manrope:wght@400..700&family=Unbounded:wght@500..600&display=swap'
