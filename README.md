# @kite-post/ui

UI-кіт Kite: дизайн-токени бренду і 60 Vue-компонентів для kite-web, kite-business
і kite-ops. Пакет публікується в GitHub Packages, застосунки ставлять його за
закріпленою версією (документація, розділи 1.3 і 5.2).

**Storybook:** <https://kite-post.github.io/kite-ui/> — усі компоненти, варіанти й стани,
перемикачі теми та мови.

| Що                    | Де                                                                     |
| --------------------- | ---------------------------------------------------------------------- |
| Стайлгайд             | [`docs/styleguide`](docs/styleguide/README.md)                         |
| Специфікації          | [`docs/components`](docs/components/README.md) — по файлу на компонент |
| Ресьорч UI/UX і китів | [`docs/research`](docs/research)                                       |
| Макети                | [`design/components.html`](design/components.html)                     |
| Зміни за версіями     | [`CHANGELOG.md`](CHANGELOG.md)                                         |
| Як долучитися         | [`CONTRIBUTING.md`](CONTRIBUTING.md)                                   |

## Встановлення

Пакет лежить у GitHub Packages, тож застосунку потрібен `.npmrc`:

```ini
@kite-post:registry=https://npm.pkg.github.com
```

```bash
pnpm add @kite-post/ui@0.7.0 @lucide/vue
```

Peer-залежності: `vue` ^3.5 і `@lucide/vue` (іконки).

## Підключення

```ts
// main.ts
import '@kite-post/ui/style.css'
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { KConfigProvider } from '@kite-post/ui'
</script>

<template>
  <KConfigProvider locale="uk">
    <RouterView />
  </KConfigProvider>
</template>
```

`KConfigProvider` у корені дає мову службових текстів (`uk` / `en`, перевизначення
через `messages`), тости (`useToast`), підтвердження (`useConfirm`) і live-регіони для
скрінрідерів.

**Шрифти** — з Google Fonts (Unbounded, Manrope, JetBrains Mono). Посилання є в
`googleFontsHref`:

```ts
import { googleFontsHref } from '@kite-post/ui/tokens'
```

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="…googleFontsHref…" />
```

**Тема** — світла, темна або системна. Вибір зберігає `useTheme()`. Щоб сторінка не
блимала світлою до старту Vue, у `<head>` додайте `themeInitScript`:

```ts
import { themeInitScript, useTheme } from '@kite-post/ui'

const { theme, setTheme } = useTheme() // 'light' | 'dark' | 'system'
```

## Компоненти

```vue
<script setup lang="ts">
import { KButton, KField, KPhoneInput, useToast } from '@kite-post/ui'
import { ref } from 'vue'

const phone = ref<string | null>(null)
const toast = useToast()
</script>

<template>
  <KField label="Телефон отримувача" hint="На нього прийде код">
    <KPhoneInput v-model="phone" />
  </KField>
  <KButton variant="primary" @click="toast.success('Збережено')">Зберегти</KButton>
</template>
```

| Група             | Компоненти                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Основи            | KIcon, KSpinner, KBadge, KSeparator, KKbd, KSkeleton, KAvatar, KCard                                                          |
| Дії               | KButton, KIconButton, KButtonGroup, KLink, KToggle, KToggleGroup, KCopyButton                                                 |
| Форми             | KField, KLabel, KInput, KTextarea, KCheckbox, KCheckboxGroup, KRadioGroup, KSwitch, KSelect, KSearchInput                     |
| Складні поля      | KNumberField, KPinInput, KTagsInput, KCombobox, KDatePicker, KDateRangePicker, KFileUpload, KPhoneInput, KTrackingNumberInput |
| Оверлеї           | KTooltip, KPopover, KDropdownMenu, KDialog, KAlertDialog (`useConfirm`), KSheet, KDrawer, KCommandPalette                     |
| Зворотний звʼязок | KAlert, тости (`useToast`), KProgress, KEmptyState                                                                            |
| Навігація         | KTabs, KBreadcrumbs, KPagination, KStepper, KAccordion, KCollapsible, KSidebar                                                |
| Дані              | KTable, KDataTable, KDescriptionList, KTimeline                                                                               |
| Домен             | KTrackingNumber, KParcelStatus                                                                                                |
| Оболонка          | KAppShell, KAppShellPageHeader, KConfigProvider                                                                               |

Форматери (`formatMoney`, `formatDate`, `formatRelative`, `formatPhone`,
`formatTrackingNumber`, `isValidS10`, `plural` та інші) і `useFormat()` — з того ж пакета.

## Токени

Джерело — `tokens/*.json`. З нього генеруються:

| Експорт                    | Для чого                                                 |
| -------------------------- | -------------------------------------------------------- |
| `@kite-post/ui/style.css`  | Усе разом: змінні, тема, базові стилі, класи компонентів |
| `@kite-post/ui/tokens.css` | Лише CSS-змінні `--kite-*` (світла й темна теми)         |
| `@kite-post/ui/theme.css`  | Тема Tailwind v4 (`@theme`) для класів застосунку        |
| `@kite-post/ui/tokens`     | Токени в TS: `tokens`, `raw`, `brand`, `googleFontsHref` |
| `tokens/dart`              | Flutter-пакет `kite_tokens`: ті самі токени для kite-mobile |

Класи кіта мають префікс `k:` і не конфліктують із Tailwind застосунку. Застосунок
може взяти ту саму тему у свій Tailwind:

```css
@import 'tailwindcss';
@import '@kite-post/ui/theme.css';
```

### Flutter (kite-mobile)

`tokens/dart` — Dart-пакет `kite_tokens`, його версія дорівнює версії `@kite-post/ui`.
На pub.dev він не публікується, тож kite-mobile бере його з git за тегом, як і
`kite_contracts`:

```yaml
dependencies:
  kite_tokens:
    git:
      url: https://github.com/kite-post/kite-ui.git
      ref: v0.8.0
      path: tokens/dart
```

```dart
import 'package:kite_tokens/kite_tokens.dart';

final scheme = isDark ? KiteColorScheme.dark : KiteColorScheme.light;
Text('Посилку доставлено', style: KiteText.h3.copyWith(color: scheme.text));
```

Нові токени доїжджають у застосунок перегенерацією і новим тегом: правка `tokens/*.json`,
`make tokens`, реліз, потім `ref` на новий тег у kite-mobile. Копіювати файл руками не треба.

## Розробка

Потрібні Node 24+ (CI — Node 26) і pnpm 12 (версія — з `packageManager`).

```bash
make install      # залежності
make verify       # токени, лінт, типи, юніт-тести, збірка — те саме, що CI
make storybook    # Storybook на http://localhost:6006
make playground   # майданчик на http://localhost:5174 (?shell — оболонка застосунку)
make tokens       # перегенерувати токени після правки tokens/*.json
make help         # усі цілі
```

**Візуальні регресії.** CI знімає кожну історію Storybook у світлій і темній темі й
порівнює з еталонами у `visual/__screenshots__`. Після навмисної зміни вигляду
запустіть workflow **«Оновити еталони»** (Actions → обрати гілку PR): він зніме нові
знімки в тому самому Linux-образі й закомітить їх у гілку. Локально з Docker —
`make visual` / `make visual-update`.

## Реліз

`main` захищена: зміни — лише через PR із зеленим CI (лінт, типи, тести, збірка,
візуальні регресії).

```bash
make release V=0.8.0   # гілка release/v0.8.0, нова версія, PR
# … PR зелений і злитий …
make tag               # тег v0.8.0 на main
```

Тег `v*` публікує пакет у GitHub Packages і Storybook на GitHub Pages. Версії —
semver; до 1.0 мінорна версія може містити несумісні зміни, вони описані в
[`CHANGELOG.md`](CHANGELOG.md).

## Структура

```
tokens/            джерело токенів (JSON) і згенерований Dart
scripts/           генератор токенів і палітри
src/components/    компоненти: *.vue, *.stories.ts, тести
src/config/        KConfigProvider, useTheme, useFormat
src/lib/           cn, тексти uk/en, форматери, маски
src/styles/        CSS-змінні, тема Tailwind, базові стилі
src/tokens/        токени для TS (згенеровано)
.storybook/        конфіг Storybook
visual/            візуальні тести Playwright і еталони
playground/        майданчик для ручної перевірки
docs/              ресьорч, стайлгайд, специфікації
design/            макети
```
