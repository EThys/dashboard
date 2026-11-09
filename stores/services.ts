import { defineStore } from 'pinia'
import type { ServiceItem } from '@/types/service'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { byNewest, serviceStamp } from '@/utils/recentFirst'

export const useServiceStore = defineStore('services', {
    state: () => ({
        services: [] as ServiceItem[],
        categories: [] as any[],
        lastFetch: null as Date | null,
        categoriesLastFetch: null as Date | null,
        loadedCategories: new Set<number>()
    }),

    getters: {
        getServiceById: (state) => (id: number) => {
            return state.services.find((item) => item.prestation.id == id)
        },
        getServicesByCategoryId: (state) => (categoryId: number) => {
            // Filter services where serviceId (which is the account type ID) matches
            return state.services.filter((item) => item.prestation.serviceId == categoryId)
        },
        getCategories: (state) => state.categories
    },

    actions: {
        setServices(data: ServiceItem[]) {
            this.services = byNewest(data, serviceStamp)
            this.lastFetch = new Date()
        },

        setCategories(data: any[]) {
            this.categories = data
            this.categoriesLastFetch = new Date()
        },

        appendServices(data: ServiceItem[]) {
            const existingIds = new Set(this.services.map(s => s.prestation.id))
            const newServices = data.filter(s => !existingIds.has(s.prestation.id))
            this.services.push(...newServices)
            this.services = byNewest(this.services, serviceStamp)
        },

        async fetchCategories(apiBase: string) {
            // Return existing if already loaded
            if (this.categories.length > 0) return

            try {
                // Use $fetch for direct API call
                const data = await $fetch<any>(joinApi(apiBase, ApiEndpoints.accounts), { timeout: 10000 })

                if (data && data.accounts) {
                    const serviceProviders = data.accounts.filter((acc: any) => acc.typeAccount?.name === 'Prestataire de service')
                    this.setCategories(serviceProviders)
                }

            } catch (e) {
                console.error("Failed to fetch categories", e)
            }
        },

        async fetchServicesByCategory(categoryId: number, apiBase: string) {
            // 1. We already return local data via getter, this action just background fetches

            // 2. Fetch from API
            try {
                // Use $fetch for direct API call
                const data = await $fetch<any>(joinApi(apiBase, ApiEndpoints.publicPrestations), {
                    query: { serviceId: categoryId },
                    timeout: 10000
                })

                if (data && data.prestations) {
                    this.appendServices(data.prestations)
                    this.loadedCategories.add(categoryId)
                }
            } catch (e) {
                console.error("Failed to fetch background services", e)
            }
        },

        async updateService(id: number, updates: any, apiBase: string) {
            try {
                // Optimistic Update
                const index = this.services.findIndex(s => s.prestation.id === id)
                if (index !== -1) {
                    this.services[index].prestation = {
                        ...this.services[index].prestation,
                        ...updates
                    }
                }

                const token = useCookie<string | null>('auth_token').value
                const headers: Record<string, string> = {}
                if (token) headers.Authorization = `Bearer ${token}`
                await $fetch(joinApi(apiBase, `${ApiEndpoints.updatePrestation}${id}`), {
                    method: 'PATCH',
                    body: updates,
                    headers,
                    timeout: 10000
                })

            } catch (e) {
                console.error("Failed to update service", e)
                // Optional: Revert changes on error
            }
        },

        async fetchServices(apiBase: string) {
            // Fetch all services
            if (this.services.length > 0) return

            try {
                const data = await $fetch<any>(joinApi(apiBase, ApiEndpoints.publicPrestations), { timeout: 15000 })
                if (data && data.prestations) {
                    this.setServices(data.prestations)
                }
            } catch (e) {
                console.error("Failed to fetch all services", e)
            }
        },
        reset() {
            this.services = []
            this.categories = []
            this.lastFetch = null
            this.categoriesLastFetch = null
            this.loadedCategories.clear()
        }
    }
})
