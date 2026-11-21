# KTable

## Призначення

Стилізована семантична таблиця для статичних або невеликих даних: тарифи,
склад реєстру, рядки маніфесту в картці, порівняння. Основа для
`KDataTable`. Застосунки w b o.

## Коли використовувати / коли ні

- **Так:** табличні дані без сортування, фільтрів і вибору рядків (до
  ~50 рядків).
- **Ні, для робочих списків з фільтрами й масовими діями** — `KDataTable`.
- **Ні, для властивостей одного об'єкта** — `KDescriptionList`.
- **Ні, для верстки.**

## Анатомія

- Заголовок: `caption` 12/16, вага 600, `color-text-muted`, фон
  `color-bg-subtle`, висота 40, нижня рамка `color-border`.
- Рядок: висота 48 (`md`) / 40 (`compact`), `body-sm` 14/20, нижня рамка
  `color-border`; ховер (для інтерактивних) — `color-surface-hover`.
- Комірка: відступ 12 по горизонталі (перша й остання — 16).
- Числа — праворуч, `tabular-nums`; текст — ліворуч; заголовок вирівнюється
  як вміст.
- Необов'язковий підпис таблиці (`caption`) зверху і футер з підсумками.
- Обгортка: `KCard`-подібна рамка `radius-md` з `overflow-x: auto` для
  горизонтальної прокрутки на вузьких екранах.

## Варіанти й розміри

- `density`: `comfortable` (48, типово) / `compact` (40).
- `striped`: смуги `color-bg-subtle` через рядок (лише для широких таблиць
  без ліній).
- `stickyHeader`: заголовок липкий (з обмеженою висотою обгортки або
  відносно сторінки під шапкою).
- `stickyFirstColumn`: перший стовпець липкий при горизонтальній прокрутці.
- `bordered`: без зовнішньої рамки (`false` — таблиця всередині картки).

## Стани

Рядок: default, hover (якщо `interactive`), selected
(`color-selection-bg`). Таблиця: `loading` (скелетони), `empty`
(`KEmptyState` `sm` у рядку на всю ширину).

## API

Компонентний (як HTML), щоб таблицю можна було скласти будь-як:

`KTable` (`density`, `striped`, `stickyHeader`, `stickyFirstColumn`,
`bordered`, `caption`), `KTableHeader`, `KTableBody`, `KTableFooter`,
`KTableRow` (`selected`, `interactive`), `KTableHead` (`align`, `width`),
`KTableCell` (`align`, `numeric` — праворуч + `tabular-nums`, `truncate`),
`KTableEmpty` (`colspan` авто).

## Поведінка й клавіатура

Таблиця не інтерактивна: Tab ходить лише по інтерактивних елементах у
комірках. Рядок-посилання — посилання в першій комірці, розтягнуте на рядок
(як у `KCard`), щоб не ламати виділення тексту.

## Доступність

Нативні `<table>`, `<caption>`, `<thead>`, `<th scope="col">`, `<th
scope="row">` для першого стовпця з назвами. Обгортка з прокруткою —
`role="region"` з `aria-labelledby` на підпис і `tabindex="0"` (щоб
прокручувати клавіатурою).

## Токени

`color-bg-subtle`, `color-border`, `color-surface-hover`,
`color-selection-bg`, `color-text*`, `radius-md`. Компонентні:
`--kite-table-row-height-{comfortable,compact}`, `--kite-table-cell-padding-x`.

## Тексти

Немає власних; порожній стан — `KEmptyState`.

## Так / не так

- ✅ Тарифи: вага ліворуч, ціна праворуч табличними цифрами.
- ❌ Таблиця для розкладу кнопок у ряд.

## Основа

Нативна `<table>`, без Reka.
