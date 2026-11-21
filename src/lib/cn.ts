import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

import { twTheme } from '../tokens/tokens.generated'

// tailwind-merge знає префікс k: і назви з нашої теми: без цього він вважав би
// k:text-h1 кольором і викидав би його поруч із k:text-fg.
const twMerge = extendTailwindMerge({
  prefix: 'k',
  extend: {
    theme: {
      color: [...twTheme.color],
      text: [...twTheme.text],
      radius: [...twTheme.radius],
      shadow: [...twTheme.shadow],
      font: [...twTheme.font],
      ease: [...twTheme.ease],
    },
  },
})

/** Склеює класи й прибирає конфлікти Tailwind: останній виграє. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
