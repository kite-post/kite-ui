// Заготовка токенів: лише базова палітра бренду з розділу 1.3 документації.
// Повна система (семантичні ролі, темна тема, типографіка, відступи, радіуси,
// тіні, рух) з'явиться після стайлгайду — крок 3 задачі 14.

export const brand = {
  coral: '#FF5A36',
  ink: '#0E1A2B',
  sky: '#2E6BFF',
  paper: '#F7F4EE',
  mist: '#E6E9EF',
  success: '#1F9D6B',
  warning: '#F2A93B',
  danger: '#E5484D',
} as const

export type BrandColor = keyof typeof brand
