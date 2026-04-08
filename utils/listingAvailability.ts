import { isLocationTransactionType } from '@/utils/transactionDisplay'

/**
 * Statut d’annonce aligné sur les champs BD (sold, available, active).
 * Libellés « disponibilité » (2ᵉ badge) : selon transaction — location → Déjà pris / Disponible, vente → Vendu / Disponible.
 */
export type PublicListingAvailabilityKind = 'available' | 'unlisted' | 'sold'

export interface PublicListingStatus {
  kind: PublicListingAvailabilityKind
  label: string
  badgeClass: string
}

function resolveTransactionType(
  entity: Record<string, unknown>,
  transactionType?: string | null
): string | null {
  if (transactionType != null && String(transactionType).trim() !== '') return String(transactionType)
  const t = entity.transactionType
  if (typeof t === 'string') return t
  return null
}

export function getPublicListingStatus(
  entity: Record<string, unknown> | null | undefined,
  transactionType?: string | null
): PublicListingStatus {
  if (!entity || typeof entity !== 'object') {
    return {
      kind: 'available',
      label: 'Disponible',
      badgeClass: 'bg-emerald-600/90 text-white',
    }
  }
  const tx = resolveTransactionType(entity, transactionType)

  if (entity.sold === true) {
    const loc = isLocationTransactionType(tx)
    return {
      kind: 'sold',
      label: loc ? 'Déjà pris' : 'Vendu',
      badgeClass: loc ? 'bg-rose-600/95 text-white' : 'bg-red-600/95 text-white',
    }
  }
  const available = entity.available !== false
  const active = entity.active !== false
  if (!available || !active) {
    return {
      kind: 'unlisted',
      label: 'Non disponible',
      badgeClass: 'bg-slate-700/95 text-white',
    }
  }
  return {
    kind: 'available',
    label: 'Disponible',
    badgeClass: 'bg-emerald-600/90 text-white',
  }
}
