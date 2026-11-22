# KSidebar

## Призначення

Бічна навігація робочих застосунків: розділи kite-ops (Прийом, Сортування,
Рейси, Диспетчерська, Адміністрування) і kite-business (Відправлення,
Реєстри, Фінанси, Інтеграції). Застосунки b o.

## Коли використовувати / коли ні

- **Так:** понад 5 розділів, щоденна робота, десктоп.
- **Ні, у клієнтському kite-web** — шапка з 3–5 пунктами (живе в kite-web).

## Анатомія

```
┌──────────────────────┐
│ [логотип] Kite Ops   │  header: логотип, назва, перемикач контексту (хаб / організація)
├──────────────────────┤
│ ОПЕРАЦІЇ             │  група (overline), згортається
│ ▸ Прийом         12  │  пункт: іконка 20, підпис, лічильник
│ ▸ Сортування         │
│ ▸ Рейси              │
│ АДМІНІСТРУВАННЯ      │
│ ▸ Користувачі        │
├──────────────────────┤
│ [аватар] Ольга К. ▾  │  footer: профіль, тема, вихід
│ [«] Згорнути         │
└──────────────────────┘
```

- Ширина 264 px (`size-sidebar`), фон `color-bg-subtle`, рамка праворуч
  `color-border`.
- Пункт — висота 40, відступ 12, `radius-sm`, іконка 20 + `label` 14/20.
- Активний пункт: фон `color-primary-subtle`, текст і іконка
  `color-primary-text`, вага 600, смужка 3 px `color-primary` ліворуч.
- Вкладені пункти (один рівень) — відступ 32, без іконок.

## Варіанти й розміри

| Режим       | Вигляд                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------ |
| `expanded`  | 264 px                                                                                     |
| `collapsed` | 64 px: лише іконки, підписи в `KTooltip` праворуч, групи — роздільниками                   |
| `mobile`    | < `lg`: панель ховається, відкривається як `KSheet` `side="left"` з кнопки-бургера в шапці |

Стан `collapsed` зберігається (`localStorage` `kite-sidebar`).

## Стани

Пункт: default, hover (`color-surface-hover`), active (поточний маршрут),
focus, disabled. Згортання ширини — `duration-moderate` `ease-in-out`
(анімується `width` самої панелі як виняток, вміст не перераховується:
підписи ховаються `opacity`).

## API

### `KSidebar`

| Проп        | Тип              | Типово          | Опис                   |
| ----------- | ---------------- | --------------- | ---------------------- |
| `collapsed` | `boolean`        | —               | `v-model:collapsed`    |
| `items`     | `SidebarGroup[]` | —               | Або дочірні компоненти |
| `label`     | `string`         | `sidebar.label` | Назва навігації        |

```ts
interface SidebarGroup {
  label?: string
  collapsible?: boolean
  items: {
    label: string
    icon?: Component
    to: RouteLocationRaw
    count?: number
    children?: { label: string; to: RouteLocationRaw }[]
    disabled?: boolean
  }[]
}
```

Слоти: `header`, `footer`.

### Частини

`KSidebarHeader`, `KSidebarContent`, `KSidebarGroup`, `KSidebarItem`,
`KSidebarFooter`, `KSidebarToggle`.

Активний пункт визначається за поточним маршрутом (`RouterLink` з
`exact-active-class` чи `active-class` для вкладених).

## Поведінка й клавіатура

- Пункти — посилання, звичайний порядок Tab.
- `[` (або `mod+B`) згортає / розгортає панель.
- Згорнута панель: фокус на пункт показує тултіп з назвою.

## Доступність

`<nav aria-label="Основна навігація">`, групи — `<ul>` з заголовком групи
(`aria-labelledby`). Активний — `aria-current="page"`. Лічильник має
прихований контекст: «12 очікують прийому». Кнопка згортання — `aria-expanded`.

## Токени

`color-bg-subtle`, `color-border`, `color-surface-hover`,
`color-primary-subtle`, `color-primary-text`, `color-primary`,
`size-sidebar`, `size-sidebar-collapsed`, `radius-sm`.

## Тексти

| Ключ               | uk                | en               |
| ------------------ | ----------------- | ---------------- |
| `sidebar.label`    | Основна навігація | Main navigation  |
| `sidebar.collapse` | Згорнути панель   | Collapse sidebar |
| `sidebar.expand`   | Розгорнути панель | Expand sidebar   |
| `sidebar.open`     | Відкрити меню     | Open menu        |

## Так / не так

- ✅ Групи «Операції» й «Адміністрування», лічильник на «Прийом».
- ❌ Три рівні вкладеності.
- ❌ Іконки без підписів у розгорнутому стані.

## Основа

`<nav>`, `KCollapsible`, `KTooltip`, `KSheet`. Reka `NavigationMenu` не
підходить (він для горизонтальних меню з підменю).

### Реалізація (хвиля 6)

- Є лише декларативний API: `items` і слоти `header`, `footer`, `default`.
  Частин `KSidebarHeader…KSidebarToggle` поки немає, бо `items` покриває
  відомі застосунки.
- Без Vue Router пункт може мати `href` і `active`.
- Проп `inSheet`: панель усередині мобільного `KSheet` завжди розгорнута і
  без кнопки згортання. Його передає `KAppShell` через scoped-слот
  `sidebar` (`{ inSheet }`).
