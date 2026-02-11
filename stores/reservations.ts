import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

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
        lastError: null as string | null
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

            this.isSubmitting = true
            this.lastError = null

            let endpoint = '/reservations'
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
                endpoint = '/reservations/terrain'
                body.terrainId = id
            } else if (type.includes('bureau')) {
                endpoint = '/reservations/bureau'
                body.bureauId = id
                body.createdAt = new Date().toISOString().split('T')[0]
                body.status = 'PENDING'
            } else if (type.includes('festive') || type.includes('fête')) {
                endpoint = '/reservations/festive'
                body.festiveId = id
                body.createdAt = new Date().toISOString().split('T')[0]
                body.status = 'PENDING'
            } else if (type.includes('funeraire')) {
                endpoint = '/reservations/funeraire'
                body.funeraireId = id
            } else if (type.includes('hotel') || type.includes('vacance')) {
                endpoint = '/reservations/vacance'
                body.vacanceId = id
            } else {
                endpoint = '/reservations'
                body.propertyId = id
                body.createdAt = new Date().toISOString().split('T')[0]
                body.status = 'PENDING'
            }

            try {
                console.log('Attempting reservation with token:', auth.token ? `${auth.token.substring(0, 10)}...` : 'NULL')
                const response: any = await $fetch(`${config.public.apiBase}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    },
                    body
                })

                this.isSubmitting = false
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

        async fetchUserReservations() {
            const auth = useAuthStore()
            const config = useRuntimeConfig()

            if (!auth.isAuthenticated || !auth.user) {
                auth.checkSession()
            }

            if (!auth.isAuthenticated) return []

            const user = auth.user
            if (!user) return []

            const userId = user.userId || (user as any).id || (user as any).userId
            
            try {
                const response: any = await $fetch(`${config.public.apiBase}/reservations/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                })
                
                // Assuming response is an array of reservations or contains an array
                return response?.reservations || response || []
            } catch (error) {
                console.error('Failed to fetch user reservations:', error)
                return []
            }
        }
    }
})
