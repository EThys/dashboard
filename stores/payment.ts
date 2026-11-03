import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'

export interface DeviseRow {
    id?: number
    name?: string
    code: string
    tauxLocal?: number
    taux?: number
}

export interface PaymentRow {
    id?: number
    reference?: string
    amount?: string | number
    devise?: string
    description?: string
    typePayment?: string
    status?: string
    dateCreated?: string
    dateUpdated?: string
    userId?: number
}

function convertAmount(devises: DeviseRow[], amount: number, fromCode: string, toCode: string): number {
    if (fromCode === toCode) return amount
    const fallback = (code: string): DeviseRow => {
        if (code === 'USD') return { code: 'USD', tauxLocal: 1 }
        if (code === 'CDF') return { code: 'CDF', tauxLocal: 2200 }
        return { code, tauxLocal: 1 }
    }
    const from = devises.find((d) => d.code === fromCode) ?? fallback(fromCode)
    const to = devises.find((d) => d.code === toCode) ?? fallback(toCode)
    const fromT = from.tauxLocal ?? 1
    const toT = to.tauxLocal ?? 1
    return (amount / fromT) * toT
}

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        isLoadingSubscribe: false,
        isLoadingHistory: false,
        isLoadingDevises: false,
        devises: [] as DeviseRow[],
        history: [] as PaymentRow[],
        historyUserId: null as number | null,
        historyReady: false,
        lastHistoryPremium: null as boolean | null,
    }),

    actions: {
        convert(amount: number, fromCode: string, toCode: string) {
            return convertAmount(this.devises, amount, fromCode, toCode)
        },

        async fetchDevises(apiBase: string) {
            const auth = useAuthStore()
            this.isLoadingDevises = true
            try {
                const headers: Record<string, string> = {}
                if (auth.token) headers.Authorization = `Bearer ${auth.token}`
                const url = joinApi(apiBase, ApiEndpoints.devises)
                const res: any = await $fetch(url, { headers })
                if (res?.devises && Array.isArray(res.devises)) {
                    this.devises = res.devises
                    return
                }
                if (Array.isArray(res)) {
                    this.devises = res
                    return
                }
                if (res?.data && Array.isArray(res.data)) {
                    this.devises = res.data
                }
            } catch (e) {
                console.error('fetchDevises:', e)
                if (this.devises.length === 0) {
                    this.devises = [
                        { id: 1, name: 'Franc Congolais', code: 'CDF', tauxLocal: 2200 },
                        { id: 2, name: 'Dollar américain', code: 'USD', tauxLocal: 1 },
                    ]
                }
            } finally {
                this.isLoadingDevises = false
            }
        },

        resolveDeviseId(code: string): number {
            const row = this.devises.find((d) => d.code === code)
            if (row?.id != null) return row.id
            if (code === 'USD') return 2
            return 1
        },

        async subscribe(apiBase: string, phone: string, deviseId: number) {
            const auth = useAuthStore()
            if (!auth.token) {
                return { success: false as const, message: 'Session expirée. Reconnectez-vous.' }
            }
            this.isLoadingSubscribe = true
            try {
                const data: any = await $fetch(joinApi(apiBase, ApiEndpoints.paymentSubscription), {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: { phone, deviseId },
                })
                if (data && typeof data === 'object' && 'code' in data) {
                    const code = (data as any).code
                    if (code !== 200 && code !== 201 && code !== '200' && code !== '201' && code !== 0 && code !== '0') {
                        return {
                            success: false as const,
                            message: String((data as any).message ?? 'Erreur lors du paiement'),
                        }
                    }
                }
                return { success: true as const, data }
            } catch (error: any) {
                const msg =
                    error?.data?.message ||
                    error?.data?.error ||
                    error?.message ||
                    'Impossible de contacter le serveur de paiement.'
                return { success: false as const, message: String(msg) }
            } finally {
                this.isLoadingSubscribe = false
            }
        },

        async payWithCard(apiBase: string, deviseId: number) {
            const auth = useAuthStore()
            if (!auth.token) {
                return { success: false as const, message: 'Session expirée. Reconnectez-vous.' }
            }
            this.isLoadingSubscribe = true
            try {
                const data: any = await $fetch(joinApi(apiBase, ApiEndpoints.paymentCard), {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: { deviseId },
                })
                if (data && typeof data === 'object' && 'code' in data) {
                    const code = (data as any).code
                    if (code !== 200 && code !== 201 && code !== '200' && code !== '201' && code !== 0 && code !== '0') {
                        return {
                            success: false as const,
                            message: String((data as any).message ?? 'Erreur lors du paiement par carte'),
                        }
                    }
                }
                return { success: true as const, data }
            } catch (error: any) {
                const msg =
                    error?.data?.message ||
                    error?.data?.error ||
                    error?.message ||
                    'Impossible de contacter le serveur de paiement par carte.'
                return { success: false as const, message: String(msg) }
            } finally {
                this.isLoadingSubscribe = false
            }
        },

        async fetchPaymentHistory(apiBase: string, userId: number, force = false) {
            const auth = useAuthStore()
            if (!auth.token) return { payments: [] as PaymentRow[], isPremium: null as boolean | null }
            if (!force && this.historyReady && this.historyUserId === userId) {
                return { payments: this.history, isPremium: this.lastHistoryPremium }
            }
            this.isLoadingHistory = true
            try {
                const res: any = await $fetch(joinApi(apiBase, `${ApiEndpoints.paymentHistory}${userId}`), {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
                const log = res?.log
                const payments = ((log?.payment ?? []) as PaymentRow[]).slice().sort((a, b) => {
                    const dA = a.dateCreated ? new Date(a.dateCreated).getTime() : 0
                    const dB = b.dateCreated ? new Date(b.dateCreated).getTime() : 0
                    return dB - dA
                })
                const u = log?.user
                const isPremium =
                    u?.premium === true || u?.isPremium === true ? true : u?.premium === false ? false : null
                this.history = payments
                this.historyUserId = userId
                this.historyReady = true
                this.lastHistoryPremium = isPremium
                return { payments, isPremium }
            } catch (e) {
                console.error('fetchPaymentHistory:', e)
                if (this.historyUserId !== userId) {
                    this.history = []
                    this.historyUserId = userId
                }
                this.historyReady = true
                return { payments: this.history, isPremium: this.lastHistoryPremium }
            } finally {
                this.isLoadingHistory = false
            }
        },
    },
})
