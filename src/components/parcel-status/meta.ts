import {
  Ban,
  CircleCheck,
  FileCheck,
  FilePen,
  Package,
  PackageCheck,
  PackageOpen,
  Pause,
  SearchX,
  Truck,
  Undo2,
  Warehouse,
  CircleHelp,
} from '@lucide/vue'
import type { Component } from 'vue'

import type { BadgeTone } from '../badge/variants'

/**
 * Стани місця (документація 7.1). Збігається з ShipmentStatus з @kite-post/contracts;
 * кіт не залежить від contracts, щоб не тягнути його в застосунки без API.
 */
export type ParcelStatus =
  | 'DRAFT'
  | 'CREATED'
  | 'CANCELLED'
  | 'ACCEPTED'
  | 'IN_TRANSIT'
  | 'AT_HUB'
  | 'SORTED'
  | 'ON_HOLD'
  | 'READY_FOR_PICKUP'
  | 'DELIVERED'
  | 'RETURNED'
  | 'LOST'

export interface ParcelStatusMeta {
  tone: BadgeTone
  icon: Component
  known: boolean
}

// Стайлгайд 3.2, «Статуси посилки → тон».
const table: Record<ParcelStatus, Omit<ParcelStatusMeta, 'known'>> = {
  DRAFT: { tone: 'neutral', icon: FilePen },
  CREATED: { tone: 'neutral', icon: FileCheck },
  ACCEPTED: { tone: 'info', icon: PackageCheck },
  IN_TRANSIT: { tone: 'info', icon: Truck },
  AT_HUB: { tone: 'info', icon: Warehouse },
  SORTED: { tone: 'info', icon: Package },
  ON_HOLD: { tone: 'warning', icon: Pause },
  READY_FOR_PICKUP: { tone: 'success', icon: PackageOpen },
  DELIVERED: { tone: 'success', icon: CircleCheck },
  RETURNED: { tone: 'warning', icon: Undo2 },
  CANCELLED: { tone: 'neutral', icon: Ban },
  LOST: { tone: 'danger', icon: SearchX },
}

export const PARCEL_STATUSES = Object.keys(table) as ParcelStatus[]

/** Тон та іконка стану — для бейджів, графіків, фільтрів і легенд. */
export function parcelStatusMeta(status: string): ParcelStatusMeta {
  const m = table[status as ParcelStatus]
  return m ? { ...m, known: true } : { tone: 'neutral', icon: CircleHelp, known: false }
}
