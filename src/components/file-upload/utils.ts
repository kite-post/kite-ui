/** Чи підходить файл під accept ('.csv,text/csv', 'image/*,.pdf'). */
export function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((a) => {
      if (a.startsWith('.')) return name.endsWith(a)
      if (a.endsWith('/*')) return type.startsWith(a.slice(0, -1))
      return type === a
    })
}

/** «.csv,text/csv» → «CSV»; «image/*,.pdf» → «Зображення, PDF». */
export function acceptLabel(
  accept: string | undefined,
  kindLabel: (kind: string) => string | undefined = () => undefined,
): string {
  if (!accept) return ''
  const labels = accept
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
    .map((a) => {
      if (a.startsWith('.')) return a.slice(1).toUpperCase()
      const [kind, sub] = a.split('/')
      if (sub === '*') return kindLabel(kind!) ?? kind!.toUpperCase()
      return (sub ?? a).replace(/^x-/, '').toUpperCase()
    })
  return [...new Set(labels)].join(', ')
}

/** Обрізання посередині: «vidpravky-lyst…2026.csv» — видно і початок, і розширення. */
export function middleTruncate(name: string, max = 36): string {
  if (name.length <= max) return name
  const tail = Math.min(12, Math.floor(max / 3))
  return `${name.slice(0, max - tail - 1)}…${name.slice(-tail)}`
}
