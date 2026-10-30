/**
 * 1er badge — type de transaction (cartes / fiches) :
 * hôtel → « Hébergement », location → « Location », sinon « Vente ».
 *
 * 2e badge — disponibilité (`sold`, etc.) : utiliser `getPublicListingStatus()` dans
 * `listingAvailability.ts` (Disponible / Déjà pris si location, Vendu si vente).
 */
export function isLodgingTransactionType(t: string | undefined | null): boolean {
    const s = String(t ?? '').toLowerCase()
    return s.includes('héberg') || s.includes('heberg') || s.includes('hotel') || s.includes('hôtel')
}

export function isLocationTransactionType(t: string | undefined | null): boolean {
    const s = String(t ?? 'vente').toLowerCase()
    return s.includes('location') || s.includes('louer')
}

export function getPublicTransactionBadgeLabel(t: string | undefined | null): 'Vente' | 'Location' | 'Hébergement' {
    if (isLodgingTransactionType(t)) return 'Hébergement'
    return isLocationTransactionType(t) ? 'Location' : 'Vente'
}
