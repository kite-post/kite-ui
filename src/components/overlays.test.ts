import { Printer, Trash2 } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import KConfigProvider from '../config/KConfigProvider.vue'
import { expectNoA11yViolations } from '../test-utils/a11y'
import { useConfirm } from './alert-dialog/confirm'
import KAlertDialog from './alert-dialog/KAlertDialog.vue'
import KButton from './button/KButton.vue'
import type { CloseRequest } from './dialog/context'
import KDialog from './dialog/KDialog.vue'
import KDialogBody from './dialog/KDialogBody.vue'
import KDialogFooter from './dialog/KDialogFooter.vue'
import KDrawer from './drawer/KDrawer.vue'
import KDropdownMenu from './dropdown-menu/KDropdownMenu.vue'
import type { MenuItem } from './dropdown-menu/types'
import KPopover from './popover/KPopover.vue'
import KSheet from './sheet/KSheet.vue'

const flush = async () => {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}
const $ = (sel: string) => document.querySelector<HTMLElement>(sel)

describe('KDialog', () => {
  const dialog = (extra = '') => ({
    components: { KDialog, KDialogBody, KDialogFooter, KButton },
    setup: () => ({ open: ref(true), onClose: vi.fn() }),
    template: `<KDialog v-model:open="open" title="Змінити отримувача" description="Отримувач дізнається в SMS" ${extra}>
      <KDialogBody><label for="n">Імʼя</label><input id="n" /></KDialogBody>
      <KDialogFooter><KButton @click="open = false">Скасувати</KButton><KButton variant="primary">Зберегти</KButton></KDialogFooter>
    </KDialog>`,
  })

  it('role="dialog", назва й опис, фокус на першому полі, а не на ×', async () => {
    mount(dialog(), { attachTo: document.body })
    await flush()
    const el = $('[role="dialog"]')!
    expect(el.getAttribute('aria-labelledby')).toBeTruthy()
    expect($(`#${el.getAttribute('aria-labelledby')}`)?.textContent).toContain('Змінити отримувача')
    expect($(`#${el.getAttribute('aria-describedby')}`)?.textContent).toContain('SMS')
    expect(document.activeElement?.id).toBe('n')
    await expectNoA11yViolations(el)
  })

  it('Esc закриває; close можна скасувати', async () => {
    const w = mount(
      {
        components: { KDialog },
        setup: () => {
          const open = ref(true)
          const block = ref(true)
          const onClose = (r: CloseRequest) => block.value && r.preventDefault()
          return { open, block, onClose }
        },
        template: '<KDialog v-model:open="open" title="Т" @close="onClose"><p>x</p></KDialog>',
      },
      { attachTo: document.body },
    )
    await flush()
    $('[role="dialog"]')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await flush()
    expect((w.vm as unknown as { open: boolean }).open).toBe(true)
    ;(w.vm as unknown as { block: boolean }).block = false
    $('[role="dialog"]')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await flush()
    expect((w.vm as unknown as { open: boolean }).open).toBe(false)
  })

  it('initialFocus переводить фокус на вказаний елемент', async () => {
    mount(dialog('initial-focus="button.kite-button[data-variant=primary]"'), {
      attachTo: document.body,
    })
    await flush()
    expect(document.activeElement?.textContent).toContain('Зберегти')
  })
})

describe('KAlertDialog і useConfirm', () => {
  it('alertdialog, фокус на безпечній дії, onConfirm з loading і закриттям', async () => {
    let finish!: () => void
    const onConfirm = vi.fn(() => new Promise<void>((r) => (finish = r)))
    const w = mount(
      {
        components: { KAlertDialog },
        setup: () => ({ open: ref(true), onConfirm }),
        template: `<KAlertDialog v-model:open="open" title="Скасувати накладну?" description="Кошти повернуться за 3 дні"
          confirm-label="Скасувати накладну" :on-confirm="onConfirm" />`,
      },
      { attachTo: document.body },
    )
    await flush()
    const el = $('[role="alertdialog"]')!
    expect(document.activeElement?.textContent?.trim()).toBe('Залишити')
    await expectNoA11yViolations(el)
    const danger = [...el.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Скасувати накладну'),
    )!
    danger.click()
    await flush()
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(danger.getAttribute('aria-busy')).toBe('true')
    finish()
    await flush()
    expect((w.vm as unknown as { open: boolean }).open).toBe(false)
  })

  it('confirmText: кнопка вимкнена, доки текст не збігся', async () => {
    mount(
      {
        components: { KAlertDialog },
        template:
          '<KAlertDialog :open="true" title="Видалити ключ?" confirm-label="Видалити ключ" confirm-text="Магазин-1" />',
      },
      { attachTo: document.body },
    )
    await flush()
    const input = $('[role="alertdialog"] input') as HTMLInputElement
    expect(document.activeElement).toBe(input)
    const btn = [...document.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Видалити ключ'),
    )!
    expect(btn.disabled).toBe(true)
    input.value = 'Магазин-1'
    input.dispatchEvent(new Event('input'))
    await flush()
    expect(btn.disabled).toBe(false)
  })

  it('помилка з onConfirm показується в діалозі', async () => {
    mount(
      {
        components: { KAlertDialog },
        setup: () => ({ fail: () => Promise.reject(new Error('Сервер недоступний')) }),
        template:
          '<KAlertDialog :open="true" title="Т?" confirm-label="Так, дія" :on-confirm="fail" />',
      },
      { attachTo: document.body },
    )
    await flush()
    ;[...document.querySelectorAll('button')]
      .find((b) => b.textContent?.includes('Так, дія'))!
      .click()
    await flush()
    await flush()
    expect($('[role="alertdialog"] [role="alert"]')?.textContent).toContain('Сервер недоступний')
  })

  it('useConfirm повертає true після підтвердження і false після скасування', async () => {
    let ask!: ReturnType<typeof useConfirm>
    mount(
      {
        components: { KConfigProvider },
        setup: () => {
          ask = useConfirm()
        },
        template: '<KConfigProvider><div /></KConfigProvider>',
      },
      { attachTo: document.body },
    )
    const yes = ask({ title: 'Видалити?', confirmLabel: 'Видалити' })
    await flush()
    ;[...document.querySelectorAll('[role="alertdialog"] button')]
      .find((b) => b.textContent?.includes('Видалити'))!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(await yes).toBe(true)

    const no = ask({ title: 'Вийти без збереження?', confirmLabel: 'Вийти', tone: 'neutral' })
    await flush()
    ;[...document.querySelectorAll('[role="alertdialog"] button')]
      .find((b) => b.textContent?.includes('Залишити'))!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(await no).toBe(false)
  })
})

describe('KSheet і KDrawer', () => {
  it('KSheet: діалог збоку з заголовком і закриттям', async () => {
    const w = mount(
      {
        components: { KSheet },
        setup: () => ({ open: ref(true) }),
        template:
          '<KSheet v-model:open="open" title="KT 1234 5678 5 UA" side="right"><p>Деталі</p></KSheet>',
      },
      { attachTo: document.body },
    )
    await flush()
    const el = $('[role="dialog"]')!
    expect(el.dataset.side).toBe('right')
    await expectNoA11yViolations(el)
    ;(el.querySelector('button[aria-label="Закрити"]') as HTMLButtonElement).click()
    await flush()
    expect((w.vm as unknown as { open: boolean }).open).toBe(false)
  })

  it('KDrawer: ручка розгортає (альтернатива жесту)', async () => {
    const w = mount(
      {
        components: { KDrawer },
        setup: () => ({ open: ref(true), expanded: ref(false) }),
        template:
          '<KDrawer v-model:open="open" v-model:expanded="expanded" title="Поруч з вами"><p>x</p></KDrawer>',
      },
      { attachTo: document.body },
    )
    await flush()
    const handle = $('.kite-drawer__handle')!
    expect(handle.getAttribute('aria-expanded')).toBe('false')
    handle.click()
    await flush()
    expect((w.vm as unknown as { expanded: boolean }).expanded).toBe(true)
    await expectNoA11yViolations($('[role="dialog"]')!)
  })
})

describe('KPopover і KDropdownMenu', () => {
  it('KPopover відкривається кліком; назва — з тригера, заголовок видно', async () => {
    mount(
      {
        components: { KPopover, KButton },
        template: `<KPopover title="Розрахунок ціни">
          <template #trigger><KButton variant="link">Як рахується ціна?</KButton></template>
          <p>Тариф 80 ₴</p>
        </KPopover>`,
      },
      { attachTo: document.body },
    )
    const trigger = $('button')!
    trigger.click()
    await flush()
    const panel = $('[role="dialog"]')!
    expect(panel.textContent).toContain('Тариф 80 ₴')
    expect(panel.textContent).toContain('Розрахунок ціни')
    expect($(`#${panel.getAttribute('aria-labelledby')}`)?.textContent).toContain(
      'Як рахується ціна?',
    )
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('KDropdownMenu з items: menu, пункти, небезпечний, чекбокс', async () => {
    const onPrint = vi.fn()
    const onCols = vi.fn()
    const items: MenuItem[] = [
      { label: 'Друкувати етикетку', icon: Printer, shortcut: ['mod', 'p'], onSelect: onPrint },
      { type: 'checkbox', label: 'Габарити', checked: false, onUpdate: onCols },
      { type: 'separator' },
      { label: 'Скасувати накладну', icon: Trash2, danger: true },
    ]
    mount(
      {
        components: { KDropdownMenu, KButton },
        setup: () => ({ items }),
        template:
          '<KDropdownMenu :items="items"><template #trigger><KButton>Ще дії</KButton></template></KDropdownMenu>',
      },
      { attachTo: document.body },
    )
    const trigger = $('button')!
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flush()
    const menu = $('[role="menu"]')!
    expect(menu).toBeTruthy()
    expect(menu.querySelectorAll('[role="menuitem"]')).toHaveLength(2)
    expect(menu.querySelector('[role="menuitemcheckbox"]')).toBeTruthy()
    expect(menu.querySelector('[data-danger]')?.textContent).toContain('Скасувати накладну')
    ;(menu.querySelector('[role="menuitem"]') as HTMLElement).click()
    await flush()
    expect(onPrint).toHaveBeenCalledOnce()
  })
})
