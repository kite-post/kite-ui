import type { ParcelStatus } from '../components/parcel-status/meta'

export interface Shipment {
  id: string
  number: string
  recipient: string
  city: string
  status: ParcelStatus
  weight: number
  cod: number | null
  created: string
}

const names = [
  'Ольга Ковальчук',
  'Андрій Мельник',
  'Ірина Петренко',
  'Тарас Бондар',
  'Марія Шевчук',
  'Олег Ткаченко',
  'Наталія Кравець',
  'Юрій Мороз',
]
const cities = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Вінниця', 'Ужгород']
const statuses: ParcelStatus[] = [
  'CREATED',
  'ACCEPTED',
  'IN_TRANSIT',
  'AT_HUB',
  'SORTED',
  'ON_HOLD',
  'READY_FOR_PICKUP',
  'DELIVERED',
  'RETURNED',
  'LOST',
]

function s10(serial: string) {
  const w = [8, 6, 4, 2, 3, 5, 9, 7]
  const sum = w.reduce((a, x, i) => a + x * Number(serial[i]), 0)
  const c = 11 - (sum % 11)
  return `KT${serial}${c === 10 ? 0 : c === 11 ? 5 : c}UA`
}

export const shipments: Shipment[] = Array.from({ length: 137 }, (_, i) => {
  const serial = String(12345678 + i * 7919)
    .slice(-8)
    .padStart(8, '0')
  const d = new Date(2026, 10, 24 - (i % 30), 9 + (i % 9), (i * 7) % 60)
  return {
    id: String(i + 1),
    number: s10(serial),
    recipient: names[i % names.length]!,
    city: cities[(i * 3) % cities.length]!,
    status: statuses[(i * 7) % statuses.length]!,
    weight: Math.round((((i * 37) % 300) / 10 + 0.3) * 10) / 10,
    cod: i % 4 === 0 ? ((i * 1300) % 250000) + 5000 : null,
    created: d.toISOString(),
  }
})
