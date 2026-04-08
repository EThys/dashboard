/** Extraction d’URLs d’images (API CasaNayo : path, publicPath, tableaux, objets typés). */

export function firstUrlFromImageLike(value: unknown): string | undefined {
    if (value == null) return undefined
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (Array.isArray(value)) return firstUrlFromImageArray(value)
    if (typeof value === 'object') {
        const o = value as Record<string, unknown>
        const p = o.publicPath ?? o.path ?? o.url
        if (typeof p === 'string' && p.trim()) return p.trim()
    }
    return undefined
}

export function firstUrlFromImageArray(arr: unknown): string | undefined {
    if (!Array.isArray(arr) || arr.length === 0) return undefined
    for (const el of arr) {
        if (typeof el === 'string' && el.trim()) return el.trim()
        if (el && typeof el === 'object') {
            const o = el as Record<string, unknown>
            const p = o.publicPath ?? o.path ?? o.url
            if (typeof p === 'string' && p.trim()) return p.trim()
        }
    }
    return undefined
}

export function firstUrlFromImagesBucket(obj: unknown): string | undefined {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
    const bucket = obj as Record<string, unknown>
    const groups = ['main', 'room', 'living', 'kitchen', 'exterior', 'bathroom', 'other'] as const
    for (const g of groups) {
        const u = firstUrlFromImageArray(bucket[g])
        if (u) return u
    }
    return undefined
}

/**
 * Photo du bien uniquement (pas avatar membre) : propertyImage[], images[], images.main, image string.
 */
export function extractListingPhotoFromEntity(ent: Record<string, unknown> | undefined): string | undefined {
    if (!ent) return undefined
    let u = firstUrlFromImageLike(ent.propertyImage) || firstUrlFromImageArray(ent.propertyImage)
    if (u) return u
    if (ent.images && typeof ent.images === 'object' && !Array.isArray(ent.images)) {
        u = firstUrlFromImagesBucket(ent.images)
        if (u) return u
    }
    u = firstUrlFromImageArray(ent.images)
    if (u) return u
    if (typeof ent.image === 'string' && ent.image.trim()) {
        const s = ent.image.trim()
        if (!/avatar|ui-avatars|gravatar/i.test(s)) return s
    }
    return undefined
}

export function getReservationListingEntity(merged: Record<string, unknown>): Record<string, unknown> | undefined {
    const keys = ['property', 'terrain', 'bureau', 'festive', 'funeraire', 'hotel', 'vacance', 'chambre'] as const
    for (const k of keys) {
        const v = merged[k]
        if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>
    }
    return undefined
}

export function resolveReservationPropertyDetailId(merged: Record<string, unknown>): number | undefined {
    const n = (v: unknown): number | undefined => {
        if (v == null || v === '') return undefined
        const x = typeof v === 'number' ? v : parseInt(String(v), 10)
        return Number.isFinite(x) ? x : undefined
    }

    const id =
        n(merged.propertyId) ??
        n(merged.terrainId) ??
        n(merged.bureauId) ??
        n(merged.festiveId) ??
        n(merged.funeraireId) ??
        n(merged.vacanceId) ??
        n(merged.chambreId) ??
        n(merged.hotelId)

    if (id != null) return id

    const ent = getReservationListingEntity(merged)
    if (ent) {
        const fromEnt = n(ent.propertyId) ?? n(ent.id) ?? n(ent.terrainId) ?? n(ent.bureauId)
        if (fromEnt != null) return fromEnt
    }

    const prop = merged.property as Record<string, unknown> | undefined
    return n(prop?.propertyId) ?? n(prop?.id)
}

/** Avatar / photo profil (utilisateur ou prestataire). */
export function extractProfilePhoto(userLike: Record<string, unknown> | undefined): string | undefined {
    if (!userLike) return undefined
    const candidates = [
        userLike.profilePicture,
        userLike.profile,
        userLike.images,
        userLike.avatar,
        userLike.photo,
    ]
    for (const c of candidates) {
        if (typeof c === 'string' && c.trim().length > 2) return c.trim()
    }
    const profile = userLike.profile as Record<string, unknown> | undefined
    if (profile) {
        const p = profile.images ?? profile.image
        if (typeof p === 'string' && p.trim()) return p.trim()
    }
    return undefined
}
