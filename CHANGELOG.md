# Зміни

Формат — [Keep a Changelog](https://keepachangelog.com/uk/1.1.0/), версії — semver. До 1.0
мінорна версія може містити несумісні зміни; вони позначені **Несумісне**.

## [Unreleased]

### Додано

- README, CONTRIBUTING, шаблони PR та issue, CODEOWNERS.
- `make release` / `make tag`: реліз через PR (гілка `main` захищена).

## [0.7.0] — 2026-11-22

### Додано

- Storybook 10: історії для всіх 60 компонентів з autodocs, сторінка «Вступ», перемикачі
  теми й мови. Публікується на <https://kite-post.github.io/kite-ui/> з кожним релізом.
- Візуальні регресії Playwright: кожна історія у світлій і темній темі (248 знімків),
  workflow «Оновити еталони».

## [0.6.0] — 2026-11-22

### Додано

- Форматери: `formatMoney`, `formatNumber`, `formatDimensions`, `formatDate`, `formatTime`,
  `formatRelative`, `plural`, `formatPhone`, `parsePhone`, `isValidUaMobile`,
  `formatTrackingNumber`, `parseTrackingNumber`, `isValidS10`; `useFormat()`.
- KPhoneInput, KTrackingNumberInput, KTrackingNumber, KParcelStatus
  (`parcelStatusMeta`, `PARCEL_STATUSES`), KTimeline.
- KSidebar, KAppShell, KAppShellPageHeader, KCommandPalette.
- KTable з частинами, KDataTable на `@tanstack/vue-table` 8.21.3.

### Змінено

- KInput додає власний `aria-describedby` до опису з KField, а не замінює його.

## [0.5.0] — 2026-11-22

### Додано

- KSearchInput, KAvatar, KCopyButton, KDescriptionList, KAccordion, KCollapsible, KTabs,
  KBreadcrumbs, KPagination, KStepper.

## [0.4.0] — 2026-11-22

### Додано

- KToggle, KToggleGroup, KButtonGroup, KNumberField, KPinInput, KTagsInput, KCombobox,
  KFileUpload, KDatePicker, KDateRangePicker; залежність `@internationalized/date`.
- KProgress: `hideLabel`. KField передає `labelId` груповим контролам.

### Змінено

- **Несумісне:** `variant` і `size` у KButton та KIconButton типово `undefined` (беруться з
  KButtonGroup, а без групи — ті самі `secondary` / `ghost` і `md`). Вплине лише на код,
  що читає ці пропси ззовні.

## [0.3.0] — 2026-11-22

### Додано

- KPopover, KDropdownMenu, KDialog (KDialogBody, KDialogFooter, KDialogClose), KAlertDialog і
  `useConfirm`, KSheet, KDrawer, тости (`useToast`), KAlert, KProgress, KEmptyState.

## [0.2.0] — 2026-11-22

### Додано

- KField, KLabel, KInput, KTextarea, KCheckbox, KCheckboxGroup, KRadioGroup, KSwitch, KSelect,
  KSkeleton.

## [0.1.0] — 2026-11-22

### Додано

- Токени (CSS, тема Tailwind v4, TS, Dart), KConfigProvider, `useTheme`.
- KIcon, KSpinner, KButton, KIconButton, KTooltip, KLink, KBadge, KSeparator, KKbd, KCard.

[Unreleased]: https://github.com/kite-post/kite-ui/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/kite-post/kite-ui/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/kite-post/kite-ui/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/kite-post/kite-ui/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/kite-post/kite-ui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kite-post/kite-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kite-post/kite-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kite-post/kite-ui/releases/tag/v0.1.0
