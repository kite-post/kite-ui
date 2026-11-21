# KPagination

## Призначення

Перехід між сторінками даних: таблиці відправлень, реєстри, журнали.
Входить у `KDataTable`, але використовується й окремо (списки карток).
Застосунки w b o.

## Коли використовувати / коли ні

- **Так:** робочі таблиці й списки, де важлива позиція («рядки 51–100 з
  1 240»).
- **Ні, для клієнтської історії відправлень** — кнопка «Показати ще» або
  нескінченна стрічка (ресьорч 11).

## Анатомія

```
Рядки 51–100 з 1 240     Рядків на сторінці [50 ▾]     ‹  1 … 4 [5] 6 … 25  ›
```

1. Діапазон — `body-sm` `color-text-muted`, `tabular-nums`.
2. Розмір сторінки — `KSelect` `sm` (10, 25, 50, 100).
3. Сторінки — кнопки 32/40 `radius-full`; поточна — фон `color-text`, текст
   `color-text-inverse`; `…` — неінтерактивний.
4. Попередня / наступна — `KIconButton` (`chevron-left`, `chevron-right`).

## Варіанти й розміри

- `variant`: `full` (типово) / `simple` — «‹ Сторінка 5 з 25 ›» без номерів
  (вузькі місця) / `cursor` — лише «Назад / Далі» без загальної кількості
  (для API з курсорами).
- `size`: `sm` / `md`.
- На < 640 px `full` автоматично стає `simple`.

## Стани

Кнопка сторінки: default, hover, current, focus. «‹» на першій і «›» на
останній — `disabled`.

## API

| Проп                 | Тип                              | Типово              | Опис                                |
| -------------------- | -------------------------------- | ------------------- | ----------------------------------- |
| `page`               | `number`                         | —                   | `v-model:page` (з 1)                |
| `pageSize`           | `number`                         | —                   | `v-model:page-size`                 |
| `total`              | `number`                         | —                   | Кількість записів (не для `cursor`) |
| `pageSizes`          | `number[] \| false`              | `[10, 25, 50, 100]` | `false` — сховати вибір             |
| `siblingCount`       | `number`                         | `1`                 | Скільки сторінок поруч із поточною  |
| `variant`            | `'full' \| 'simple' \| 'cursor'` | `'full'`            |                                     |
| `hasNext`, `hasPrev` | `boolean`                        | —                   | Для `cursor`                        |
| `size`               | `'sm' \| 'md'`                   | `'md'`              |                                     |

Події: `update:page`, `update:pageSize` (сторінка скидається на 1).

## Поведінка й клавіатура

Кожна кнопка — зупинка Tab; `Enter`/`Space`. Після переходу фокус
лишається на пагінації, а застосунок прокручує список до початку.

## Доступність

`<nav aria-label="Сторінки">`, поточна кнопка — `aria-current="page"`,
кнопки мають назви «Сторінка 6», «Наступна сторінка». Діапазон рядків —
`aria-live="polite"`, щоб зміна сторінки оголошувалась.

## Токени

`color-text`, `color-text-inverse`, `color-text-muted`, `radius-full`.

## Тексти

| Ключ                  | uk                          | en                          |
| --------------------- | --------------------------- | --------------------------- |
| `pagination.label`    | Сторінки                    | Pagination                  |
| `pagination.range`    | Рядки {from}–{to} з {total} | Rows {from}–{to} of {total} |
| `pagination.pageSize` | Рядків на сторінці          | Rows per page               |
| `pagination.page`     | Сторінка {n}                | Page {n}                    |
| `pagination.of`       | Сторінка {n} з {total}      | Page {n} of {total}         |
| `pagination.prev`     | Попередня сторінка          | Previous page               |
| `pagination.next`     | Наступна сторінка           | Next page                   |

## Так / не так

- ✅ «Рядки 51–100 з 1 240» з вибором розміру сторінки.
- ❌ 25 кнопок сторінок підряд.

## Основа

Reka `Pagination` (`PaginationRoot`, `PaginationList`, `PaginationListItem`,
`PaginationEllipsis`, `PaginationPrev`, `PaginationNext`), `KSelect`.
