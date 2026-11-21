# KCheckbox

## Призначення

Окремий вибір так / ні у формі (згода з умовами, «Застрахувати посилку»)
або вибір рядків у таблиці. Застосунки w b o.

## Коли використовувати / коли ні

- **Так:** значення застосовується після відправки форми.
- **Ні, якщо налаштування діє одразу** — `KSwitch`.
- **Ні, для вибору одного з кількох** — `KRadioGroup`.

## Анатомія

`[■] Підпис` + необов'язковий опис під підписом (`caption`, `color-text-muted`).

- Квадрат 20 × 20, `radius-xs`, рамка 1,5 px `color-border-input`.
- Позначка — іконка `check` 16 (або `minus` для «частково»), лінія 2.
- Ціль натискання — уся мітка (квадрат + підпис), не менше 40 px по висоті.
- Проміжок квадрат → підпис — `space-2`.

## Варіанти й розміри

`size`: `sm` (квадрат 16, підпис 14/20) — лише в таблицях і щільних
списках; `md` (20, підпис 16/24, типово).

## Стани

| Стан          | Квадрат                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| unchecked     | `color-surface`, рамка `color-border-input`                                  |
| hover         | Рамка `color-border-input-hover`                                             |
| checked       | Фон `color-text` (ink / snow), позначка `color-text-inverse`                 |
| indeterminate | Як checked, позначка `minus`                                                 |
| focus         | Кільце фокусу навколо квадрата                                               |
| invalid       | Рамка `color-danger-text`                                                    |
| disabled      | `color-bg-subtle`, рамка `color-border`; checked — фон `color-text-disabled` |

> Чому обраний чекбокс не коралової: коралова — колір дії, а не стану
> (стайлгайд 3.2). Темна заливка дає контраст понад 15:1 і не конкурує з
> головною кнопкою.

Поява позначки — `scale(0.6→1)` + `opacity` за `duration-base`.

## API

| Проп                              | Тип                          | Типово  | Опис                                |
| --------------------------------- | ---------------------------- | ------- | ----------------------------------- |
| `modelValue`                      | `boolean \| 'indeterminate'` | —       | `v-model`                           |
| `defaultValue`                    | `boolean`                    | `false` |                                     |
| `label`                           | `string`                     | —       | Підпис (або слот `default`)         |
| `description`                     | `string`                     | —       |                                     |
| `value`                           | `string`                     | —       | Значення всередині `KCheckboxGroup` |
| `size`                            | `'sm' \| 'md'`               | `'md'`  |                                     |
| `invalid`, `disabled`, `required` | `boolean`                    | `false` |                                     |
| `name`                            | `string`                     | —       |                                     |

Події: `update:modelValue`.

## Поведінка й клавіатура

`Space` перемикає. `Enter` не перемикає (нативна поведінка; `Enter`
відправляє форму). Клік з `indeterminate` → `checked`.

## Доступність

`role="checkbox"` з `aria-checked="true|false|mixed"` (Reka). Підпис
пов'язаний через `<label>`. Чекбокс без видимого підпису (рядок таблиці)
мусить мати `aria-label` («Обрати KT 1234 5678 5 UA»).

## Токени

`color-surface`, `color-border-input*`, `color-text`, `color-text-inverse`,
`color-danger-text`, `radius-xs`. Компонентні: `--kite-checkbox-size-{sm,md}`.

## Тексти

Немає.

## Так / не так

- ✅ «Застрахувати посилку», опис «0,5 % від оголошеної вартості».
- ❌ Чекбокс «Сповіщення увімкнено», що зберігається одразу (це `KSwitch`).

## Основа

Reka `Checkbox` (`CheckboxRoot`, `CheckboxIndicator`).
