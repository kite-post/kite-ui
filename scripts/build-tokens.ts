// Генератор токенів: tokens/*.json → CSS-змінні, тема Tailwind, TS і Dart-пакет kite_tokens.
// Запуск: node scripts/build-tokens.ts (Node ≥ 24 знімає типи сам).
/* eslint-disable @typescript-eslint/no-explicit-any -- генератор читає довільний JSON токенів */
// Перевірка в CI: node scripts/build-tokens.ts --check — падає, якщо згенероване застаріло.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p: string): any => JSON.parse(readFileSync(resolve(root, p), 'utf8'))

const primitives = read('tokens/primitives.json')
const semantic = read('tokens/semantic.json')
const base = read('tokens/base.json')
const version: string = read('package.json').version

const HEADER = 'Згенеровано scripts/build-tokens.ts з tokens/*.json. Не редагувати руками.'
const rem = (px: number): string => (px === 0 ? '0' : `${px / 16}rem`)

// ---------- розв'язання посилань ----------
type Palette = Record<string, string | Record<string, string>>
const palette: Palette = primitives.color

function resolveRef(value: string): string {
  const m = /^\{([a-z]+)(?:\.(\d+))?\}$/.exec(value)
  if (!m) return value
  const [, group, step] = m
  const entry = palette[group!]
  const hex = step ? (entry as Record<string, string>)?.[step] : (entry as string)
  if (typeof hex !== 'string') throw new Error(`Невідоме посилання на токен: ${value}`)
  return hex
}

type Theme = 'light' | 'dark'
const semanticColor = (theme: Theme): Record<string, string> =>
  Object.fromEntries(
    Object.entries(semantic.color as Record<string, Record<Theme, string>>).map(([k, v]) => [
      k,
      resolveRef(v[theme]),
    ]),
  )
const semanticShadow = (theme: Theme): Record<string, string> =>
  Object.fromEntries(
    Object.entries(semantic.shadow as Record<string, Record<Theme, string>>).map(([k, v]) => [
      k,
      v[theme],
    ]),
  )

// ---------- CSS-змінні ----------
function themeVars(theme: Theme, indent: string): string {
  const lines: string[] = []
  for (const [k, v] of Object.entries(semanticColor(theme))) lines.push(`--kite-color-${k}: ${v};`)
  for (const [k, v] of Object.entries(semanticShadow(theme)))
    lines.push(`--kite-shadow-${k}: ${v};`)
  lines.push(`color-scheme: ${theme};`)
  return lines.map((l) => indent + l).join('\n')
}

function staticVars(indent: string): string {
  const lines: string[] = []
  for (const [group, entry] of Object.entries(palette)) {
    if (typeof entry === 'string') lines.push(`--kite-${group}: ${entry};`)
    else
      for (const [step, hex] of Object.entries(entry))
        lines.push(`--kite-${group}-${step}: ${hex};`)
  }
  for (const [k, v] of Object.entries(base.font as Record<string, string>))
    lines.push(`--kite-font-${k}: ${v};`)
  for (const [k, t] of Object.entries(base.text as Record<string, any>)) {
    lines.push(`--kite-text-${k}-size: ${rem(t.size)};`)
    lines.push(`--kite-text-${k}-line-height: ${rem(t.line)};`)
    lines.push(`--kite-text-${k}-weight: ${t.weight};`)
    lines.push(`--kite-text-${k}-tracking: ${t.tracking};`)
    lines.push(`--kite-text-${k}-font: var(--kite-font-${t.font});`)
  }
  lines.push(`--kite-space-unit: ${rem(base.space.unit)};`)
  for (const [k, v] of Object.entries(base.radius as Record<string, number>))
    lines.push(`--kite-radius-${k}: ${k === 'full' ? '9999px' : rem(v)};`)
  for (const [k, v] of Object.entries(base.duration as Record<string, number>))
    lines.push(`--kite-duration-${k}: ${v}ms;`)
  for (const [k, v] of Object.entries(base.ease as Record<string, string>))
    lines.push(`--kite-ease-${k}: ${v};`)
  for (const [k, v] of Object.entries(base.z as Record<string, number>))
    lines.push(`--kite-z-${k}: ${v};`)
  for (const [k, v] of Object.entries(base.size as Record<string, number>))
    lines.push(`--kite-size-${k}: ${rem(v)};`)
  for (const [k, v] of Object.entries(base.container as Record<string, number>))
    lines.push(`--kite-container-${k}: ${rem(v)};`)
  return lines.map((l) => indent + l).join('\n')
}

const tokensCss = `/* ${HEADER} */
/* Типово — світла тема; темна — за системою, якщо не обрано світлу явно, або за data-theme="dark". */
:root {
${staticVars('  ')}
${themeVars('light', '  ')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${themeVars('dark', '    ')}
  }
}

:root[data-theme='dark'],
[data-theme='dark'] {
${themeVars('dark', '  ')}
}

[data-theme='light'] {
${themeVars('light', '  ')}
}
`

// ---------- тема Tailwind ----------
// Кольори тексту в Tailwind — fg-*, рамок — line-*, щоб класи читались:
// text-fg-muted, border-line-input. Примітиви палітри в тему не потрапляють навмисно.
function twColorName(k: string): string {
  if (k === 'text') return 'fg'
  if (k.startsWith('text-')) return 'fg-' + k.slice(5).replace(/^link/, 'link')
  if (k === 'border') return 'line'
  if (k.startsWith('border-')) return 'line-' + k.slice(7)
  return k
}

const twLines: string[] = []
for (const k of Object.keys(semantic.color))
  twLines.push(`--color-${twColorName(k)}: var(--kite-color-${k});`)
twLines.push('--color-transparent: transparent;', '--color-current: currentColor;')
for (const k of Object.keys(base.font)) twLines.push(`--font-${k}: var(--kite-font-${k});`)
for (const k of Object.keys(base.text)) {
  twLines.push(`--text-${k}: var(--kite-text-${k}-size);`)
  twLines.push(`--text-${k}--line-height: var(--kite-text-${k}-line-height);`)
  twLines.push(`--text-${k}--letter-spacing: var(--kite-text-${k}-tracking);`)
  twLines.push(`--text-${k}--font-weight: var(--kite-text-${k}-weight);`)
}
for (const k of Object.keys(base.radius)) twLines.push(`--radius-${k}: var(--kite-radius-${k});`)
for (const k of Object.keys(semantic.shadow))
  twLines.push(`--shadow-${k}: var(--kite-shadow-${k});`)
for (const k of Object.keys(base.ease))
  if (k !== 'linear') twLines.push(`--ease-${k}: var(--kite-ease-${k});`)

const twStatic: string[] = [`--spacing: ${rem(base.space.unit)};`]
for (const [k, v] of Object.entries(base.breakpoint as Record<string, number>))
  twStatic.push(`--breakpoint-${k}: ${rem(v)};`)
for (const [k, v] of Object.entries(base.container as Record<string, number>))
  twStatic.push(`--container-${k}: ${rem(v)};`)
twStatic.push(
  '--default-transition-duration: 100ms;',
  '--default-transition-timing-function: var(--kite-ease-out);',
)
twStatic.push(
  '--font-weight-normal: 400;',
  '--font-weight-medium: 500;',
  '--font-weight-semibold: 600;',
  '--font-weight-bold: 700;',
)

const themeCss = `/* ${HEADER} */
/* Тема Tailwind v4 на токенах Kite. Застосунок на Tailwind підключає її після tailwindcss,
   і його утиліти (bg-surface, text-fg-muted, rounded-md, shadow-lg…) беруть ті самі токени.
   Стандартні кольори, розміри й тіні Tailwind вимкнено — у кіті є лише токени. */
@theme {
  --*: initial;
${twStatic.map((l) => '  ' + l).join('\n')}
}

@theme inline {
${twLines.map((l) => '  ' + l).join('\n')}
}
`

// ---------- TypeScript ----------
const varMap = (prefix: string, keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, `var(--kite-${prefix}-${k})`]))
const tsTokens = {
  color: varMap('color', Object.keys(semantic.color)),
  shadow: varMap('shadow', Object.keys(semantic.shadow)),
  radius: varMap('radius', Object.keys(base.radius)),
  font: varMap('font', Object.keys(base.font)),
  duration: varMap('duration', Object.keys(base.duration)),
  ease: varMap('ease', Object.keys(base.ease)),
  z: varMap('z', Object.keys(base.z)),
  size: varMap('size', Object.keys(base.size)),
}
const tsRaw = {
  palette,
  color: { light: semanticColor('light'), dark: semanticColor('dark') },
  shadow: { light: semanticShadow('light'), dark: semanticShadow('dark') },
  font: base.font,
  text: base.text,
  space: base.space,
  radius: base.radius,
  duration: base.duration,
  ease: base.ease,
  z: base.z,
  size: base.size,
  breakpoint: base.breakpoint,
}
const tsOut = `// ${HEADER}

/** Токени як CSS-змінні: підходять для style-атрибутів і бібліотек, що приймають CSS-значення. */
export const tokens = ${JSON.stringify(tsTokens, null, 2)} as const

/** Сирі значення для canvas, MapLibre, графіків і Flutter. */
export const raw = ${JSON.stringify(tsRaw, null, 2)} as const

/** Назви з теми Tailwind — для tailwind-merge, щоб k:text-h1 не плутався з кольором тексту. */
export const twTheme = ${JSON.stringify(
  {
    color: [...Object.keys(semantic.color).map(twColorName), 'transparent', 'current'],
    text: Object.keys(base.text),
    radius: Object.keys(base.radius),
    shadow: Object.keys(semantic.shadow),
    font: Object.keys(base.font),
    ease: Object.keys(base.ease).filter((k) => k !== 'linear'),
  },
  null,
  2,
)} as const

export type SemanticColor = keyof typeof tokens.color
export type ThemeName = 'light' | 'dark'
`

// ---------- Dart (Flutter) ----------
function dartColor(v: string): string {
  if (v === 'transparent') return 'Color(0x00000000)'
  const hex = /^#([0-9a-f]{6})$/i.exec(v)
  if (hex) return `Color(0xFF${hex[1]!.toUpperCase()})`
  const rgb = /^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/.exec(v)
  if (rgb) {
    const a = Math.round(Number(rgb[4]) * 255)
    const h = (n: number) => n.toString(16).padStart(2, '0').toUpperCase()
    return `Color(0x${h(a)}${h(+rgb[1]!)}${h(+rgb[2]!)}${h(+rgb[3]!)})`
  }
  throw new Error(`Не можу перетворити колір для Dart: ${v}`)
}
const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
function dartScheme(name: string, theme: Theme): string {
  const c = semanticColor(theme)
  return `  static const ${name} = KiteColorScheme(\n${Object.entries(c)
    .map(([k, v]) => `    ${camel(k)}: ${dartColor(v)},`)
    .join('\n')}\n  );`
}
const colorKeys = Object.keys(semantic.color)
const dartOut = `// ${HEADER}
// Ті самі токени для kite-mobile (5.2): Flutter-пакет kite_tokens, git-залежність за тегом kite-ui.
// ignore_for_file: public_member_api_docs

import 'package:flutter/painting.dart';

abstract final class KitePalette {
${Object.entries(palette)
  .flatMap(([g, e]) =>
    typeof e === 'string'
      ? [`  static const ${camel(g)} = ${dartColor(e)};`]
      : Object.entries(e).map(([s, hex]) => `  static const ${camel(g)}${s} = ${dartColor(hex)};`),
  )
  .join('\n')}
}

final class KiteColorScheme {
  const KiteColorScheme({
${colorKeys.map((k) => `    required this.${camel(k)},`).join('\n')}
  });

${colorKeys.map((k) => `  final Color ${camel(k)};`).join('\n')}

${dartScheme('light', 'light')}

${dartScheme('dark', 'dark')}
}

abstract final class KiteRadius {
${Object.entries(base.radius as Record<string, number>)
  .map(([k, v]) => `  static const double ${camel(k)} = ${v === 9999 ? '999' : v};`)
  .join('\n')}
}

abstract final class KiteSpace {
  static const double unit = ${base.space.unit};
  static double of(int n) => unit * n;
}

abstract final class KiteDuration {
${Object.entries(base.duration as Record<string, number>)
  .map(([k, v]) => `  static const ${camel(k)} = Duration(milliseconds: ${v});`)
  .join('\n')}
}

abstract final class KiteText {
${Object.entries(base.text as Record<string, any>)
  .map(
    ([k, t]) =>
      `  static const ${camel(k)} = TextStyle(fontFamily: '${t.font === 'display' ? 'Unbounded' : t.font === 'mono' ? 'JetBrains Mono' : 'Manrope'}', fontSize: ${t.size}, height: ${+(t.line / t.size).toFixed(4)}, fontWeight: FontWeight.w${t.weight}${t.tracking !== '0' ? `, letterSpacing: ${+(parseFloat(t.tracking) * t.size).toFixed(2)}` : ''});`,
  )
  .join('\n')}
}
`

// Версія Dart-пакета = версія @kite-post/ui, тож тег vX.Y.Z однаково читається з обох боків.
// publish_to: none — пакет живе лише в git, на pub.dev його не публікуємо (як kite_contracts).
const pubspecOut = `# ${HEADER}
name: kite_tokens
description: Дизайн-токени Kite для Flutter (kite-mobile), згенеровані з kite-ui.
version: ${version}
repository: https://github.com/kite-post/kite-ui
publish_to: none

environment:
  sdk: ^3.0.0
  flutter: '>=3.10.0'

dependencies:
  flutter:
    sdk: flutter
`

// ---------- запис ----------
const outputs: Record<string, string> = {
  'src/styles/tokens.css': tokensCss,
  'src/styles/theme.css': themeCss,
  'src/tokens/tokens.generated.ts': tsOut,
  'tokens/dart/lib/kite_tokens.dart': dartOut,
  'tokens/dart/pubspec.yaml': pubspecOut,
}

const check = process.argv.includes('--check')
let stale = 0
for (const [rel, content] of Object.entries(outputs)) {
  const abs = resolve(root, rel)
  const current = existsSync(abs) ? readFileSync(abs, 'utf8') : ''
  if (check) {
    if (current !== content) {
      console.error(`Застаріло: ${rel} — запустіть node scripts/build-tokens.ts`)
      stale++
    }
    continue
  }
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, content)
  console.log(`✓ ${rel}`)
}
if (stale) process.exit(1)
