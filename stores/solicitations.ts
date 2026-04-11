import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { extractProfilePhoto, firstUrlFromImageArray, firstUrlFromImageLike } from '@/utils/mediaExtract'
import { memberDisplayName, pickMemberRecord } from '@/utils/partyExtract'

export interface SolicitationListItem {
    id: number
    userId?: number
    prestationId?: number
    deviseId?: number
    budget?: number
    description?: string
    status: string
    displayStatus: string
    startDate?: string
    endDate?: string
    createdAt?: string
    prestationTitle?: string
    /** Visuel du service (galerie / première image annonce). */
    prestationImage?: string
    /** Photo de profil du prestataire sollicité (vue « mes sollicitations »). */
    providerProfileImage?: string
    /** Photo de profil du demandeur (vue « sur mes prestations »). */
    requesterProfileImage?: string
    requesterUsername?: string
    providerUsername?: string
    /** Libellé affichable (nom complet prioritaire). */
    requesterDisplayName?: string
    providerDisplayName?: string
    raw: Record<string, unknown>
}

function getStatusLabel(status: string): string {
    const s = String(status || '').toUpperCase()
    if (s === 'PENDING') return 'En attente'
    if (s === 'ACCEPTED' || s === 'CONFIRMED') return 'Acceptée'
    if (s === 'REJECTED' || s === 'CANCELLED') return 'Refusée'
    return s || 'Inconnu'
}

function extractSollicitationArray(payload: unknown): unknown[] {
    if (!payload || typeof payload !== 'object') return []
    const o = payload as Record<string, unknown>
    if (Array.isArray(payload)) return payload
    const fromData = o.data
    if (Array.isArray(fromData)) return fromData
    const fromSol = o.sollicitation
    if (Array.isArray(fromSol)) return fromSol
    const fromRes = o.reservation
    if (Array.isArray(fromRes)) return fromRes
    return []
}

function normalizeSolicitation(raw: unknown): SolicitationListItem | null {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    const inner =
        r.sollicitation && typeof r.sollicitation === 'object'
            ? (r.sollicitation as Record<string, unknown>)
            : r

    const idRaw = inner.id ?? r.id
    const numId = typeof idRaw === 'number' ? idRaw : parseInt(String(idRaw), 10)
    if (!Number.isFinite(numId)) return null

    const prest = (inner.prestation ?? r.prestation) as Record<string, unknown> | undefined
    const prestInner = prest?.prestation && typeof prest.prestation === 'object'
        ? (prest.prestation as Record<string, unknown>)
        : prest

    let prestationTitle: string | undefined
    if (prestInner?.title) prestationTitle = String(prestInner.title)
    else if (prest?.title) prestationTitle = String(prest.title)

    let prestationImage =
        firstUrlFromImageLike(prestInner?.image ?? prest?.image) ||
        firstUrlFromImageArray((prestInner as Record<string, unknown> | undefined)?.images) ||
        firstUrlFromImageArray((prest as Record<string, unknown> | undefined)?.images)

    const u = (inner.user ?? r.user) as Record<string, unknown> | undefined
    const uInner = u?.user && typeof u.user === 'object' ? (u.user as Record<string, unknown>) : u
    const requesterRec = pickMemberRecord(
        uInner,
        u,
        inner.member,
        inner.client,
        inner.demandeur,
        inner.requestedBy,
        r.member
    )
    const requesterUidRaw =
        typeof inner.userId === 'number' ? inner.userId : parseInt(String(inner.userId ?? ''), 10)
    const requesterUid = Number.isFinite(requesterUidRaw) ? requesterUidRaw : undefined

    const requesterUsername =
        (requesterRec?.username as string) ||
        (uInner?.username as string) ||
        (u?.username as string) ||
        undefined

    const providerUser =
        pickMemberRecord(
            prestInner?.user,
            prest?.user,
            inner.prestataire,
            prest?.prestataire,
            (prest as Record<string, unknown> | undefined)?.account,
            inner.host
        ) ||
        (prestInner?.user && typeof prestInner.user === 'object'
            ? (prestInner.user as Record<string, unknown>)
            : undefined) ||
        (prest?.user && typeof prest.user === 'object' ? (prest.user as Record<string, unknown>) : undefined)

    const providerProfileImage =
        (typeof prestInner?.profile === 'string' && prestInner.profile.trim()
            ? prestInner.profile.trim()
            : undefined) ||
        (typeof prest?.profile === 'string' && prest.profile.trim() ? prest.profile.trim() : undefined) ||
        extractProfilePhoto(providerUser)

    const requesterProfileImage =
        extractProfilePhoto(requesterRec) || extractProfilePhoto(uInner) || extractProfilePhoto(u)

    const providerUsername =
        (providerUser?.username as string) ||
        (prestInner?.username as string) ||
        (prestInner?.postBy as string) ||
        (prest?.username as string) ||
        undefined

    const requesterDisplayName = memberDisplayName(requesterRec, requesterUid)
    const providerDisplayName = memberDisplayName(providerUser, undefined)

    const status = String(inner.status ?? 'PENDING').toUpperCase()

    return {
        id: numId,
        userId: typeof inner.userId === 'number' ? inner.userId : parseInt(String(inner.userId), 10) || undefined,
        prestationId:
            typeof inner.prestationId === 'number'
                ? inner.prestationId
                : parseInt(String(inner.prestationId), 10) || undefined,
        deviseId:
            typeof inner.deviseId === 'number' ? inner.deviseId : parseInt(String(inner.deviseId), 10) || undefined,
        budget: typeof inner.budget === 'number' ? inner.budget : parseFloat(String(inner.budget || 0)) || undefined,
        description: inner.description as string | undefined,
        status,
        displayStatus: getStatusLabel(status),
        startDate: inner.startDate as string | undefined,
        endDate: inner.endDate as string | undefined,
        createdAt: inner.createdAt as string | undefined,
        prestationTitle,
        prestationImage,
        providerProfileImage,
        requesterProfileImage,
        requesterUsername,
        providerUsername,
        requesterDisplayName,
        providerDisplayName,
        raw: r,
    }
}

export const useSolicitationStore = defineStore('solicitations', {
    state: () => ({
        isUpdating: false,
        userSolicitations: [] as SolicitationListItem[],
        hostSolicitations: [] as SolicitationListItem[],
    }),

    actions: {
        async fetchUserSolicitations(force = false): Promise<SolicitationListItem[]> {
            if (!force && this.userSolicitations.length > 0) return this.userSolicitations

            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.isAuthenticated || !auth.user) auth.checkSession()
            if (!auth.isAuthenticated || !auth.token) return []

            const userId = auth.user!.userId || (auth.user as { id?: number }).id
            if (userId == null) return []

            const apiBase = config.public.apiBase as string
            const url = joinApi(apiBase, `${ApiEndpoints.sollicitationsByUser}${userId}`)
            try {
                const res = await $fetch<Record<string, unknown>>(url, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
                const list = extractSollicitationArray(res)
                const out: SolicitationListItem[] = []
                for (const item of list) {
                    const n = normalizeSolicitation(item)
                    if (n) out.push(n)
                }
                out.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
                this.userSolicitations = out
                return out
            } catch (e) {
                console.warn('[solicitations user]', e)
                return []
            }
        },

        async fetchHostSolicitations(force = false): Promise<SolicitationListItem[]> {
            if (!force && this.hostSolicitations.length > 0) return this.hostSolicitations

            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.isAuthenticated || !auth.user) auth.checkSession()
            if (!auth.isAuthenticated || !auth.token) return []

            const userId = auth.user!.userId || (auth.user as { id?: number }).id
            if (userId == null) return []

            const apiBase = config.public.apiBase as string
            const url = joinApi(apiBase, `${ApiEndpoints.sollicitationsByHost}${userId}`)
            try {
                const res = await $fetch<Record<string, unknown>>(url, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
                const list = extractSollicitationArray(res)
                const out: SolicitationListItem[] = []
                for (const item of list) {
                    const n = normalizeSolicitation(item)
                    if (n) out.push(n)
                }
                out.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
                this.hostSolicitations = out
                return out
            } catch (e) {
                console.warn('[solicitations host]', e)
                return []
            }
        },

        async updateStatus(
            sollicitationId: number,
            status: 'ACCEPTED' | 'REJECTED' | 'PENDING'
        ): Promise<{ success: boolean; message?: string }> {
            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.token) return { success: false, message: 'Non authentifié' }

            this.isUpdating = true
            try {
                await $fetch(joinApi(config.public.apiBase as string, `${ApiEndpoints.updateSollicitation}${sollicitationId}`), {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: { status },
                })
                return { success: true }
            } catch (e: any) {
                const msg = e?.data?.message || e?.message || 'Mise à jour impossible'
                return { success: false, message: String(msg) }
            } finally {
                this.isUpdating = false
            }
        },

        countByStatus(list: SolicitationListItem[]) {
            const norm = (s: string) => s.toUpperCase()
            return {
                all: list.length,
                pending: list.filter((x) => norm(x.status) === 'PENDING').length,
                accepted: list.filter((x) => norm(x.status) === 'ACCEPTED' || norm(x.status) === 'CONFIRMED').length,
                rejected: list.filter((x) => norm(x.status) === 'REJECTED' || norm(x.status) === 'CANCELLED').length,
            }
        },
    },
})
