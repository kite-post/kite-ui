# KInput

## Призначення

Однорядкове текстове поле: ім'я, email, адреса, суми з одиницями. Основа
для `KSearchInput`, `KPhoneInput`, `KTrackingNumberInput`. Усі застосунки.

## Коли використовувати / коли ні

- **Так:** вільний текст в один рядок.
- **Ні, для чисел з кроком і межами** — `KNumberField`.
- **Ні, для багаторядкового тексту** — `KTextarea`.
- **Ні, для вибору з відомого списку** — `KSelect` / `KCombobox`.
- **Ні, для телефону й номера накладної** — доменні поля.

## Анатомія

```
┌──────────────────────────────────────────────┐
│ [prefix]  значення / плейсхолдер  [x] [suffix]│
└──────────────────────────────────────────────┘
```

1. Контейнер — `color-surface`, рамка 1 px `color-border-input`, `radius-sm`.
2. Префікс — іконка (`search`, `map-pin`) або текст (`₴`, `+380`),
   `color-text-muted`.
3. Значення — `body` 16/24 `color-text`; плейсхолдер — `color-text-muted`.
4. Кнопка очищення — `KIconButton` `x` розміру `sm`, з'являється, коли є
   значення і `clearable`.
5. Суфікс — іконка, текст (`кг`, `см`) або кнопка (показати пароль).

## Варіанти й розміри

| `size` | Висота | Відступ по горизонталі | Текст     | Іконки |
| ------ | ------ | ---------------------- | --------- | ------ |
| `sm`   | 32     | 12                     | `body-sm` | 16     |
| `md`   | 40     | 12                     | `body`    | 20     |
| `lg`   | 48     | 16                     | `body`    | 20     |

На ширині < 640 px текст поля **ніколи** не менший за 16 px, навіть у `sm`
(інакше iOS масштабує сторінку).

`type`: `text` (типово), `email`, `password`, `url`, `search`, `tel`. Для
`password` — суфікс «показати / сховати» (`eye` / `eye-off`).

Ширина — 100 % контейнера. Обмежувати її варто за довжиною значення
(стайлгайд, ресьорч 8.3): індекс — `width: 8ch`, ціле поле — контейнером форми.

## Стани

| Стан     | Рамка                                          | Фон                                               | Інше                           |
| -------- | ---------------------------------------------- | ------------------------------------------------- | ------------------------------ |
| default  | `color-border-input`                           | `color-surface`                                   |                                |
| hover    | `color-border-input-hover`                     |                                                   |                                |
| focus    | `color-border-focus` + тінь 1 px (стайлгайд 9) |                                                   |                                |
| invalid  | `color-danger-text`                            |                                                   | У фокусі — тінь того ж кольору |
| disabled | `color-border`                                 | `color-bg-subtle`                                 | Текст `color-text-disabled`    |
| readonly | немає рамки                                    | `color-surface-sunken`                            | Текст звичайний, виділяється   |
| autofill | без змін                                       | `color-surface` (перебиваємо жовтий фон браузера) |                                |

## API

| Проп                                          | Тип                                                             | Типово   | Опис                                        |
| --------------------------------------------- | --------------------------------------------------------------- | -------- | ------------------------------------------- |
| `modelValue`                                  | `string`                                                        | —        | `v-model`                                   |
| `type`                                        | `'text' \| 'email' \| 'password' \| 'url' \| 'search' \| 'tel'` | `'text'` |                                             |
| `size`                                        | `'sm' \| 'md' \| 'lg'`                                          | `'md'`   |                                             |
| `placeholder`                                 | `string`                                                        | —        | Лише приклад формату                        |
| `prefix`                                      | `string`                                                        | —        | Текстовий префікс                           |
| `suffix`                                      | `string`                                                        | —        | Текстовий суфікс (`кг`)                     |
| `leadingIcon`                                 | `Component`                                                     | —        |                                             |
| `trailingIcon`                                | `Component`                                                     | —        |                                             |
| `clearable`                                   | `boolean`                                                       | `false`  |                                             |
| `maxlength`                                   | `number`                                                        | —        | Разом із `showCount` — лічильник у `KField` |
| `showCount`                                   | `boolean`                                                       | `false`  |                                             |
| `invalid`, `disabled`, `readonly`, `required` | `boolean`                                                       | `false`  | Також із `KField`                           |

Атрибути `autocomplete`, `inputmode`, `name`, `pattern`, `aria-*` ідуть на
нативний `<input>`. `class` — на контейнер.

Події: `update:modelValue(value: string)`, `clear()`, нативні `focus`,
`blur`, `keydown`, `change`.

Слоти: `leading`, `trailing` (наприклад, `KSelect` валюти).

Метод через `ref`: `focus()`, `select()`.

## Поведінка й клавіатура

- Клік у будь-яку точку контейнера (не на кнопки) фокусує поле.
- Кнопка очищення: очищає, повертає фокус у поле, `Esc` у полі з
  `clearable` теж очищає (якщо поле не всередині діалогу, де `Esc`
  закриває діалог).
- Кнопки в полі (очищення, показати пароль) **не** входять у порядок Tab
  (`tabindex="-1"`), бо дублюють дії з клавіатури.

## Доступність

- Назва — з `KField` або `aria-label`.
- Префікс і суфікс одиниць входять в опис: `aria-describedby` включає
  прихований текст суфікса («кілограмів»).
- `autocomplete` **мусить** стояти для персональних даних (WCAG 1.3.5):
  `name`, `email`, `tel`, `street-address`, `postal-code`.

## Токени

`color-surface`, `color-border-input*`, `color-border-focus`,
`color-danger-text`, `color-text*`, `color-surface-sunken`, `radius-sm`.
Компонентні: `--kite-input-height-{sm,md,lg}`, `--kite-input-padding-x-{sm,md,lg}`,
`--kite-input-radius`.

## Тексти

| Ключ                 | uk              | en            |
| -------------------- | --------------- | ------------- |
| `input.clear`        | Очистити        | Clear         |
| `input.showPassword` | Показати пароль | Show password |
| `input.hidePassword` | Сховати пароль  | Hide password |
| `input.count`        | {n} з {max}     | {n} of {max}  |

## Так / не так

- ✅ `type="email"`, `autocomplete="email"`, плейсхолдер `olha@example.com`.
- ❌ Плейсхолдер «Введіть email» без підпису.
- ❌ Маска, що не дає вставити значення з буфера.

## Основа

Нативний `<input>`, без Reka.
