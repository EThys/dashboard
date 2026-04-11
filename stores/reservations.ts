import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { evaluateReservationEligibility } from '@/composables/useReservationEligibility'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import {
    extractListingPhotoFromEntity,
    getReservationListingEntity,
    resolveReservationPropertyDetailId,
} from '@/utils/mediaExtract'
import {
    memberAvatar,
    memberDisplayName,
    pickMemberRecord,
    pickOwnerHostFromListing,
} from '@/utils/partyExtract'

export interface ReservationListItem {
    reservationId: number
    status: string
    displayStatus: string
    type?: string
    message?: string
    startDate?: string
    endDate?: string
    reservationHeure?: string
    createdAt?: string
    cancellationReason?: string
    propertyTitle?: string
    /** Photo du bien uniquement (pas profil membre). */
    propertyImage?: string
    /** Id du bien pour lien `/properties/:id`. */
    propertyDetailId?: number
    /** Type du bien (Studio, Appartement, Terrain, etc.) */
    propertyType?: string
    /** Demandeur (réservation) — surtout utile en vue hôte. */
    guestDisplayName?: string
    guestProfileImage?: string
    guestUserId?: number
    /** Hôte / annonceur du bien — surtout utile en vue « mes réservations ». */
    hostDisplayName?: string
    hostProfileImage?: string
    hostUserId?: number
    sourceCategory: string
    userImage?: string
    raw: Record<string, unknown>
}

function getStatusLabel(status: string): string {
    const s = String(status || '').toUpperCase()
    if (s === 'PENDING') return 'En attente'
    if (s === 'CONFIRMED' || s === 'ACCEPTED') return 'Confirmé'
    if (s === 'COMPLETED' || s === 'FINISHED') return 'Terminé'
    if (s === 'CANCELLED' || s === 'REJECTED') return 'Annulé'
    return s || 'Inconnu'
}

function extractReservationArray(payload: unknown): unknown[] {
    if (!payload || typeof payload !== 'object') return []
    const o = payload as Record<string, unknown>
    const arr = o.reservation ?? o.reservations ?? o.data
    return Array.isArray(arr) ? arr : []
}

function normalizeReservation(raw: unknown, sourceCategory: string): ReservationListItem | null {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    const innerRes = r.reservation && typeof r.reservation === 'object' ? (r.reservation as Record<string, unknown>) : null
    const merged: Record<string, unknown> = innerRes ? { ...r, ...innerRes } : r

    const rid = merged.reservationId ?? merged.id
    const numId = typeof rid === 'number' ? rid : parseInt(String(rid), 10)
    if (!Number.isFinite(numId)) return null

    const prop = (merged.property ?? r.property) as Record<string, unknown> | undefined
    const listingEnt = getReservationListingEntity(merged) ?? prop

    let propertyTitle = prop?.title as string | undefined
    if (!propertyTitle && listingEnt) {
        propertyTitle =
            (listingEnt.title as string) ||
            (listingEnt.name as string) ||
            (listingEnt.label as string) ||
            undefined
    }
    if (!propertyTitle) {
        const labels: Record<string, string> = {
            vacance: 'Séjour / location',
            terrain: 'Terrain',
            bureau: 'Bureau',
            festive: 'Salle festive',
            funeraire: 'Espace funéraire',
            chambre: 'Chambre / hôtel',
            standard: 'Propriété',
        }
        propertyTitle = labels[sourceCategory] || 'Réservation'
    }

    let propertyImage = extractListingPhotoFromEntity(listingEnt)
    if (!propertyImage && prop) {
        propertyImage = extractListingPhotoFromEntity(prop)
    }

    const propertyDetailId = resolveReservationPropertyDetailId(merged)

    let propertyType = (listingEnt?.type as string) || (merged?.typeProperty as string) || (prop?.type as string)
    if (!propertyType && (listingEnt as any)?.category) {
        propertyType = (listingEnt as any).category
    }
    // UX Cleanup: Avoid 'STANDARD' as a label
    if (propertyType && String(propertyType).toUpperCase() === 'STANDARD') {
        propertyType = 'Propriété'
    }

    const guestUserRec = pickMemberRecord(
        merged.user,
        merged.member,
        merged.client,
        merged.guest,
        merged.requestedBy,
        r.user,
        innerRes?.user,
        innerRes?.member
    )
    const guestUserIdRaw = merged.userId ?? innerRes?.userId ?? guestUserRec?.userId
    const guestUserId = (() => {
        if (typeof guestUserIdRaw === 'number' && Number.isFinite(guestUserIdRaw)) return guestUserIdRaw
        const p = parseInt(String(guestUserIdRaw ?? ''), 10)
        return Number.isFinite(p) ? p : undefined
    })()

    const hostUserRec =
        pickOwnerHostFromListing(listingEnt) ||
        pickOwnerHostFromListing(prop as Record<string, unknown> | undefined) ||
        pickMemberRecord(merged.host, merged.owner, merged.propertyOwner, merged.publisher, r.host)

    const hostUserIdRaw =
        hostUserRec?.userId ??
        (listingEnt?.userId as number | undefined) ??
        (prop?.userId as number | undefined)
    const hostUserId = (() => {
        if (typeof hostUserIdRaw === 'number' && Number.isFinite(hostUserIdRaw)) return hostUserIdRaw
        const p = parseInt(String(hostUserIdRaw ?? ''), 10)
        return Number.isFinite(p) ? p : undefined
    })()

    // Extract userImage from root or sub-objects
    const userImage = (r.userImage || merged.userImage || guestUserRec?.userImage) as string | undefined

    return {
        reservationId: numId,
        status: String(merged.status ?? 'UNKNOWN').toUpperCase(),
        displayStatus: getStatusLabel(String(merged.status ?? 'UNKNOWN')),
        type: merged.type as string | undefined,
        propertyType,
        message: merged.message as string | undefined,
        startDate: merged.startDate as string | undefined,
        endDate: merged.endDate as string | undefined,
        reservationHeure: merged.reservationHeure as string | undefined,
        createdAt: merged.createdAt as string | undefined,
        cancellationReason: merged.cancellationReason as string | undefined,
        propertyTitle,
        propertyImage,
        propertyDetailId,
        guestDisplayName: memberDisplayName(guestUserRec, guestUserId),
        guestProfileImage: userImage || memberAvatar(guestUserRec),
        guestUserId,
        hostDisplayName: memberDisplayName(hostUserRec, hostUserId),
        hostProfileImage: memberAvatar(hostUserRec),
        hostUserId,
        sourceCategory,
        userImage,
        raw: r,
    }
}

export type ReservationType = 'STANDARD' | 'VIP' | 'PREMIUM'

export interface ReservationRequest {
    userId: number
    propertyId?: number
    vacanceId?: number
    terrainId?: number
    funeraireId?: number
    festiveId?: number
    bureauId?: number
    startDate: string
    endDate: string
    message: string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    type: ReservationType
    reservationHeure: string
    createdAt: string
}

export const useReservationStore = defineStore('reservations', {
    state: () => ({
        isSubmitting: false,
        lastError: null as string | null,
        userReservations: [] as ReservationListItem[],
        hostReservations: [] as ReservationListItem[],
    }),

    actions: {
        async createReservation(propertyType: string, id: number, details: Partial<ReservationRequest>) {
            const auth = useAuthStore()
            const config = useRuntimeConfig()
            
            // Proactive session check: if state is empty, try to restore from cookies
            if (!auth.isAuthenticated || !auth.user) {
                auth.checkSession()
            }

            if (!auth.isAuthenticated) {
                console.warn('Reservation failed: No active session found.')
                return { success: false, message: 'Session expirée ou non trouvée. Veuillez vous reconnecter.' }
            }

            if (!auth.user) {
                console.warn('Reservation failed: Authenticated but user data is missing.', auth.token)
                return { success: false, message: 'Données utilisateur introuvables. Veuillez vous reconnecter.' }
            }

            const elig = evaluateReservationEligibility(auth.user as Record<string, unknown>)
            if (!elig.ok) {
                return {
                    success: false,
                    message: elig.message ?? 'Réservation non autorisée.',
                    code: elig.code,
                }
            }

            this.isSubmitting = true
            this.lastError = null

            let path: string = ApiEndpoints.createReservation
            const userId = auth.user.userId || (auth.user as any).id || (auth.user as any).userId
            
            const body: any = {
                userId: userId,
                startDate: details.startDate,
                endDate: details.endDate,
                message: details.message || 'Demande de réservation via Dashboard',
                type: details.type || 'VIP',
                reservationHeure: details.reservationHeure || new Date().toLocaleTimeString('fr-FR', { hour12: false })
            }

            // Map ID based on type and adjust payload
            const type = propertyType.toLowerCase()
            
            if (type.includes('terrain')) {
                path = ApiEndpoints.addReservationTerrain
                body.terrainId = id
            } else if (type.includes('bureau')) {
                path = ApiEndpoints.addReservationBureau
                body.bureauId = id
                body.createdAt = new Date().toISOString().split('T')[0]
                body.status = 'PENDING'
            } else if (type.includes('festive') || type.includes('fête')) {
                path = ApiEndpoints.addReservationFestive
                body.festiveId = id
                body.createdAt = new Date().toISOString().split('T')[0]
                body.status = 'PENDING'
            } else if (type.includes('funeraire')) {
                path = ApiEndpoints.addReservationFuneraire
                body.funeraireId = id
            } else if (type === 'chambre' || (type.includes('chambre') && !type.includes('vacance'))) {
                /** Réservation hôtel : une chambre — `POST …/public/property/hotels/chambre/{chambreId}` (relatif, joint une seule fois ci-dessous) */
                path = `${ApiEndpoints.publicPropertyHotelChambreReservation}/${id}`
                body.chambreId = id
            } else if (type.includes('vacance')) {
                path = ApiEndpoints.addReservationVacance
                body.vacanceId = id
            } else {
                path = ApiEndpoints.createReservation
                body.propertyId = id
                body.createdAt = new Date().toISOString().split('T')[0]
                body.status = 'PENDING'
            }

            try {
                console.log('Attempting reservation with token:', auth.token ? `${auth.token.substring(0, 10)}...` : 'NULL')
                const response: any = await $fetch(joinApi(config.public.apiBase as string, path), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    },
                    body
                })

                this.isSubmitting = false
                // Trigger refresh after creation
                this.fetchUserReservations(true)
                return { success: true, data: response }
            } catch (error: any) {
                this.isSubmitting = false
                console.error('Reservation API Error:', error.status, error.data)
                
                if (error.status === 401 || error.status === 403) {
                    return { success: false, message: 'Session invalide ou expirée (Erreur Serveur). Veuillez vous reconnecter.' }
                }

                this.lastError = error.data?.message || 'Erreur lors de la réservation'
                return { success: false, message: this.lastError }
            }
        },

        /**
         * Toutes les réservations du membre (standard + spécialisées), comme ReservationController.getMyReservations().
         */
        async fetchUserReservations(force = false): Promise<ReservationListItem[]> {
            if (!force && this.userReservations.length > 0) return this.userReservations

            const auth = useAuthStore()
            const config = useRuntimeConfig()

            if (!auth.isAuthenticated || !auth.user) {
                auth.checkSession()
            }

            if (!auth.isAuthenticated || !auth.token) return []

            const user = auth.user
            if (!user) return []

            const userId = user.userId || (user as { id?: number }).id
            if (userId == null) return []

            const apiBase = config.public.apiBase as string
            const headers = { Authorization: `Bearer ${auth.token}` }

            const endpoints: { cat: string; path: string }[] = [
                {
                    cat: 'standard',
                    path: joinApi(
                        apiBase,
                        `${ApiEndpoints.reservationsProtected}/${ApiEndpoints.reservationsByUser}/${userId}`
                    ),
                },
                { cat: 'vacance', path: joinApi(apiBase, `${ApiEndpoints.reservationsVacanceByUser}${userId}`) },
                { cat: 'terrain', path: joinApi(apiBase, `${ApiEndpoints.reservationsTerrainByUser}${userId}`) },
                { cat: 'funeraire', path: joinApi(apiBase, `${ApiEndpoints.reservationsFuneraireByUser}${userId}`) },
                { cat: 'festive', path: joinApi(apiBase, `${ApiEndpoints.reservationsFestiveByUser}${userId}`) },
                { cat: 'bureau', path: joinApi(apiBase, `${ApiEndpoints.reservationsBureauByUser}${userId}`) },
                { cat: 'chambre', path: joinApi(apiBase, `${ApiEndpoints.reservationsChambreByUser}${userId}`) },
            ]

            const collected: ReservationListItem[] = []

            await Promise.all(
                endpoints.map(async ({ cat, path }) => {
                    try {
                        const data = await $fetch(path, { headers })
                        for (const item of extractReservationArray(data)) {
                            const n = normalizeReservation(item, cat)
                            if (n) collected.push(n)
                        }
                    } catch (e) {
                        console.warn(`[reservations] ${path}`, e)
                    }
                })
            )

            const seen = new Set<number>()
            const deduped = collected.filter((r) => {
                if (seen.has(r.reservationId)) return false
                seen.add(r.reservationId)
                return true
            })

            deduped.sort((a, b) => {
                const da = a.createdAt || a.startDate || ''
                const db = b.createdAt || b.startDate || ''
                return db.localeCompare(da)
            })

            this.userReservations = deduped
            return deduped
        },

        /**
         * Réservations reçues en tant qu’hôte (sur vos annonces) — aligné sur
         * ReservationController.getHostReservations() (endpoints `.../user/host/{id}`).
         */
        async fetchHostReservations(force = false): Promise<ReservationListItem[]> {
            if (!force && this.hostReservations.length > 0) return this.hostReservations

            const auth = useAuthStore()
            const config = useRuntimeConfig()

            if (!auth.isAuthenticated || !auth.user) {
                auth.checkSession()
            }

            if (!auth.isAuthenticated || !auth.token) return []

            const user = auth.user
            if (!user) return []

            const userId = user.userId || (user as { id?: number }).id
            if (userId == null) return []

            const apiBase = config.public.apiBase as string
            const headers = { Authorization: `Bearer ${auth.token}` }

            const endpoints: { cat: string; path: string }[] = [
                { cat: 'standard', path: joinApi(apiBase, `${ApiEndpoints.reservationsHost}${userId}`) },
                { cat: 'vacance', path: joinApi(apiBase, `${ApiEndpoints.reservationsVacanceByHost}${userId}`) },
                { cat: 'terrain', path: joinApi(apiBase, `${ApiEndpoints.reservationsTerrainByHost}${userId}`) },
                { cat: 'funeraire', path: joinApi(apiBase, `${ApiEndpoints.reservationsFuneraireByHost}${userId}`) },
                { cat: 'festive', path: joinApi(apiBase, `${ApiEndpoints.reservationsFestiveByHost}${userId}`) },
                { cat: 'bureau', path: joinApi(apiBase, `${ApiEndpoints.reservationsBureauByHost}${userId}`) },
                { cat: 'chambre', path: joinApi(apiBase, `${ApiEndpoints.reservationsChambreByHost}${userId}`) },
            ]

            const collected: ReservationListItem[] = []

            await Promise.all(
                endpoints.map(async ({ cat, path }) => {
                    try {
                        const data = await $fetch(path, { headers })
                        for (const item of extractReservationArray(data)) {
                            const n = normalizeReservation(item, cat)
                            if (n) collected.push(n)
                        }
                    } catch (e) {
                        console.warn(`[reservations host] ${path}`, e)
                    }
                })
            )

            const seen = new Set<number>()
            const deduped = collected.filter((r) => {
                if (seen.has(r.reservationId)) return false
                seen.add(r.reservationId)
                return true
            })

            deduped.sort((a, b) => {
                const da = a.createdAt || a.startDate || ''
                const db = b.createdAt || b.startDate || ''
                return db.localeCompare(da)
            })

            this.hostReservations = deduped
            return deduped
        },

        /**
         * Réservations chambre / hôtel reçues en tant qu’hôte uniquement
         * (`GET .../protected/reservations/chambre/user/host/{userId}`).
         */
        async fetchHostChambreReservationsOnly(force = false): Promise<ReservationListItem[]> {
            const auth = useAuthStore()
            const userId = auth.user?.userId || (auth.user as { id?: number })?.id
            
            if (!force && this.hostReservations.length > 0) {
                 const cached = this.hostReservations.filter(r => r.sourceCategory === 'chambre')
                 if (cached.length > 0) return cached
            }

            const config = useRuntimeConfig()

            if (!auth.isAuthenticated || !auth.user) {
                auth.checkSession()
            }

            if (!auth.isAuthenticated || !auth.token) return []

            const user = auth.user
            if (!user) return []

            if (userId == null) return []

            const apiBase = config.public.apiBase as string
            const headers = { Authorization: `Bearer ${auth.token}` }
            const path = joinApi(apiBase, `${ApiEndpoints.reservationsChambreByHost}${userId}`)

            try {
                const data = await $fetch(path, { headers })
                const collected: ReservationListItem[] = []
                for (const item of extractReservationArray(data)) {
                    const n = normalizeReservation(item, 'chambre')
                    if (n) collected.push(n)
                }
                collected.sort((a, b) => {
                    const da = a.createdAt || a.startDate || ''
                    const db = b.createdAt || b.startDate || ''
                    return db.localeCompare(da)
                })
                return collected
            } catch (e) {
                console.warn(`[reservations host chambre] ${path}`, e)
                return []
            }
        },

        /** Compteurs par statut (depuis la liste déjà chargée ou refetch léger). */
        countByStatus(list: ReservationListItem[]) {
            const norm = (s: string) => s.toUpperCase()
            return {
                all: list.length,
                pending: list.filter((r) => norm(r.status) === 'PENDING').length,
                confirmed: list.filter((r) => norm(r.status) === 'CONFIRMED' || norm(r.status) === 'ACCEPTED').length,
                completed: list.filter((r) => norm(r.status) === 'COMPLETED' || norm(r.status) === 'FINISHED').length,
                cancelled: list.filter((r) => norm(r.status) === 'CANCELLED' || norm(r.status) === 'REJECTED').length,
            }
        },

        async validateReservationNotification(
            reservationId: number,
            accept: boolean
        ): Promise<{ success: boolean; message?: string }> {
            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.token) return { success: false, message: 'Non authentifié' }
            try {
                await $fetch(
                    joinApi(
                        config.public.apiBase as string,
                        `${ApiEndpoints.validateReservationNotification}${reservationId}/${accept}`
                    ),
                    {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${auth.token}` },
                        body: {},
                    }
                )
                return { success: true }
            } catch (e: any) {
                const msg = e?.data?.message || e?.message || 'Action impossible'
                return { success: false, message: String(msg) }
            }
        },

        /** Annulation côté client — aligné ReservationController.cancelReservation (DELETE + motif). */
        async cancelReservation(
            reservationId: number,
            cancellationReason: string
        ): Promise<{ success: boolean; message?: string }> {
            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.token) return { success: false, message: 'Non authentifié' }
            try {
                await $fetch(
                    joinApi(
                        config.public.apiBase as string,
                        `${ApiEndpoints.reservations}/delete/${reservationId}`
                    ),
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: {
                            cancellationReason: cancellationReason?.trim() || 'Annulée par l’utilisateur',
                        },
                    }
                )
                return { success: true }
            } catch (e: any) {
                const msg = e?.data?.message || e?.message || 'Annulation impossible'
                return { success: false, message: String(msg) }
            }
        },
    },
})
