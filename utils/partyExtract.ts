/**
 * Extraction des membres (demandeur, hôte, prestataire) depuis les payloads API,
 * sur le même principe que l’app mobile (champs `user`, `owner`, `member`, etc.).
 */
import { extractProfilePhoto } from '@/utils/mediaExtract'

export function pickMemberRecord(...candidates: unknown[]): Record<string, unknown> | undefined {
    for (const v of candidates) {
        if (!v || typeof v !== 'object' || Array.isArray(v)) continue
        const o = v as Record<string, unknown>
        const nestedUser = o.user
        if (nestedUser && typeof nestedUser === 'object' && !Array.isArray(nestedUser)) {
            const inner = nestedUser as Record<string, unknown>
            if (
                inner.username != null ||
                inner.fullName != null ||
                inner.userId != null ||
                inner.profile != null ||
                inner.profilePicture != null
            ) {
                return inner
            }
        }
        if (
            o.username != null ||
            o.fullName != null ||
            o.userId != null ||
            o.profile != null ||
            o.profilePicture != null ||
            o.name != null
        ) {
            return o
        }
    }
    return undefined
}

/** Propriétaire / annonceur rattaché au bien réservé. */
export function pickOwnerHostFromListing(ent: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
    if (!ent) return undefined
    return pickMemberRecord(
        ent.owner,
        ent.user,
        ent.publisher,
        ent.host,
        ent.member,
        (ent.owner as Record<string, unknown> | undefined)?.user,
        (ent.host as Record<string, unknown> | undefined)?.user
    )
}

function profileRecord(u: Record<string, unknown>): Record<string, unknown> | undefined {
    const profile = u.profile
    if (profile && typeof profile === 'object' && !Array.isArray(profile)) return profile as Record<string, unknown>
    return undefined
}

function named(source: Record<string, unknown> | undefined): string {
    if (!source) return ''
    const direct =
        (typeof source.fullName === 'string' && source.fullName.trim()) ||
        (typeof source.full_name === 'string' && source.full_name.trim()) ||
        (typeof source.username === 'string' && source.username.trim()) ||
        (typeof source.name === 'string' && source.name.trim()) ||
        ''
    if (direct) return direct
    return [source.firstName ?? source.first_name ?? source.prenom, source.lastName ?? source.last_name ?? source.nom]
        .filter((part) => part != null && String(part).trim())
        .map((part) => String(part).trim())
        .join(' ')
        .trim()
}

export function memberDisplayName(u: Record<string, unknown> | undefined, fallbackUserId?: number): string {
    if (!u) {
        if (fallbackUserId != null && Number.isFinite(fallbackUserId)) return `Membre #${fallbackUserId}`
        return '—'
    }
    const n = named(u) || named(profileRecord(u))
    if (n) return n
    const id = typeof u.userId === 'number' ? u.userId : parseInt(String(u.userId ?? ''), 10)
    if (Number.isFinite(id)) return `Membre #${id}`
    if (fallbackUserId != null && Number.isFinite(fallbackUserId)) return `Membre #${fallbackUserId}`
    return '—'
}

export function memberAvatar(u: Record<string, unknown> | undefined): string | undefined {
    return extractProfilePhoto(u)
}
