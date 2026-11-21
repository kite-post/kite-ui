# KFileUpload

## Призначення

Завантаження файлів: імпорт CSV з відправленнями (kite-business), фото й
документи до претензії, логотип організації. Застосунки b o.

## Коли використовувати / коли ні

- **Так:** людина обирає файл з пристрою.
- **Ні, для фото з камери телефона в Kite Scan** — це Flutter.

## Анатомія

1. Зона скидання: рамка 1,5 px пунктир `color-border-input`, `radius-md`,
   відступ 24, іконка `upload` 24, текст «Перетягніть файл сюди або
   [оберіть на пристрої]» і підказка з форматами й розміром (`caption`).
2. Список файлів під зоною: іконка типу файлу, назва (обрізається
   посередині: `vidpravky-lyst…2026.csv`), розмір, прогрес або статус,
   кнопка `x` (прибрати / скасувати).

## Варіанти й розміри

- `variant`: `dropzone` (типово) / `button` — лише `KButton` «Обрати файл»
  і список (у щільних формах).
- `multiple`: один чи кілька файлів.

## Стани

| Стан            | Вигляд                                                                |
| --------------- | --------------------------------------------------------------------- |
| idle            | Як в анатомії                                                         |
| drag-over       | Рамка `color-border-focus` суцільна, фон `color-selection-bg`         |
| файл: uploading | `KProgress` у рядку, відсоток, кнопка «Скасувати»                     |
| файл: done      | Іконка `circle-check` `color-success-text`                            |
| файл: error     | Іконка `circle-x` `color-danger-text`, текст причини, «Спробувати ще» |
| invalid (поле)  | Рамка зони `color-danger-text`, помилка через `KField`                |
| disabled        | Як у `KInput`                                                         |

## API

| Проп                              | Тип                                                  | Типово       | Опис                                                      |
| --------------------------------- | ---------------------------------------------------- | ------------ | --------------------------------------------------------- |
| `modelValue`                      | `UploadItem[]`                                       | —            | `v-model`: файли та їхній стан                            |
| `accept`                          | `string`                                             | —            | `'.csv,text/csv'`, `'image/*,.pdf'`                       |
| `multiple`                        | `boolean`                                            | `false`      |                                                           |
| `maxSize`                         | `number`                                             | —            | Байти                                                     |
| `maxFiles`                        | `number`                                             | —            |                                                           |
| `variant`                         | `'dropzone' \| 'button'`                             | `'dropzone'` |                                                           |
| `upload`                          | `(file, { onProgress, signal }) => Promise<unknown>` | —            | Функція завантаження. Без неї компонент лише збирає файли |
| `invalid`, `disabled`, `required` | `boolean`                                            | `false`      |                                                           |

```ts
interface UploadItem {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number // 0–100
  error?: string
  result?: unknown
}
```

Події: `update:modelValue`, `rejected(files, reason)` (тип / розмір /
кількість), `remove(item)`, `retry(item)`.

## Поведінка й клавіатура

- Уся зона — одна кнопка: `Enter`/`Space` відкриває системний діалог.
- Перетягування — додаткова можливість, не єдина (WCAG 2.5.7).
- Файли, що не підійшли, не додаються. Причина показується одразу
  («Файл більший за 10 МБ»).
- Скасування завантаження — через `AbortSignal`.
- Вставка з буфера (`Ctrl/⌘+V`) у фокусовану зону додає файли-зображення.

## Доступність

Нативний `<input type="file">` всередині, візуально схований; зона —
`<label>` для нього. Список файлів — `role="list"`. Прогрес і завершення
кожного файлу оголошуються (`aria-live="polite"`): «vidpravky.csv
завантажено».

## Токени

`color-border-input`, `color-border-focus`, `color-selection-bg`,
`color-success-text`, `color-danger-text`, `radius-md`.

## Тексти

| Ключ               | uk                                           | en                                          |
| ------------------ | -------------------------------------------- | ------------------------------------------- |
| `upload.drop`      | Перетягніть файл сюди або                    | Drag a file here or                         |
| `upload.dropMany`  | Перетягніть файли сюди або                   | Drag files here or                          |
| `upload.browse`    | оберіть на пристрої                          | browse                                      |
| `upload.button`    | Обрати файл                                  | Choose file                                 |
| `upload.hint`      | {types}, до {size}                           | {types}, up to {size}                       |
| `upload.tooLarge`  | Файл більший за {size}                       | File is larger than {size}                  |
| `upload.wrongType` | Цей тип файлу не підходить. Потрібен {types} | This file type isn't supported. Use {types} |
| `upload.tooMany`   | Не більше {n} файлів                         | Up to {n} files                             |
| `upload.cancel`    | Скасувати                                    | Cancel                                      |
| `upload.remove`    | Прибрати {name}                              | Remove {name}                               |
| `upload.retry`     | Спробувати ще                                | Try again                                   |
| `upload.done`      | {name} завантажено                           | {name} uploaded                             |

## Так / не так

- ✅ Імпорт CSV: підказка «CSV, до 10 МБ · [Завантажити шаблон]».
- ❌ Лише drag-and-drop без кнопки.

## Основа

Нативний `<input type="file">`, без Reka. `KProgress`, `KIconButton`.
