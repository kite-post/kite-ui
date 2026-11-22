# kite-ui

UI-кит Kite: дизайн-токени бренду і базові Vue-компоненти. Публікується як
npm-пакет `@kite-post/ui` у GitHub Packages; веб-застосунки ставлять його за
закріпленою версією (документація, 1.3 і 5.2).

> Стан: хвиля 2 з 6 — токени (CSS, Tailwind, TS, Dart), KConfigProvider,
> useTheme і 20 компонентів: KIcon, KSpinner, KButton, KIconButton, KTooltip,
> KLink, KBadge, KSeparator, KKbd, KCard, KSkeleton, KField, KLabel, KInput,
> KTextarea, KCheckbox, KCheckboxGroup, KRadioGroup, KSwitch, KSelect.
> Storybook і сайт документації — далі.

## Структура

```
tokens/            джерело токенів (JSON) і згенерований Dart для Flutter
scripts/           генератор токенів і палітри
src/tokens/        токени для TS (згенеровано)
src/styles/        CSS-змінні, тема Tailwind, базові стилі
src/components/    Vue-компоненти
docs/research/     ресьорч: принципи UI/UX, огляд UI-кітів
docs/styleguide/   стайлгайд
docs/components/   специфікації компонентів
design/            макети і логотип
```

## Розробка

```bash
make install   # залежності
make tokens    # перегенерувати токени після правки tokens/*.json
make verify    # токени, лінт, типи, тести, збірка — те саме, що CI
pnpm exec vite --config playground/vite.config.ts   # майданчик компонентів
```

## Реліз

```bash
make version V=0.1.0
git push --follow-tags
```

Тег `v*` запускає публікацію в GitHub Packages. Після першої публікації пакет
треба один раз зробити Public у налаштуваннях пакета організації, інакше
`GITHUB_TOKEN` застосунків його не прочитає.
