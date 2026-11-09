import { encodeId } from '@/utils/urlObfuscator'

export type ListingKind = 'property' | 'hotel' | 'festive' | 'funeraire' | 'bureau' | 'terrain'

/** Lien public. Le type évite qu’un hôtel et une salle au même numéro ouvrent la même fiche. */
export function propertyPublicPath(id: number | string, kind?: string | null): string {
    const token = encodeId(id)
    const normalized = normalizeListingKind(kind)
    if (!normalized || normalized === 'property') return `/properties/${token}`
    return `/properties/${token}?kind=${normalized}`
}

export function normalizeListingKind(kind?: string | null): ListingKind | null {
    const value = String(kind ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    if (!value || value === 'property' || value === 'residentiel' || value === 'standard') return 'property'
    if (value === 'hotel' || value === 'hotels' || value === 'chambre') return 'hotel'
    if (value === 'festive' || value === 'fete' || value === 'salle de fete') return 'festive'
    if (value === 'funeraire' || value === 'funerailles') return 'funeraire'
    if (value === 'bureau' || value === 'bureaux') return 'bureau'
    if (value === 'terrain' || value === 'terrains') return 'terrain'
    return null
}
