# Специфікації компонентів `@kite-post/ui`

Функціональний і візуальний опис кожного компонента кіта. Спершу прочитайте
[загальні правила](_zahalni-pravyla.md): іменування, спільні пропси,
`v-model`, події, слоти, інтеграцію з `KField`, тексти й шаблон
специфікації. Значення токенів — у [стайлгайді](../styleguide/README.md),
обґрунтування каталогу — у [ресьорчі 03](../research/03-komponenty-ui-kitiv.md).

Застосунки: **w** kite-web · **b** kite-business · **o** kite-ops · **x** kite-box-screen.

## Дії

| Компонент                       | Що робить                                   | Де      |
| ------------------------------- | ------------------------------------------- | ------- |
| [KButton](button.md)            | Запуск дії, 5 варіантів, 3 розміри          | w b o x |
| [KIconButton](icon-button.md)   | Кнопка лише з іконкою, обов'язковий `label` | w b o x |
| [KButtonGroup](button-group.md) | Група кнопок, split-кнопка                  | b o     |
| [KLink](link.md)                | Перехід на сторінку чи ресурс               | w b o   |
| [KToggle](toggle.md)            | Кнопка-перемикач (`aria-pressed`)           | b o     |
| [KToggleGroup](toggle-group.md) | Сегментований контрол                       | w b o   |

## Форми

| Компонент                                | Що робить                                     | Де      |
| ---------------------------------------- | --------------------------------------------- | ------- |
| [KField](field.md)                       | Підпис, підказка, помилка для будь-якого поля | w b o   |
| [KLabel](label.md)                       | Підпис поза `KField`                          | w b o   |
| [KInput](input.md)                       | Текстове поле з префіксом і суфіксом          | w b o x |
| [KTextarea](textarea.md)                 | Багаторядковий текст                          | w b o   |
| [KSearchInput](search-input.md)          | Поле пошуку з гарячою клавішею                | w b o   |
| [KSelect](select.md)                     | Вибір з невеликого списку                     | w b o   |
| [KCombobox](combobox.md)                 | Пошук і вибір, асинхронно, мультивибір        | w b o   |
| [KCheckbox](checkbox.md)                 | Так / ні, «частково»                          | w b o   |
| [KCheckboxGroup](checkbox-group.md)      | Кілька варіантів під одним питанням           | w b o   |
| [KRadioGroup](radio-group.md)            | Один з кількох, варіант «картки»              | w b o   |
| [KSwitch](switch.md)                     | Миттєве налаштування                          | w b o   |
| [KNumberField](number-field.md)          | Число з межами, кроком, одиницями, гроші      | w b o   |
| [KPinInput](pin-input.md)                | Код отримання, код із SMS                     | w o x   |
| [KDatePicker](date-picker.md)            | Дата з календарем і ручним вводом             | w b o   |
| [KDateRangePicker](date-range-picker.md) | Період з пресетами                            | b o     |
| [KFileUpload](file-upload.md)            | Завантаження файлів, прогрес                  | b o     |
| [KTagsInput](tags-input.md)              | Кілька значень чіпами, вставка списку         | b o     |

## Kite

| Компонент                                        | Що робить                              | Де      |
| ------------------------------------------------ | -------------------------------------- | ------- |
| [KPhoneInput](phone-input.md)                    | Мобільний номер `+380`, значення E.164 | w b o   |
| [KTrackingNumberInput](tracking-number-input.md) | Ввід номера S10 з перевіркою           | w b o   |
| [KTrackingNumber](tracking-number.md)            | Показ номера групами з копіюванням     | w b o x |
| [KParcelStatus](parcel-status.md)                | Статус посилки: тон, іконка, текст     | w b o   |
| [KTimeline](timeline.md)                         | Хронологія подій, історія посилки      | w b o   |

## Відображення

| Компонент                               | Що робить                             | Де      |
| --------------------------------------- | ------------------------------------- | ------- |
| [KIcon](icon.md)                        | Іконка Lucide з розмірами стайлгайду  | w b o x |
| [KBadge](badge.md)                      | Мітка стану, лічильник                | w b o x |
| [KAvatar](avatar.md)                    | Фото або ініціали                     | w b o   |
| [KCard](card.md)                        | Поверхня об'єкта, інтерактивна картка | w b o x |
| [KSeparator](separator.md)              | Роздільник                            | w b o   |
| [KKbd](kbd.md)                          | Гаряча клавіша                        | b o     |
| [KCopyButton](copy-button.md)           | Копіювання в буфер                    | w b o   |
| [KDescriptionList](description-list.md) | Пари «ключ — значення»                | w b o   |
| [KAccordion](accordion.md)              | Секції, що розгортаються              | w b     |
| [KCollapsible](collapsible.md)          | Одна секція «показати більше»         | w b o   |

## Зворотний зв'язок

| Компонент                     | Що робить                               | Де      |
| ----------------------------- | --------------------------------------- | ------- |
| [KAlert](alert.md)            | Повідомлення секції чи сторінки, банер  | w b o x |
| [KToast](toast.md)            | Результат дії, «Скасувати»              | w b o x |
| [KSpinner](spinner.md)        | Невідома тривалість, із затримкою появи | w b o x |
| [KSkeleton](skeleton.md)      | Заглушка вмісту                         | w b o   |
| [KProgress](progress.md)      | Відомий прогрес, таймер зберігання      | w b o x |
| [KEmptyState](empty-state.md) | Перший раз, нічого не знайдено, помилка | w b o   |

## Оверлеї

| Компонент                         | Що робить                                | Де      |
| --------------------------------- | ---------------------------------------- | ------- |
| [KDialog](dialog.md)              | Модальне вікно для короткої задачі       | w b o x |
| [KAlertDialog](alert-dialog.md)   | Підтвердження незворотного, `useConfirm` | w b o   |
| [KSheet](sheet.md)                | Висувна панель, модальна чи ні           | w b o   |
| [KDrawer](drawer.md)              | Нижня шторка з жестом (Alpha)            | w       |
| [KPopover](popover.md)            | Панель з інтерактивом біля елемента      | w b o   |
| [KTooltip](tooltip.md)            | Коротке пояснення на ховер і фокус       | w b o   |
| [KDropdownMenu](dropdown-menu.md) | Меню дій                                 | w b o   |

## Навігація й каркаси

| Компонент                             | Що робить                           | Де    |
| ------------------------------------- | ----------------------------------- | ----- |
| [KTabs](tabs.md)                      | Види одного об'єкта, вкладка = URL  | w b o |
| [KBreadcrumbs](breadcrumbs.md)        | Шлях у ієрархії                     | b o   |
| [KPagination](pagination.md)          | Сторінки даних                      | w b o |
| [KStepper](stepper.md)                | Кроки майстра                       | w b   |
| [KSidebar](sidebar.md)                | Бічна навігація робочих застосунків | b o   |
| [KAppShell](app-shell.md)             | Каркас робочого застосунку          | b o   |
| [KCommandPalette](command-palette.md) | ⌘K: пошук сутностей і дій           | b o   |

## Дані

| Компонент                   | Що робить                                         | Де    |
| --------------------------- | ------------------------------------------------- | ----- |
| [KTable](table.md)          | Семантична таблиця                                | w b o |
| [KDataTable](data-table.md) | Сортування, фільтри, вибір, масові дії, пагінація | b o   |

## Утиліти

[KConfigProvider, useTheme, useToast, KVisuallyHidden, форматери](config-provider.md).
