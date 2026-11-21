# KRadioGroup

## Призначення

Вибір одного з 2–6 варіантів, які варто бачити одночасно: спосіб оплати,
хто платить за доставку, тариф. Варіант «картки» — для вибору з описом і
ціною. Застосунки w b o.

## Коли використовувати / коли ні

- **Так:** варіантів мало, і людині корисно порівняти їх.
- **Ні, понад 6** — `KSelect` / `KCombobox`.
- **Ні, для миттєвого перемикання вигляду** — `KToggleGroup`.

## Анатомія

`<fieldset>` з легендою, підказкою, пунктами і помилкою.

- **default:** коло 20 px, рамка 1,5 px `color-border-input`; обране — коло
  з заливкою `color-text` і внутрішньою точкою 8 px `color-text-inverse`.
  Підпис і опис праворуч.
- **card:** `KCard` `outline`, `radius-md`, відступ 16. Ліворуч радіо, далі
  заголовок (`body-strong`), опис (`body-sm` `color-text-muted`), праворуч —
  слот `aside` (ціна, термін). Обрана картка: рамка 2 px `color-primary`.

## Варіанти й розміри

`variant`: `default` / `card`. `orientation`: `vertical` (типово) /
`horizontal` (для `card` — сітка, `columns` 2–3, на мобільному завжди 1).
`size`: `sm` / `md` для `default`.

## Стани

Як у `KCheckbox` (unchecked, hover, checked, focus, invalid, disabled).
Для `card`: hover — `color-border-strong`; checked — рамка `color-primary`
плюс заповнене радіо (стан видно не лише рамкою).

## API

### `KRadioGroup`

| Проп                                                                       | Тип                                           | Типово      | Опис                     |
| -------------------------------------------------------------------------- | --------------------------------------------- | ----------- | ------------------------ |
| `modelValue`                                                               | `string \| null`                              | —           | `v-model`                |
| `defaultValue`                                                             | `string \| null`                              | `null`      |                          |
| `options`                                                                  | `{ value, label, description?, disabled? }[]` | —           | Або дочірні `KRadio`     |
| `variant`                                                                  | `'default' \| 'card'`                         | `'default'` |                          |
| `columns`                                                                  | `1 \| 2 \| 3`                                 | `1`         | Для `card`               |
| `label`                                                                    | `string`                                      | —           | **Обов'язково.** Легенда |
| `hint`, `error`, `optional`, `disabled`, `required`, `orientation`, `size` |                                               |             | Як у `KCheckboxGroup`    |

Події: `update:modelValue`.

### `KRadio`

`value` (обов'язково), `label`, `description`, `disabled`; слот `aside`
(для `card`) і `default`.

## Поведінка й клавіатура

| Клавіша           | Дія                                                 |
| ----------------- | --------------------------------------------------- |
| `Tab`             | Фокус на обраний пункт (або перший), далі — з групи |
| `↓` `→` / `↑` `←` | Наступний / попередній пункт **і обрати його**      |
| `Space`           | Обрати пункт у фокусі                               |

## Доступність

`role="radiogroup"` з назвою з легенди, пункти `role="radio"` з
`aria-checked` (Reka). Для `card` уся картка — мітка радіо; інтерактивних
елементів усередині картки немає (посилання «Детальніше» — поза карткою).

## Токени

Як у `KCheckbox` і `KCard`. Компонентні: `--kite-radio-size-{sm,md}`.

## Тексти

`field.optional`.

## Так / не так

- ✅ «Хто платить за доставку»: Відправник / Отримувач.
- ✅ Картки тарифів: «Стандарт · 2–3 дні · 80 ₴», «Експрес · завтра · 140 ₴».
- ❌ Радіо без обраного значення, коли розумне типове очевидне.
- ❌ Кнопка всередині картки-радіо.

## Основа

Reka `RadioGroup` (`RadioGroupRoot`, `RadioGroupItem`, `RadioGroupIndicator`).
