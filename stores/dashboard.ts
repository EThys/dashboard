import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import type { DeviseRow } from './payment'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        users: [] as any[],
        properties: [] as any[],
        services: [] as any[],
        payments: [] as any[],
        flatPayments: [] as any[], // Deduplicated flat payments for global use
        devises: [] as DeviseRow[],
        lastFetch: null as Date | null,
        isLoading: false
    }),

    actions: {
        async fetchStats(apiBase: string, force = false) {
            const auth = useAuthStore()
            // Cache for 5 minutes
            if (!force && this.lastFetch && (new Date().getTime() - this.lastFetch.getTime()) < 300000) {
                return
            }

            this.isLoading = true
            try {
                const authHeaders = auth.token ? { Authorization: `Bearer ${auth.token}` } as Record<string, string> : undefined
                const isAdmin = auth.isAdmin

                const [usersRes, propRes, terrainRes, bureauRes, hotelRes, festiveRes, funeraireRes, servRes, payRes, devRes]: any = await Promise.all([
                    auth.token
                        ? $fetch(joinApi(apiBase, ApiEndpoints.allUsers), { headers: authHeaders })
                        : Promise.resolve({ data: [] }),
                    $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedProperties : ApiEndpoints.properties), isAdmin ? { headers: authHeaders } : undefined),
                    $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyTerrains : ApiEndpoints.propertyTerrains), isAdmin ? { headers: authHeaders } : undefined),
                    $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyBureaux : ApiEndpoints.propertyBureaux), isAdmin ? { headers: authHeaders } : undefined),
                    $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyHotels : ApiEndpoints.propertyHotelsPublic), isAdmin ? { headers: authHeaders } : undefined),
                    $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyFestives : ApiEndpoints.propertyFestives), isAdmin ? { headers: authHeaders } : undefined),
                    $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyFuneraires : ApiEndpoints.propertyFuneraires), isAdmin ? { headers: authHeaders } : undefined),
                    $fetch(joinApi(apiBase, ApiEndpoints.publicPrestations)),
                    auth.isAdmin && auth.token 
                        ? $fetch(joinApi(apiBase, ApiEndpoints.paymentUsers), { headers: authHeaders })
                        : Promise.resolve({ payments: [] }),
                    auth.token
                        ? $fetch(joinApi(apiBase, ApiEndpoints.devises), { headers: authHeaders })
                        : Promise.resolve({ devises: [] })
                ])

                this.users = usersRes.data || usersRes || []
                
                // Consolidate all property types
                this.properties = [
                    ...(propRes.properties || []),
                    ...(terrainRes.terrain || []),
                    ...(bureauRes.bureaux || []),
                    ...(hotelRes.data || []),
                    ...(festiveRes.festives || []),
                    ...(funeraireRes.funeraires || [])
                ]
                
                this.services = servRes.prestations || servRes || []

                if (payRes && payRes.payments) {
                    const groups = Array.isArray(payRes?.payments) ? payRes.payments : []
                    // Normal all payments (legacy)
                    const tempAll: any[] = []
                    groups.forEach((g: any) => {
                        const list = Array.isArray(g.payment) ? g.payment : []
                        list.forEach((p: any) => tempAll.push(p))
                    })
                    this.payments = tempAll

                    // Deduplicated ones for precise totals matching payments.vue
                    const seen = new Set<string>()
                    const flatOut: any[] = []
                    for (const g of groups) {
                        const u = g.user
                        const list = Array.isArray(g.payment) ? g.payment : []
                        for (const p of list) {
                            const uid = p.userId ?? u?.userId
                            const key = `${uid}-${p.id}`
                            if (seen.has(key)) continue
                            seen.add(key)
                            flatOut.push({ user: u, payment: { ...p, userId: uid } })
                        }
                    }
                    flatOut.sort((a, b) => {
                        const idA = a.payment.id ?? 0
                        const idB = b.payment.id ?? 0
                        return idB - idA
                    })
                    this.flatPayments = flatOut
                }

                if (devRes && devRes.devises) {
                    this.devises = devRes.devises
                }

                this.lastFetch = new Date()
            } catch (error) {
                console.error('Error fetching dashboard stats:', error)
            } finally {
                this.isLoading = false
            }
        }
    }
})
