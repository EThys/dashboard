/**
 * 1er badge — type de transaction (cartes / fiches) :
 * Vente → « Vente », location → « Location ».
 *
 * 2e badge — disponibilité (`sold`, etc.) : utiliser `getPublicListingStatus()` dans
 * `listingAvailability.ts` (Disponible / Déjà pris si location, Vendu si vente).
 */
export function isLocationTransactionType(t: string | undefined | null): boolean {
    const s = String(t ?? 'vente').toLowerCase()
    return s.includes('location') || s.includes('louer')
}

export function getPublicTransactionBadgeLabel(t: string | undefined | null): 'Vente' | 'Location' {
    return isLocationTransactionType(t) ? 'Location' : 'Vente'
}
