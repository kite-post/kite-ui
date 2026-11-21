# KStepper

## Призначення

Показує кроки багатокрокового процесу і де людина зараз: майстер
створення накладної (Відправник → Отримувач → Посилка → Оплата),
підключення інтеграції в kite-business, онбординг організації.
Застосунки w b.

## Коли використовувати / коли ні

- **Так:** 3–6 послідовних кроків, людина проходить їх по черзі.
- **Ні, для паралельних видів** — `KTabs`.
- **Ні, для історії подій** — `KTimeline`.
- **Ні, понад 6 кроків** — переглянути процес.

## Анатомія

Крок: індикатор (коло 32 з номером, `label` 14/20 600), назва (`label`),
необов'язковий опис (`caption`), лінія-з'єднувач 2 px до наступного кроку.

Сам майстер (поля, кнопки «Назад» / «Далі») — це сторінка застосунку.
Кіт дає лише індикатор кроків і стан.

## Варіанти й розміри

- `orientation`: `horizontal` (типово, над вмістом) / `vertical` (ліва
  колонка на десктопі).
- На < 640 px горизонтальний перетворюється на компактний: «Крок 2 з 4 ·
  Отримувач» + `KProgress` `sm`.

## Стани

| Стан     | Індикатор                                                              | Назва               | Лінія після    |
| -------- | ---------------------------------------------------------------------- | ------------------- | -------------- |
| complete | Фон `color-text`, іконка `check` `color-text-inverse`                  | `color-text`        | `color-text`   |
| current  | Рамка 2 px `color-primary`, номер `color-text`, фон `color-surface`    | `color-text`, 600   | `color-border` |
| upcoming | Рамка 1 px `color-border-strong`, номер `color-text-muted`             | `color-text-muted`  | `color-border` |
| error    | Фон `color-danger-solid`, іконка `exclamation` `color-danger-on-solid` | `color-danger-text` | як було        |
| disabled | Як upcoming, без ховеру                                                |                     |                |

Пройдений крок клікабельний (повернутись), якщо `linear` вимкнено або крок
уже завершено.

## API

### `KStepper`

| Проп          | Тип                                                                        | Типово         | Опис                                                   |
| ------------- | -------------------------------------------------------------------------- | -------------- | ------------------------------------------------------ |
| `modelValue`  | `number`                                                                   | —              | `v-model`: поточний крок (з 1)                         |
| `steps`       | `{ title: string, description?: string, state?: 'error' \| 'disabled' }[]` | —              | Або дочірні `KStep`                                    |
| `orientation` | `'horizontal' \| 'vertical'`                                               | `'horizontal'` |                                                        |
| `linear`      | `boolean`                                                                  | `true`         | Перейти вперед можна лише через кнопку «Далі» сторінки |

Події: `update:modelValue` — при кліку на дозволений крок.

### `KStep`

`step` (номер), `title`, `description`, `state`; слот `indicator`.

## Поведінка й клавіатура

Клікабельні кроки — кнопки, зупинки Tab. Неклікабельні — не фокусуються.
Після зміни кроку фокус переходить на заголовок вмісту нового кроку
(робить сторінка; кіт дає `focusStepHeading()` з `useStepper()`).

## Доступність

`<nav aria-label="Кроки">` з `<ol>`. Поточний крок — `aria-current="step"`.
Кожен крок має прихований стан: «Крок 2 з 4: Отримувач, поточний» /
«…, завершено» / «…, помилка».

## Токени

`color-text`, `color-text-inverse`, `color-text-muted`, `color-primary`,
`color-border*`, `color-danger-*`. Компонентні:
`--kite-stepper-indicator-size` (2rem).

## Тексти

| Ключ               | uk                 | en                  |
| ------------------ | ------------------ | ------------------- |
| `stepper.label`    | Кроки              | Steps               |
| `stepper.position` | Крок {n} з {total} | Step {n} of {total} |
| `stepper.complete` | завершено          | completed           |
| `stepper.current`  | поточний           | current             |
| `stepper.error`    | помилка            | error               |

## Так / не так

- ✅ «Відправник · Отримувач · Посилка · Оплата», помилка на кроці
  «Посилка» після перевірки ціни.
- ❌ Стрибок на крок вперед, пропустивши обов'язкові поля.

## Основа

Reka `Stepper` (`StepperRoot`, `StepperItem`, `StepperTrigger`,
`StepperIndicator`, `StepperTitle`, `StepperDescription`, `StepperSeparator`).
