# KDataTable

## Призначення

Робоча таблиця даних з сортуванням, фільтрами, пошуком, вибором рядків,
масовими діями, пагінацією й налаштуванням стовпців: відправлення
kite-business, черга прийому й рейси kite-ops, журнал подій. Найбільший
компонент кіта. Застосунки b o.

## Коли використовувати / коли ні

- **Так:** список однотипних об'єктів, з яким працюють: шукають, фільтрують,
  обробляють пачками.
- **Ні, для статичної таблиці** — `KTable`.

## Анатомія

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Пошук…]  [Статус ▾] [Дата ▾] [+ Фільтр]           [Стовпці] [Експорт]│  тулбар
│ Статус: Їде ✕   Створено: 1–24 лист. ✕   Скинути все                  │  активні фільтри
├──────────────────────────────────────────────────────────────────────┤
│ Обрано 12 · [Друкувати етикетки] [Сформувати маніфест] … [Зняти вибір]│  панель масових дій (замість тулбару)
├──┬─────────────────┬──────────────┬───────────┬───────────┬─────────┤
│☐ │ Номер ↓         │ Отримувач    │ Статус    │ Вага, кг  │      ⋯  │  заголовок
├──┼─────────────────┼──────────────┼───────────┼───────────┼─────────┤
│☐ │ KT 1234 5678 5 UA│ Ольга К.    │ ● Їде…    │      2,4  │      ⋯  │
└──┴─────────────────┴──────────────┴───────────┴───────────┴─────────┘
  Рядки 51–100 з 1 240         Рядків на сторінці [50 ▾]   ‹ 1 … 5 … 25 ›   пагінація
```

1. **Тулбар:** `KSearchInput` (`filled`), фільтри-кнопки (`KButton`
   `secondary` `sm` з `chevron-down`, що відкривають `KPopover` з
   контролом фільтра), «Додати фільтр», праворуч — налаштування стовпців
   (`KDropdownMenu` з чекбоксами) і дії таблиці.
2. **Активні фільтри:** чіпи `«Назва: значення» ✕` і «Скинути все».
3. **Панель масових дій:** з'являється замість тулбару, коли обрано рядки:
   лічильник, дії, «Обрати всі 1 240» (якщо обрано всю сторінку), «Зняти
   вибір».
4. **Таблиця:** [`KTable`](table.md) з чекбоксами, сортуванням у заголовках
   (`arrow-up` / `arrow-down`, неактивне — `arrow-up-down` при ховері),
   стовпцем дій рядка (`KIconButton` `ellipsis` → `KDropdownMenu`).
5. **Пагінація:** [`KPagination`](pagination.md).

## Варіанти й розміри

- `density`: `comfortable` / `compact` (перемикач у налаштуваннях
  стовпців, зберігається).
- `selection`: `none` / `single` / `multiple`.
- `expandable`: рядок розгортається (`KCollapsible`) з деталями.
- `virtual`: віртуалізація для довгих списків без пагінації (> 500
  рядків; черга прийому в реальному часі).
- Режими даних: `client` (усі дані в пам'яті, кіт сортує і фільтрує) /
  `server` (кіт видає стан, застосунок робить запит).

## Стани

| Стан                                           | Вигляд                                                                            |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| loading (перший)                               | Скелетон: тулбар, 8 рядків                                                        |
| loading (оновлення)                            | Дані лишаються, тонка смуга `KProgress` `indeterminate` над таблицею, `aria-busy` |
| empty initial                                  | `KEmptyState` `initial`                                                           |
| empty filtered                                 | `KEmptyState` `no-results` з «Скинути фільтри»                                    |
| error                                          | `KEmptyState` `error` з «Спробувати ще»                                           |
| row selected                                   | `color-selection-bg`, чекбокс                                                     |
| row highlighted (новий рядок у реальному часі) | фон `color-info-subtle`, що згасає за 2 с                                         |

## API

### Стовпці

```ts
interface DataTableColumn<Row> {
  id: string
  header: string
  accessor?: keyof Row | ((row: Row) => unknown)
  cell?: (ctx: { row: Row; value: unknown }) => VNode | string // або слот `cell-{id}`
  align?: 'start' | 'end' | 'center'
  numeric?: boolean
  width?: string
  minWidth?: string
  sortable?: boolean
  hideable?: boolean // з'являється в «Стовпці»
  defaultHidden?: boolean
  sticky?: 'start' | 'end'
  filter?: DataTableFilter // див. нижче
}

type DataTableFilter =
  | { type: 'select'; options: SelectOption[]; multiple?: boolean }
  | { type: 'dateRange' }
  | { type: 'number'; unit?: string }
  | { type: 'text' }
  | { type: 'custom'; component: Component }
```

### Пропси

| Проп                    | Тип                                | Типово          | Опис                                                             |
| ----------------------- | ---------------------------------- | --------------- | ---------------------------------------------------------------- |
| `columns`               | `DataTableColumn<Row>[]`           | —               | **Обов'язково**                                                  |
| `rows`                  | `Row[]`                            | —               | **Обов'язково**                                                  |
| `rowKey`                | `keyof Row \| (row) => string`     | `'id'`          |                                                                  |
| `mode`                  | `'client' \| 'server'`             | `'client'`      |                                                                  |
| `total`                 | `number`                           | `rows.length`   | Для `server`                                                     |
| `sorting`               | `{ id: string, desc: boolean }[]`  | —               | `v-model:sorting`                                                |
| `filters`               | `Record<string, unknown>`          | —               | `v-model:filters`                                                |
| `search`                | `string`                           | —               | `v-model:search`                                                 |
| `page`, `pageSize`      | `number`                           | —               | `v-model:page`, `v-model:page-size`                              |
| `selection`             | `'none' \| 'single' \| 'multiple'` | `'none'`        |                                                                  |
| `selected`              | `string[] \| 'all'`                | —               | `v-model:selected`; `'all'` — усі за фільтром                    |
| `columnVisibility`      | `Record<string, boolean>`          | —               | `v-model:column-visibility`                                      |
| `density`               | `'comfortable' \| 'compact'`       | `'comfortable'` | `v-model:density`                                                |
| `persistKey`            | `string`                           | —               | Зберігати видимість стовпців і щільність у `localStorage`        |
| `syncUrl`               | `boolean`                          | `false`         | Сортування, фільтри, пошук і сторінка — у query-параметрах       |
| `loading`               | `boolean`                          | `false`         |                                                                  |
| `error`                 | `string \| null`                   | `null`          |                                                                  |
| `expandable`, `virtual` | `boolean`                          | `false`         |                                                                  |
| `rowTo`                 | `(row) => RouteLocationRaw`        | —               | Рядок відкриває сторінку (посилання в першій змістовній комірці) |
| `label`                 | `string`                           | —               | **Обов'язково.** Назва таблиці                                   |

### Події

`update:*` для кожної моделі, `row-click(row)` (лише якщо немає `rowTo`),
`retry`, `bulk-action(id, selected)`.

### Слоти

`cell-{id}` (`{ row, value }`), `header-{id}`, `toolbar-start`,
`toolbar-end`, `bulk-actions` (`{ selected, clear }`), `row-actions`
(`{ row }`), `expanded` (`{ row }`), `empty`.

## Поведінка й клавіатура

| Клавіша                        | Дія                                                                |
| ------------------------------ | ------------------------------------------------------------------ |
| `Tab`                          | Тулбар → заголовки, що сортуються → інтерактиви рядків → пагінація |
| `Enter` / `Space` на заголовку | Сортування: ↑ → ↓ → без сортування                                 |
| `Space` на чекбоксі рядка      | Обрати                                                             |
| `Shift` + клік на чекбоксі     | Обрати діапазон від попереднього                                   |
| `mod+A` у таблиці              | Обрати всі на сторінці                                             |
| `Esc`                          | Зняти вибір (коли фокус у таблиці)                                 |
| `/`                            | Фокус у пошук таблиці                                              |

- Зміна фільтра чи пошуку скидає сторінку на 1 і **зберігає** вибір лише
  для рядків, що лишилися видимими. Лічильник показує, скільки обрано
  поза поточним видом.
- `server`-режим: зміни стану йдуть подією одразу; пошук — з затримкою
  `KSearchInput`. Кіт не робить запитів.
- Липкий заголовок під шапкою `KAppShell`; перший змістовний стовпець —
  липкий при горизонтальній прокрутці.
- Нові рядки в реальному часі (`virtual` черга) додаються без стрибка
  прокрутки, якщо людина не вгорі списку; з'являється кнопка «Нові: 3 ↑».

## Доступність

- `<table>` з `aria-label` = `label`, `aria-rowcount` для віртуальної й
  серверної (загальна кількість).
- Заголовок, що сортується, — `<button>` у `<th aria-sort="ascending|descending|none">`.
- Чекбокс «обрати всі» — `aria-checked="mixed"` для часткового вибору,
  назва «Обрати всі на сторінці».
- Зміни (кількість після фільтра, «Обрано 12», завантаження) оголошуються
  в одному `aria-live="polite"` регіоні таблиці.
- Фільтри-поповери — як `KPopover`; чіп фільтра — кнопка «Прибрати фільтр
  „Статус: Їде“».

## Токени

Ті самі, що в `KTable`, `KSearchInput`, `KBadge`, `KPagination`, плюс
`color-info-subtle` для нових рядків. Компонентні:
`--kite-data-table-toolbar-gap`, `--kite-data-table-bulk-bg`
(`color-surface-inverse`) — панель масових дій інверсна, щоб її було видно.

## Тексти

| Ключ                        | uk                          | en                               |
| --------------------------- | --------------------------- | -------------------------------- |
| `table.search`              | Пошук у таблиці             | Search table                     |
| `table.addFilter`           | Фільтр                      | Filter                           |
| `table.resetFilters`        | Скинути все                 | Reset all                        |
| `table.removeFilter`        | Прибрати фільтр «{label}»   | Remove filter “{label}”          |
| `table.columns`             | Стовпці                     | Columns                          |
| `table.density`             | Щільність                   | Density                          |
| `table.density.comfortable` | Звичайна                    | Comfortable                      |
| `table.density.compact`     | Компактна                   | Compact                          |
| `table.selectAllPage`       | Обрати всі на сторінці      | Select all on page               |
| `table.selectRow`           | Обрати {label}              | Select {label}                   |
| `table.selected`            | Обрано: {n}                 | {n} selected                     |
| `table.selectAll`           | Обрати всі {total}          | Select all {total}               |
| `table.selectedHidden`      | ще {n} обрано поза фільтром | {n} more selected outside filter |
| `table.clearSelection`      | Зняти вибір                 | Clear selection                  |
| `table.rowActions`          | Дії для {label}             | Actions for {label}              |
| `table.sortAsc`             | Сортувати за зростанням     | Sort ascending                   |
| `table.sortDesc`            | Сортувати за спаданням      | Sort descending                  |
| `table.newRows`             | Нові: {n}                   | New: {n}                         |
| `table.results`             | Знайдено рядків: {n}        | {n} rows                         |

## Так / не так

- ✅ Відправлення kite-business: пошук за номером і телефоном, фільтри
  статус/дата, вибір → «Друкувати етикетки», URL зберігає фільтри.
- ❌ Клік на весь рядок як єдиний спосіб відкрити посилку.
- ❌ Вибір, що мовчки зникає після зміни фільтра.

## Основа

`KTable` + `@tanstack/vue-table` (headless: сортування, фільтри, вибір,
видимість, пагінація) + `@tanstack/vue-virtual` (для `virtual`).
`KSearchInput`, `KPopover`, `KDropdownMenu`, `KCheckbox`, `KPagination`,
`KEmptyState`, `KSkeleton`.

### Реалізація (хвиля 6)

- `@tanstack/vue-table` закріплено на 8.21.3. Гілка 9 має інше API (плагіни
  фіч), перехід — окремою задачею.
- **Ще не реалізовано:**
  - `virtual` (`@tanstack/vue-virtual`) і «Нові: n ↑»;
  - підсвітка нових рядків;
  - `syncUrl`;
  - фільтри `number` і `custom`.

  Вони потрібні черзі прийому kite-ops, тож прийдуть разом із нею.

- Проп `rowLabel` дає підпис рядка для чекбокса й меню дій (типово —
  перша комірка).
- Сортування завжди йде ↑ → ↓ → без сортування (`sortDescFirst: false`):
  TanStack для чисел починає з ↓.
