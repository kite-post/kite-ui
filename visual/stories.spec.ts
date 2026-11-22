import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { expect, test } from '@playwright/test'

interface Entry {
  id: string
  type: 'story' | 'docs'
  title: string
  name: string
  tags?: string[]
}

// Перелік історій — з index.json зібраного Storybook; тег no-visual вимикає знімок.
const index = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'storybook-static', 'index.json'), 'utf8'),
) as { entries: Record<string, Entry> }
const stories = Object.values(index.entries).filter(
  (e) => e.type === 'story' && !e.tags?.includes('no-visual'),
)

// Імена файлів еталонів — латиницею (id історій містять кирилицю категорій).
const map: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ie',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'iu',
  я: 'ia',
  ʼ: '',
}
const fileName = (id: string) =>
  [...id.toLowerCase()]
    .map((c) => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9-]/g, '-')

// Фіксований «сьогодні»: календарі, відносні дати й пресети не змінюються з часом.
const NOW = new Date('2026-11-24T10:00:00+02:00')

for (const story of stories) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${story.title} / ${story.name} · ${theme}`, async ({ page }) => {
      await page.clock.setFixedTime(NOW)
      await page.goto(
        `/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&globals=theme:${theme};locale:uk`,
      )
      await page.waitForSelector('#storybook-root > *', { state: 'attached' })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForLoadState('networkidle')
      // Поповери й діалоги з'являються через анімацію появи; reducedMotion робить її миттєвою.
      await page.waitForTimeout(150)
      await expect(page).toHaveScreenshot(`${fileName(story.id)}--${theme}.png`)
    })
  }
}
