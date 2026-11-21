# KSelect

## Призначення

Вибір одного значення з невеликого відомого списку: тип оплати, причина
повернення, роль користувача, розмір сторінки. Застосунки w b o.

## Коли використовувати / коли ні

- **Так:** 5–15 варіантів, людина знає, що шукає.
- **Ні, до 4 варіантів** — `KRadioGroup` (видно всі одразу) або
  `KToggleGroup`.
- **Ні, понад 15 або потрібен пошук** — `KCombobox`.
- **Ні, для множинного вибору** — `KCombobox` з `multiple` або `KCheckboxGroup`.

## Анатомія

1. Тригер — виглядає як [`KInput`](input.md): обране значення або
   плейсхолдер, іконка `chevron-down` праворуч.
2. Список (popover) — `color-surface-raised`, `shadow-lg`, `radius-md`,
   відступ 4 px, ширина ≥ ширини тригера, висота до 320 px з прокруткою.
3. Пункт — висота 40 (`md`) / 32 (`sm`), відступ 12, `radius-sm`; іконка
   `check` праворуч в обраного.
4. Групи — заголовок групи `overline`, роздільники між групами.

## Варіанти й розміри

`size` — sm / md / lg як у `KInput`. Пункт може мати іконку ліворуч і опис
другим рядком (`caption`, `color-text-muted`).

## Стани

Тригер — як у `KInput` (hover, focus, invalid, disabled, readonly) плюс
`open`: рамка `color-border-focus`, `chevron` повертається на 180°.

Пункт:

| Стан        | Вигляд                                           |
| ----------- | ------------------------------------------------ |
| highlighted | `color-surface-hover`                            |
| selected    | `check`, вага 600                                |
| disabled    | `color-text-disabled`, пропускається клавіатурою |

## API

### `KSelect`

| Проп                                                  | Тип              | Типово     | Опис                                               |
| ----------------------------------------------------- | ---------------- | ---------- | -------------------------------------------------- |
| `modelValue`                                          | `string \| null` | —          | `v-model`                                          |
| `defaultValue`                                        | `string \| null` | `null`     |                                                    |
| `options`                                             | `SelectOption[]` | —          | Варіанти (або дочірні `KSelectItem`)               |
| `placeholder`                                         | `string`         | з словника |                                                    |
| `clearable`                                           | `boolean`        | `false`    | Пункт «Не вибрано» / кнопка очищення               |
| `size`, `invalid`, `disabled`, `readonly`, `required` |                  |            |                                                    |
| `open`                                                | `boolean`        | —          | `v-model:open`                                     |
| `name`                                                | `string`         | —          | Для відправки нативної форми (прихований `select`) |

```ts
interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: Component
  disabled?: boolean
  group?: string
}
```

Події: `update:modelValue`, `update:open`.

Слоти: `item` (scoped `{ option, selected }`), `value` (як показати обране).

### Дочірні компоненти

`KSelectItem` (`value`, `label`, `disabled`), `KSelectGroup` (`label`),
`KSelectSeparator` — для декларативного складання замість `options`.

## Поведінка й клавіатура

| Клавіша                    | Закрито                        | Відкрито                           |
| -------------------------- | ------------------------------ | ---------------------------------- |
| `Enter`, `Space`, `↓`, `↑` | Відкрити, підсвітити обране    | `Enter`/`Space` — обрати і закрити |
| `↓` `↑`                    |                                | Наступний / попередній пункт       |
| `Home` `End`               |                                | Перший / останній                  |
| Літери                     | Перейти до пункту на цю літеру | Те саме (typeahead)                |
| `Esc`                      |                                | Закрити без зміни, фокус на тригер |
| `Tab`                      | Далі                           | Закрити і перейти далі             |

Список позиціонується під тригером, перевертається вгору, якщо внизу немає
місця. На мобільному (< 640 px) — той самий popover. Нативний `<select>` не
використовуємо, щоб вигляд був однаковий.

## Доступність

Патерн APG «Select-only combobox» через Reka: тригер `role="combobox"`
з `aria-expanded`, `aria-controls`; список `role="listbox"`; пункти
`role="option"` з `aria-selected`.

## Токени

Тригер — токени `KInput`. Список: `color-surface-raised`, `shadow-lg`,
`radius-md`, `color-surface-hover`, `z-dropdown`, `duration-moderate`,
`ease-out`. Компонентні: `--kite-select-content-max-height` (20rem).

## Тексти

| Ключ                 | uk         | en     |
| -------------------- | ---------- | ------ |
| `select.placeholder` | Оберіть    | Select |
| `select.none`        | Не вибрано | None   |

## Так / не так

- ✅ «Причина повернення» з 6 варіантами.
- ❌ Список з 400 відділень без пошуку.
- ❌ Select з двома варіантами «Так / Ні».

## Основа

Reka `Select` (`SelectRoot`, `SelectTrigger`, `SelectContent`,
`SelectItem`…).
