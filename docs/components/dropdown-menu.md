# KDropdownMenu

## Призначення

Меню дій біля кнопки: «Ще дії» рядка таблиці, меню профілю, «Друкувати ▾»,
вибір стовпців. Застосунки w b o.

## Коли використовувати / коли ні

- **Так:** 3–12 дій над одним об'єктом, які не поміщаються кнопками.
- **Ні, для вибору значення в формі** — `KSelect`.
- **Ні, для навігації сайтом** — `KSidebar`, `KTabs`, посилання.
- **Ні, якщо дій одна-дві** — показати кнопками.

## Анатомія

1. Тригер — `KButton` / `KIconButton` (`ellipsis`, `chevron-down`).
2. Меню — як список `KSelect`: `color-surface-raised`, `shadow-lg`,
   `radius-md`, відступ 4, мінімальна ширина 180 px.
3. Пункт (40 / 32 px): іконка 16/20 ліворуч, підпис, праворуч — `KKbd`
   гарячої клавіші або `chevron-right` для підменю.
4. Типи пунктів: дія, посилання, чекбокс (`check` ліворуч), радіо (крапка
   ліворуч), підменю, заголовок групи (`overline`), роздільник.
5. Небезпечний пункт — `color-danger-text` (текст і іконка), завжди
   останній, відділений роздільником.

## Варіанти й розміри

`size`: `sm` / `md` (висота пунктів). `align` / `side` — як у `KPopover`.

## Стани

| Стан пункту | Вигляд                                                 |
| ----------- | ------------------------------------------------------ |
| highlighted | `color-surface-hover` (danger — `color-danger-subtle`) |
| disabled    | `color-text-disabled`, пропускається стрілками         |
| checked     | `check` або крапка                                     |

Поява — як у `KPopover`.

## API

### `KDropdownMenu`

| Проп            | Тип            | Типово | Опис                                  |
| --------------- | -------------- | ------ | ------------------------------------- |
| `open`          | `boolean`      | —      | `v-model:open`                        |
| `items`         | `MenuItem[]`   | —      | Декларативно (або дочірні компоненти) |
| `size`          | `'sm' \| 'md'` | `'md'` |                                       |
| `side`, `align` |                |        | Як у `KPopover`                       |
| `modal`         | `boolean`      | `true` |                                       |

```ts
type MenuItem =
  | {
      type?: 'item'
      label: string
      icon?: Component
      shortcut?: string[]
      danger?: boolean
      disabled?: boolean
      onSelect?: () => void
      to?: RouteLocationRaw
      href?: string
    }
  | { type: 'checkbox'; label: string; checked: boolean; onUpdate: (v: boolean) => void }
  | { type: 'radio'; label: string; value: string; group: string }
  | { type: 'sub'; label: string; icon?: Component; items: MenuItem[] }
  | { type: 'label'; label: string }
  | { type: 'separator' }
```

### Частини

`KDropdownMenuTrigger`, `KDropdownMenuContent`, `KDropdownMenuItem`,
`KDropdownMenuCheckboxItem`, `KDropdownMenuRadioGroup`,
`KDropdownMenuRadioItem`, `KDropdownMenuSub` (+ `SubTrigger`, `SubContent`),
`KDropdownMenuLabel`, `KDropdownMenuSeparator`, `KDropdownMenuShortcut`.

Подія пункту: `select(event)` — з `preventDefault()`, щоб меню не
закривалося (для чекбоксів у меню стовпців).

## Поведінка й клавіатура

| Клавіша                          | Дія                             |
| -------------------------------- | ------------------------------- |
| `Enter`, `Space`, `↓` на тригері | Відкрити, фокус на перший пункт |
| `↑` на тригері                   | Відкрити, фокус на останній     |
| `↓` `↑`                          | Між пунктами (циклічно)         |
| `→` / `←`                        | Відкрити / закрити підменю      |
| `Home` `End`                     | Перший / останній               |
| Літери                           | Перейти до пункту на цю літеру  |
| `Enter`, `Space`                 | Виконати пункт                  |
| `Esc`                            | Закрити, фокус на тригер        |
| `Tab`                            | Закрити меню                    |

Підменю на ховер відкривається з затримкою 100 мс і «коридором» для
курсору (не закривається, поки курсор іде по діагоналі до нього).

## Доступність

Тригер — `aria-haspopup="menu"`, `aria-expanded`. Меню — `role="menu"`,
пункти `menuitem` / `menuitemcheckbox` / `menuitemradio` (Reka). Пункт із
`to`/`href` рендериться як посилання з роллю `menuitem`.

## Токени

Як у `KSelect`, плюс `color-danger-text`, `color-danger-subtle`.

## Тексти

| Ключ               | uk     | en           |
| ------------------ | ------ | ------------ |
| `menu.moreActions` | Ще дії | More actions |

## Так / не так

- ✅ Рядок посилки: «Відкрити», «Друкувати етикетку», «Переадресувати» ·
  «Скасувати накладну» (небезпечна, остання).
- ❌ Меню з однією дією.
- ❌ Видалення без підтвердження прямо з меню (меню → `KAlertDialog`).

## Основа

Reka `DropdownMenu`.
