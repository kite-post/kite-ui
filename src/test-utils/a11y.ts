import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Перевірка axe-core для змонтованого компонента. Контраст вимкнено: jsdom не рахує
 * стилі — контраст перевірено розрахунком токенів (docs/research/02) і в Storybook.
 */
export async function expectNoA11yViolations(el: Element): Promise<void> {
  const result = await axe.run(el, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  const violations = result.violations.map(
    (v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.html).join(' | ')}`,
  )
  expect(violations).toEqual([])
}
